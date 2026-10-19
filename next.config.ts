import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      { source: "/collection", destination: "/#collection", permanent: false },
      { source: "/collections", destination: "/#collection", permanent: false },
      { source: "/film", destination: "/#film", permanent: false },
      { source: "/studio", destination: "/#studio", permanent: false },
      { source: "/about", destination: "/#about", permanent: false },
      { source: "/products", destination: "/#collection", permanent: false },
      { source: "/shop", destination: "/#collection", permanent: false },
      { source: "/lookbook", destination: "/#collection", permanent: false },
    ];
  },
};

export default nextConfig;
