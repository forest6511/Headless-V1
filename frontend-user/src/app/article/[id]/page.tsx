import { Breadcrumbs, BreadcrumbItem } from '@nextui-org/react'
import { Card } from '@nextui-org/card'
import { ArticleCard } from '@/components/article-card'

// 記事データの型定義
interface Article {
  id: string
  category: string
  date: string
  title: string
  content: string
  tags: string[]
  likes: number
  comments: number
  readTime: string
}

// 記事データを取得する関数（実際にはAPIやCMSから取得します）
async function getArticle(id: string): Promise<Article | null> {
  // この例では静的なデータを返していますが、実際にはAPIやCMSからデータを取得します
  const articles: Article[] = [
    {
      id: '1',
      category: 'プログラミング',
      date: '2024年1月1日',
      title: 'Next.jsとTypeScriptで始める最新のWeb開発',
      content:
        'Next.jsとTypeScriptを使用したWeb開発の基本について解説します...',
      tags: ['Next.js', 'TypeScript', 'React'],
      likes: 42,
      comments: 15,
      readTime: '10分',
    },
    // 他の記事データ...
  ]

  return articles.find((article) => article.id === id) || null
}

// 全ての記事IDを取得する関数
async function getAllArticleIds(): Promise<string[]> {
  // この例では静的なデータを返していますが、実際にはAPIやCMSからデータを取得します
  return ['1', '2', '3']
}

export async function generateStaticParams() {
  const ids = await getAllArticleIds()
  return ids.map((id) => ({ id }))
}

export default async function ArticlePage({
  params,
}: {
  params: { id: string }
}) {
  const article = await getArticle(params.id)

  if (!article) {
    return <div>記事が見つかりません</div>
  }

  return (
    <div className="py-2">
      <Breadcrumbs>
        <BreadcrumbItem>
          <BreadcrumbItem href="/">ホーム111111</BreadcrumbItem>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbItem href={`/category/${article.category}`}>
            {article.category}
          </BreadcrumbItem>
        </BreadcrumbItem>
        <BreadcrumbItem>{article.title}</BreadcrumbItem>
      </Breadcrumbs>

      <div className="grid grid-cols-1">
        <div className="space-y-6">
          <article className="prose max-w-none">
            <h1>{article.title}</h1>
            <p className="text-default-500">{article.date}</p>
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </article>

          <div className="border-t pt-6">
            <h2 className="text-xl font-bold mb-4">コメント</h2>
            <Card className="p-4">
              <p>コメントフォームがここに入ります...</p>
            </Card>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">関連記事</h2>
            <div className="grid gap-4">
              <ArticleCard
                category="プログラミング"
                date="2024年1月1日"
                title="関連記事のタイトル"
                tags={['JavaScript', 'React']}
                likes={10}
                comments={5}
                readTime="5分"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
