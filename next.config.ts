import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbopack: {
      root: __dirname,
    },
  },
  /* config options here */
};

export default nextConfig;
