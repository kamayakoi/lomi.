import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  devIndicators: false,
  async redirects() {
    return [
      { source: '/docs', destination: '/', permanent: true },
      { source: '/docs/:path*', destination: '/:path*', permanent: true },
    ];
  },
  // // Performance optimizations for better navigation
  experimental: {
    optimizeServerReact: true,
    optimizeCss: process.env.NODE_ENV === 'production',
  },
  serverExternalPackages: ['prettier'],
  // Optimize prefetching for better navigation
  async headers() {
    // In development, don't set aggressive cache headers
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'X-DNS-Prefetch-Control',
              value: 'on',
            },
          ],
        },
      ];
    }

    // Production cache headers
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, immutable',
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mdswvokxrnfggrujsfjd.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'mdswvokxrnfggrujsfjd.supabase.co',
        port: '',
        pathname: '/storage/v1/object/sign/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 2419200, // 4 weeks - for efficient cache lifetime
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  productionBrowserSourceMaps: false,
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
};

export default withMDX(config);
