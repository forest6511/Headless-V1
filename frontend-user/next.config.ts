import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    optimizeCss: true,
  },

  // Webpackの詳細最適化
  webpack: (config, { isServer }) => {
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
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.miwara.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],

    // レスポンシブ対応のデバイスサイズ
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // 詳細なヘッダー最適化
  headers: async () => {
    return [
      {
        // Next.jsの静的アセット用のキャッシュ設定
        // 1日ごとにキャッシュを再検証
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
        // 画像ファイル用のキャッシュ設定
        // 30日間キャッシュし、変更されない限り再利用
        source: '/(.*\\.(?:jpg|jpeg|gif|png|webp|avif))',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, immutable',
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
