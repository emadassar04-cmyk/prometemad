import { ImageResponse } from "next/og";
import { getPersonalStyleBySlug } from "@/lib/data/personal-photos";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const locale = searchParams.get("locale") === "en" ? "en" : "ar";

  const style = slug ? await getPersonalStyleBySlug(slug) : null;

  const title = style ? (locale === "ar" ? style.title_ar : style.title_en) : "برومبتلي";
  const afterUrl = style?.example_after_url;
  const beforeUrl = style?.example_before_url;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          background: "oklch(17% 0.012 80)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            width: "466px",
            height: "630px",
            display: "flex",
            position: "relative",
          }}
        >
          {afterUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={afterUrl}
              width={466}
              height={630}
              style={{ objectFit: "cover" }}
              alt=""
            />
          )}
        </div>
        {beforeUrl && (
          <div
            style={{
              width: "160px",
              height: "630px",
              display: "flex",
              position: "relative",
              borderLeft: "4px solid oklch(74% 0.15 70)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={beforeUrl}
              width={160}
              height={630}
              style={{ objectFit: "cover" }}
              alt=""
            />
          </div>
        )}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "60px",
            gap: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "oklch(74% 0.15 70)",
              fontSize: "28px",
              fontWeight: 700,
            }}
          >
            برومبتلي ✦
          </div>
          <div
            style={{
              display: "flex",
              color: "oklch(93% 0.01 80)",
              fontSize: "52px",
              fontWeight: 700,
              lineHeight: 1.2,
              maxWidth: "550px",
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              color: "oklch(65% 0.02 80)",
              fontSize: "26px",
            }}
          >
            برومبت صور Gemini مجاني — انسخ وجرّبه بصورتك
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
