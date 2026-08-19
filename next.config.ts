import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
    // Allow SVGs since we use placeholders
    dangerouslyAllowSVG: true,
    unoptimized: true,
  },
};

export default config;
