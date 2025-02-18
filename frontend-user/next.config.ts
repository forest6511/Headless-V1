import type { NextConfig } from 'next'

// Next.jsの設定オブジェクト
const nextConfig: NextConfig = {
  // CSSの最適化を実験的機能として有効化
  // これにより、未使用のCSSを削減し、最終的なCSSファイルのサイズを最小化
  experimental: {
    optimizeCss: true,
  },

  // webpackの設定をカスタマイズ
  webpack: (config, { isServer }) => {
    // サーバーサイド以外の環境で実行
    if (!isServer) {
      // resolve.fallbackの設定
      // punycodeモジュールを無効化（必要に応じて）
      config.resolve.fallback = {
        ...config.resolve.fallback,
        punycode: false,
      }
    }
    return config
  },

  // 画像最適化の設定
  images: {
    // 画像を提供するドメインを指定
    domains: ['img.miwara.com'],

    // サポートする画像フォーマット
    formats: ['image/avif', 'image/webp'],

    // レスポンシブ対応のデバイスサイズ
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],

    // 追加の画像サイズオプション
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // HTTPヘッダーのカスタム設定
  headers: async () => {
    return [
      {
        // Next.jsの静的アセット用のキャッシュ設定
        // 1日ごとにキャッシュを再検証
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, must-revalidate',
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
}

export default nextConfig