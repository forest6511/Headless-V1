import { ArticleCard } from '@/components/article-card'

// 記事データの型定義
interface Article {
  id: string
  category: string
  date: string
  title: string
  tags: string[]
  likes: number
  comments: number
  readTime: string
}

// 記事データを取得する関数（実際にはAPIやCMSから取得します）
async function getArticles(): Promise<Article[]> {
  // この例では静的なデータを返していますが、実際にはAPIやCMSからデータを取得します
  return [
    {
      id: '1',
      category: 'プログラミング',
      date: '2024年1月1日',
      title: 'Next.jsとTypeScriptで始める最新のWeb��発',
      tags: ['Next.js', 'TypeScript', 'React'],
      likes: 42,
      comments: 15,
      readTime: '10分',
    },
    {
      id: '2',
      category: 'インフラ',
      date: '2024年1月2日',
      title: 'DockerとKubernetesによるマイクロサービスアーキテクチャ入門',
      tags: ['Docker', 'Kubernetes', 'マイクロサービス'],
      likes: 38,
      comments: 12,
      readTime: '15分',
    },
    {
      id: '3',
      category: 'デザイン',
      date: '2024年1月3日',
      title: 'UIデザインの基本原則：使いやすさとユーザー体験の向上',
      tags: ['UI/UX', 'デザイン', 'ユーザー体験'],
      likes: 56,
      comments: 23,
      readTime: '8分',
    },
    {
      id: '3',
      category: 'デザイン',
      date: '2024年1月3日',
      title: 'UIデザインの基本原則：使いやすさとユーザー体験の向上',
      tags: ['UI/UX', 'デザイン', 'ユーザー体験'],
      likes: 56,
      comments: 23,
      readTime: '8分',
    },
    {
      id: '3',
      category: 'デザイン',
      date: '2024年1月3日',
      title: 'UIデザインの基本原則：使いやすさとユーザー体験の向上',
      tags: ['UI/UX', 'デザイン', 'ユーザー体験'],
      likes: 56,
      comments: 23,
      readTime: '8分',
    },
    {
      id: '3',
      category: 'デザイン',
      date: '2024年1月3日',
      title: 'UIデザインの基本原則：使いやすさとユーザー体験の向上',
      tags: ['UI/UX', 'デザイン', 'ユーザー体験'],
      likes: 56,
      comments: 23,
      readTime: '8分',
    },
    {
      id: '3',
      category: 'デザイン',
      date: '2024年1月3日',
      title: 'UIデザインの基本原則：使いやすさとユーザー体験の向上',
      tags: ['UI/UX', 'デザイン', 'ユーザー体験'],
      likes: 56,
      comments: 23,
      readTime: '8分',
    },
    {
      id: '3',
      category: 'デザイン',
      date: '2024年1月3日',
      title: 'UIデザインの基本原則：使いやすさとユーザー体験の向上',
      tags: ['UI/UX', 'デザイン', 'ユーザー体験'],
      likes: 56,
      comments: 23,
      readTime: '8分',
    },
    {
      id: '3',
      category: 'デザイン',
      date: '2024年1月3日',
      title: 'UIデザインの基本原則：使いやすさとユーザー体験の向上',
      tags: ['UI/UX', 'デザイン', 'ユーザー体験'],
      likes: 56,
      comments: 23,
      readTime: '8分',
    },
    {
      id: '3',
      category: 'デザイン',
      date: '2024年1月3日',
      title: 'UIデザインの基本原則：使いやすさとユーザー体験の向上',
      tags: ['UI/UX', 'デザイン', 'ユーザー体験'],
      likes: 56,
      comments: 23,
      readTime: '8分',
    },
    {
      id: '3',
      category: 'デザイン',
      date: '2024年1月3日',
      title: 'UIデザインの基本原則：使いやすさとユーザー体験の向上',
      tags: ['UI/UX', 'デザイン', 'ユーザー体験'],
      likes: 56,
      comments: 23,
      readTime: '8分',
    },
    {
      id: '3',
      category: 'デザイン',
      date: '2024年1月3日',
      title: 'UIデザインの基本原則：使いやすさとユーザー体験の向上',
      tags: ['UI/UX', 'デザイン', 'ユーザー体験'],
      likes: 56,
      comments: 23,
      readTime: '8分',
    },
  ]
}

export default async function Home() {
  const articles = await getArticles()

  return (
    <div className="py-6">
      <div className="grid grid-cols-1 gap-8 pb-24">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            category={article.category}
            date={article.date}
            title={article.title}
            tags={article.tags}
            likes={article.likes}
            comments={article.comments}
            readTime={article.readTime}
          />
        ))}
      </div>
    </div>
  )
}
