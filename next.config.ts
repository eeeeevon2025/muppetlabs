import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/illustrations/**",
        search: "",
      },
      {
        pathname: "/illustrations/**",
        search: "?v=10",
      },
    ],
  },
};

export default nextConfig;
