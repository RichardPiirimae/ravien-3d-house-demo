import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei", "@react-three/postprocessing"],
  turbopack: {
    root: __dirname,
  },
  devIndicators: false,
};

export default nextConfig;
