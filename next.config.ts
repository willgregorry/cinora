import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    const catalogBase =
      process.env.CATALOG_API_URL ||
      process.env.NEXT_PUBLIC_CATALOG_API_URL ||
      "http://localhost:8081";
    const bookingBase =
      process.env.BOOKING_API_URL ||
      process.env.NEXT_PUBLIC_BOOKING_API_URL ||
      "http://localhost:8082";
    const paymentBase =
      process.env.PAYMENT_API_URL ||
      process.env.NEXT_PUBLIC_PAYMENT_API_URL ||
      "http://localhost:8083";

    return [
      {
        source: "/api/catalog/:path*",
        destination: `${catalogBase}/api/v2/:path*`,
      },
      {
        source: "/api/booking/:path*",
        destination: `${bookingBase}/api/v2/:path*`,
      },
      {
        source: "/api/payment/:path*",
        destination: `${paymentBase}/api/v2/:path*`,
      },
    ];
  },
};

export default nextConfig;
