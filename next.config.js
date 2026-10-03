/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.PORTFOLIO_E2E_BUILD === "1" ? ".next-e2e" : ".next",
  experimental: { cpus: 2 },
  devIndicators: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

module.exports = nextConfig;
