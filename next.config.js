/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Skip API routes during static export
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      '/': { page: '/' },
      '/privacy': { page: '/privacy' },
      '/terms': { page: '/terms' },
    }
  },
  // Disable API routes for static export
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
}

module.exports = nextConfig
