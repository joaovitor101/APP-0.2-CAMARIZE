import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Temporariamente desabilitar ESLint para deploy
  },
  typescript: {
    ignoreBuildErrors: true, // Temporariamente desabilitar TypeScript para deploy
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  },
};

export default nextConfig;
