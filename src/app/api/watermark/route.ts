import { readFileSync } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import sharp from "sharp";

// Retrying the source fetch (below) can take up to ~70s in the worst
// case, well past Vercel's default function timeout — give it room.
export const maxDuration = 90;

const ALLOWED_SOURCE_HOSTS = new Set(["image.pollinations.ai"]);
const WATERMARK_TEXT = "برومبتلي";

// Vercel's serverless runtime has no Arabic-capable fonts installed, so a
// plain `font-family` in the SVG would silently rasterize as blank/tofu.
// Embedding the font as a data URI makes rendering self-contained.
const WATERMARK_FONT_BASE64 = readFileSync(
  path.join(process.cwd(), "src/fonts/watermark-arabic-600.woff"),
).toString("base64");

// Internal endpoint called by the n8n "Generate Image" workflow in place of
// fetching the provider URL directly, so every generated image gets a brand
// watermark before it's uploaded to Supabase Storage — one place to change
// the look, no matter which provider produces the pixels.
function buildWatermarkSvg(width: number, height: number) {
  const badgeHeight = Math.max(28, Math.round(height * 0.045));
  const fontSize = Math.round(badgeHeight * 0.5);
  const paddingX = Math.round(fontSize * 0.9);
  const badgeWidth = Math.round(WATERMARK_TEXT.length * fontSize * 0.62 + paddingX * 2);
  const margin = Math.round(height * 0.025);
  const x = width - badgeWidth - margin;
  const y = height - badgeHeight - margin;

  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          @font-face {
            font-family: "WatermarkArabic";
            src: url(data:font/woff;base64,${WATERMARK_FONT_BASE64}) format("woff");
            font-weight: 600;
          }
        </style>
      </defs>
      <rect x="${x}" y="${y}" width="${badgeWidth}" height="${badgeHeight}"
        rx="${badgeHeight / 2}" fill="black" fill-opacity="0.45" />
      <text x="${x + badgeWidth / 2}" y="${y + badgeHeight / 2}"
        font-family="WatermarkArabic" font-size="${fontSize}" font-weight="600"
        fill="white" fill-opacity="0.9" text-anchor="middle" dominant-baseline="central">
        ${WATERMARK_TEXT}
      </text>
    </svg>
  `;
}

export async function GET(request: Request) {
  const secret = process.env.N8N_WEBHOOK_SECRET;
  if (!secret || request.headers.get("x-webhook-secret") !== secret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const src = searchParams.get("src");
  if (!src) {
    return NextResponse.json({ error: "missing_src" }, { status: 400 });
  }

  let sourceUrl: URL;
  try {
    sourceUrl = new URL(src);
  } catch {
    return NextResponse.json({ error: "invalid_src" }, { status: 400 });
  }
  if (sourceUrl.protocol !== "https:" || !ALLOWED_SOURCE_HOSTS.has(sourceUrl.hostname)) {
    return NextResponse.json({ error: "src_not_allowed" }, { status: 400 });
  }

  // Pollinations has a real concurrency ceiling: when several variation
  // requests land at once, it keeps rejecting the overflow ones rather than
  // queuing them, so a couple of quick retries aren't always enough — back
  // off longer and try more times to actually outlast the busy window.
  const BACKOFF_MS = [0, 2000, 4000, 6000, 8000];
  let sourceResponse: Response | null = null;
  for (const delay of BACKOFF_MS) {
    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    try {
      const res = await fetch(sourceUrl, { signal: AbortSignal.timeout(12_000) });
      if (res.ok) {
        sourceResponse = res;
        break;
      }
    } catch {
      // network error or timeout — fall through and retry
    }
  }
  if (!sourceResponse) {
    return NextResponse.json({ error: "source_fetch_failed" }, { status: 502 });
  }
  const sourceBuffer = Buffer.from(await sourceResponse.arrayBuffer());

  try {
    const image = sharp(sourceBuffer);
    const metadata = await image.metadata();
    const width = metadata.width ?? 1024;
    const height = metadata.height ?? 1024;

    const watermarked = await image
      .composite([{ input: Buffer.from(buildWatermarkSvg(width, height)) }])
      .jpeg({ quality: 90 })
      .toBuffer();

    // A raw Node Buffer as the body gets mangled somewhere in this Next.js
    // version's response serialization (bytes >= 0x80 came out as repeated
    // EF BF BD, the UTF-8 replacement character, as if round-tripped through
    // a string) — a plain Uint8Array copy avoids whatever Buffer-specific
    // path causes that.
    return new NextResponse(new Uint8Array(watermarked), {
      status: 200,
      headers: { "Content-Type": "image/jpeg" },
    });
  } catch (err) {
    console.error("watermark failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "watermark_failed" }, { status: 500 });
  }
}
