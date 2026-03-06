import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here - cache bust */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
};

export default nextConfig;
