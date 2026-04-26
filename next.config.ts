import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [100],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 1080, 1920, 2560],
    imageSizes: [320, 640, 960, 1280],
  },
};

export default nextConfig;
