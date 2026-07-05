import { NextResponse } from "next/server";
import sharp from "sharp";

// Temporary diagnostic-only route: fetches an image and reports per-channel
// pixel statistics, so we can tell "genuinely near-black image" apart from
// "looks black in a screenshot but has real content" without needing to
// view the pixels directly. Not part of the product surface — remove once
// the watermark black-image investigation is closed.
export async function GET(request: Request) {
  const secret = process.env.N8N_WEBHOOK_SECRET;
  if (!secret || request.headers.get("x-webhook-secret") !== secret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "missing_url" }, { status: 400 });
  }

  let sourceUrl: URL;
  try {
    sourceUrl = new URL(url);
  } catch {
    return NextResponse.json({ error: "invalid_url" }, { status: 400 });
  }
  if (
    sourceUrl.protocol !== "https:" ||
    !sourceUrl.hostname.endsWith(".supabase.co")
  ) {
    return NextResponse.json({ error: "url_not_allowed" }, { status: 400 });
  }

  const response = await fetch(sourceUrl, { signal: AbortSignal.timeout(30_000) });
  if (!response.ok) {
    return NextResponse.json(
      { error: "fetch_failed", status: response.status },
      { status: 502 },
    );
  }
  const buffer = Buffer.from(await response.arrayBuffer());

  try {
    const image = sharp(buffer);
    const [metadata, stats] = await Promise.all([image.metadata(), image.stats()]);

    return NextResponse.json({
      byteLength: buffer.length,
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      channels: stats.channels.map((c) => ({
        mean: c.mean,
        min: c.min,
        max: c.max,
        stdev: c.stdev,
      })),
    });
  } catch (err) {
    return NextResponse.json(
      { error: "stats_failed", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
