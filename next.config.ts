import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  postcss: {
    plugins: {
      "@tailwindcss/postcss": {},
    },
  },
};

export default nextConfig;
