import { ArticleCard } from "@/components/article-card"

export default function Home() {
  const articles = [
    {
      title: "Next.jsでミドルウェアをこのように使用する必要があります",
      description: "Next.jsのミドルウェアは見過ごされがちですが、その可能性を理解すれば、ゲームチェンジャーとなります。もしあなたがまだ使用していないのなら...",
      author: {
        name: "Kliukhinkonstantin",
        image: "/placeholder.svg",
        role: "Stackademic"
      },
      date: "11月6日",
      reactions: 247,
      comments: 5,
      tags: ["nextjs", "middleware", "webdev"]
    },
    {
      title: "フロントエンド開発者が知っておくべき重要なパフォーマンス最適化",
      description: "現代のウェブアプリケーションでは、パフォーマンスが極めて重要です。このガイドでは、重要な最適化テクニックを紹介します...",
      author: {
        name: "テック太郎",
        image: "/placeholder.svg"
      },
      date: "12月27日",
      reactions: 183,
      comments: 12,
      tags: ["performance", "frontend", "optimization"]
    }
  ]

  return (
    <div className="py-4">
      {articles.map((article, index) => (
        <ArticleCard key={index} {...article} />
      ))}
    </div>
  )
}

