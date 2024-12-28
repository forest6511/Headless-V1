import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ThumbsUp, MessageSquare, Bookmark, MoreHorizontal, ChevronRight } from 'lucide-react'
import Link from "next/link"

interface Article {
  id: string
  title: string
  content: string
  author: {
    name: string
    image: string
    role?: string
  }
  date: string
  reactions: number
  comments: number
  tags: string[]
}

async function getArticle(id: string): Promise<Article | null> {
  // この例では静的なデータを返していますが、実際にはAPIやCMSからデータを取得します
  const articles: Article[] = [
    {
      id: "1",
      title: "Next.jsでミドルウェアをこのように使用する必要があります",
      content: `
        <p>Next.jsのミドルウェアは見過ごされがちですが、その可能性を理解すれば、ゲームチェンジャーとなります。</p>
        <h2>ミドルウェアとは？</h2>
        <p>ミドルウェアは、リクエストが完了する前にコードを実行することができる機能です。これにより、認証やリダイレクト、ヘッダーの変更など、様々な処理を行うことができます。</p>
        <h2>基本的な使い方</h2>
        <p>プロジェクトのルートディレクトリに middleware.ts ファイルを作成することで、ミドルウェアを追加できます。</p>
      `,
      author: {
        name: "Kliukhinkonstantin",
        image: "/placeholder.svg",
        role: "Stackademic"
      },
      date: "11月6日",
      reactions: 247,
      comments: 5,
      tags: ["nextjs", "middleware", "webdev"]
    }
  ]

  return articles.find(article => article.id === id) || null
}

export async function generateStaticParams() {
  // この例では静的なIDを返していますが、実際にはAPIやCMSからデータを取得します
  return [{ id: "1" }]
}

export default async function ArticlePage({
                                            params,
                                          }: {
  params: { id: string }
}) {
  const article = await getArticle(params.id)

  if (!article) {
    return <div className="p-4">記事が見つかりません</div>
  }

  return (
    <div className="py-6 ml-4 mr-4 -mt-1 pb-2">
      <nav className="mb-6 overflow-auto">
        <ol className="flex min-w-0 items-center space-x-2 text-sm text-muted-foreground whitespace-nowrap">
          <li>
            <Link href="/" className="hover:text-foreground">
              ホーム
            </Link>
          </li>
          <li>
            <ChevronRight className="h-4 w-4" />
          </li>
          <li>
            <Link href="/t/nextjs" className="hover:text-foreground">
              Next.js
            </Link>
          </li>
          <li>
            <ChevronRight className="h-4 w-4" />
          </li>
          <li className="text-foreground font-medium">
            {article.title}
          </li>
        </ol>
      </nav>

      <article>
        <div className="flex items-center space-x-2 mb-6">
          <Avatar className="h-8 w-8">
            <AvatarImage src={article.author.image} alt={article.author.name} />
            <AvatarFallback>{article.author.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center">
              <Link href="#" className="font-medium hover:text-blue-600">
                {article.author.name}
              </Link>
              {article.author.role && (
                <>
                  <span className="mx-2 text-muted-foreground">for</span>
                  <span className="font-medium">{article.author.role}</span>
                </>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{article.date}</p>
          </div>
        </div>

        <h1 className="text-xl sm:text-3xl font-bold mb-4">{article.title}</h1>

        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {article.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tag/${tag}`}
                className="text-sm text-muted-foreground hover:text-blue-600"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        <div
          className="prose prose-lg max-w-none mb-3"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />


        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-2 border-t gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8 text-muted-foreground">
              <ThumbsUp className="mr-1 h-4 w-4" />
              <span className="text-sm">{article.reactions}</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-8 text-muted-foreground">
              <MessageSquare className="mr-1 h-4 w-4" />
              <span className="text-sm">{article.comments}</span>
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

      </article>
    </div>
  )
}

