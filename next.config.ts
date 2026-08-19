import type { NextConfig } from "next";

// Vercel manages its own build pipeline; `output: "standalone"` is only useful for Docker/self-hosting.
const isVercel = Boolean(process.env.VERCEL);
const isDocker = Boolean(process.env.DOCKER_BUILD) || !isVercel;

const config: NextConfig = {
  reactStrictMode: true,
  ...(isDocker ? { output: "standalone" as const } : {}),
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
    // Do NOT allow arbitrary SVGs — they can carry XSS payloads.
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        // Public, cacheable static assets
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default config;
