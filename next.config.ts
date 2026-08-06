import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    tsconfigPath: "tsconfig.next.json",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.querypie.com",
        pathname: "/assets/products/aip/**",
      },
      {
        protocol: "https",
        hostname: "www.querypie.com",
        pathname: "/assets/pages/company/about-us/**",
      },
    ],
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
  async headers() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "stage\\.querypie\\.ai",
          },
        ],
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
    ];
  },
  ...(process.env.TURBOPACK_ROOT
    ? { turbopack: { root: process.env.TURBOPACK_ROOT } }
    : {}),
};

export default nextConfig;
