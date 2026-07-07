import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "image.pollinations.ai" },
    ],
    // AVIF first (smaller than WebP at equivalent quality), falling back to
    // WebP, then the original format for browsers that support neither.
    formats: ["image/avif", "image/webp"],
  },
};

export default withNextIntl(nextConfig);
