import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // This tells Next.js to continue building even with TypeScript errors
    ignoreBuildErrors: true,
  },

};

export default nextConfig;
