import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Silence workspace root detection warning caused by parent pnpm-lock.yaml
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
