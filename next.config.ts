import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    tsconfigPath: "tsconfig.next.json",
  },
  async redirects() {
    return [
      {
        source: "/lingo/:path*",
        destination: "https://lingo.querypie.ai/ja",
        permanent: true,
      },
    ];
  },
  ...(process.env.TURBOPACK_ROOT
    ? { turbopack: { root: process.env.TURBOPACK_ROOT } }
    : {}),
};

export default nextConfig;
