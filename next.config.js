/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    formats: ["image/avif", "image/webp"],
    dangerouslyAllowSVG: true,
    remotePatterns: [{ hostname: "cdn.sanity.io" }]
  },
  typescript: {
    // Set this to false if you want production builds to abort if there's type errors
    // ignoreBuildErrors: process.env.VERCEL_ENV === "production",
    ignoreBuildErrors: true
  },
  eslint: {
    /// Set this to false if you want production builds to abort if there's lint errors
    //  ignoreDuringBuilds: process.env.VERCEL_ENV === "production"
    ignoreDuringBuilds: true
  }
};

module.exports = nextConfig;
