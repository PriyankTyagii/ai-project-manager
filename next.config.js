/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Suppress hydration warnings
  reactStrictMode: true,
}

module.exports = nextConfig