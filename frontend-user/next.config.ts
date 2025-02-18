import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['next'],
  },

  // Webpackの詳細最適化
  webpack: (config, { isServer }) => {
    // コード分割と最適化
    config.optimization.minimize = true
    config.optimization.mergeDuplicateChunks = true
    config.optimization.splitChunks = {
      chunks: 'all',
      maxInitialRequests: 3,
      minSize: 20000,
      maxSize: 250000,
    }

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        punycode: false,
      }
    }

    return config
  },

  // 画像最適化の詳細設定
  images: {
    domains: ['img.miwara.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60, // キャッシュ最小時間（秒）
  },

  // 詳細なヘッダー最適化
  headers: async () => {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=3600',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
        ],
      },
      {
        source: '/(.*\\.(?:jpg|jpeg|gif|png|webp|avif))',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, immutable',
          },
          {
            key: 'Expires',
            value: new Date(Date.now() + 2592000000).toUTCString(),
          },
        ],
      },
      {
        source: '/(.*\\.(?:js|css))',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },

  // パフォーマンス最適化
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
}

export default nextConfig