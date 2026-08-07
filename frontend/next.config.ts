import type { NextConfig } from "next";

/** Backend origin for /uploads proxy (matches lib/apiOrigin defaults). */
function mediaOrigin(): string {
  const media = process.env.NEXT_PUBLIC_MEDIA_ORIGIN?.trim();
  if (media) return media.replace(/\/$/, "");
  const api = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (api) {
    return api.replace(/\/api\/?$/, "").replace(/\/$/, "") || "http://localhost:5000";
  }
  return "http://localhost:5000";
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async rewrites() {
    const origin = mediaOrigin();
    return [
      {
        source: "/admin/blogs",
        destination: "/admin/posts",
      },
      {
        source: "/admin/blogs/:path*",
        destination: "/admin/posts/:path*",
      },
      {
        // Public + admin logos/media under /uploads/* → backend
        source: "/uploads/:path*",
        destination: `${origin}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
