import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: false, // Ensure TypeScript errors fail the build
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uncommon-guanaco-317.convex.cloud",
        pathname: "/api/storage/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "*.ufs.sh",
      },
    ],
  },
  turbopack: {
    resolveAlias: {
      "@imageflow/convex": path.resolve(__dirname, "../../convex"),
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@imageflow/convex": path.resolve(__dirname, "../../convex"),
    };
    return config;
  },
};

export default nextConfig;
