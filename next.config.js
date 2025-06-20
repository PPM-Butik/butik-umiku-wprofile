/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove the 'output: export' to allow API routes to work
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
