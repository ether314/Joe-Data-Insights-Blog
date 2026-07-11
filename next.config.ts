import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: "/politics/global-refugee-hosting-burden-2024",
        destination: "/blog/global-refugee-hosting-burden-2024",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
