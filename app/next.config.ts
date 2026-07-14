import type { NextConfig } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/api/:path*",
          destination: `${API_URL}/api/:path*`,
        },
        {
          source: "/socket.io/:path*",
          destination: `${API_URL}/socket.io/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
