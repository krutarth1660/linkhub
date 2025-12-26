/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@prisma/client'],
  images: {
    domains: ['uploadthing.com', 'utfs.io']
  },
  async rewrites() {
    return [
      {
        source: '/api/public/:username',
        destination: '/api/profile/:username'
      }
    ]
  },
  // Reduce hydration mismatches
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Suppress hydration warnings in development
  reactStrictMode: true,
  experimental: {
    suppressHydrationWarning: true,
  },
}

module.exports = nextConfig