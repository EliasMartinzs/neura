import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "cdn.dribbble.com",
      },
      {
        hostname: "avatars.githubusercontent.com",
      },
      {
        hostname: "res.cloudinary.com",
      },
    ],
  },
  allowedDevOrigins: ["http://192.168.0.154:3000"],
};

export default nextConfig;
