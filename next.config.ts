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
      {
        source: "/technology/ai-gpu-packaging-memory-bottleneck-2025",
        destination: "/blog/ai-gpu-packaging-memory-bottleneck-2025",
        permanent: true,
      },
      {
        source: "/technology/major-ai-brands-token-consumption-2022-2026",
        destination: "/blog/major-ai-brands-token-consumption-2022-2026",
        permanent: true,
      },
      {
        source: "/economics/deflationary-growth-economies-2025",
        destination: "/blog/deflationary-growth-economies-2025",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
