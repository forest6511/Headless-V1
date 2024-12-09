'use client'

import { useState, Key } from 'react'
import Link from 'next/link'
import { Edit, Trash2, Plus } from 'lucide-react'
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Button,
  Pagination,
  Chip,
} from '@nextui-org/react'
import { useRouter } from 'next/navigation'

const statuses = [
  { value: 'draft', label: '下書き' },
  { value: 'published', label: '公開済み' },
]

// モックデータ（ステータスを追加）
const posts = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  title: `記事タイトル ${i + 1}`,
  slug: `post-${i + 1}`,
  category: `カテゴリ ${(i % 3) + 1}`,
  date: new Date(2024, 0, i + 1).toISOString(),
  status: i % 2 === 0 ? 'published' : 'draft',
}))

export default function PostsPage() {
  const [page, setPage] = useState(1)
  const rowsPerPage = 5
  const pages = Math.ceil(posts.length / rowsPerPage)
  const items = posts.slice((page - 1) * rowsPerPage, page * rowsPerPage)
  const router = useRouter()

  const handleEdit = (id: number) => {
    console.log('編集:', id)
  }

  const handleDelete = (id: number) => {
    if (confirm('本当に削除しますか？')) {
      console.log('削除:', id)
    }
  }

  const getStatusColor = (status: string) => {
    return status === 'published' ? 'success' : 'warning'
  }

  const getStatusLabel = (status: string) => {
    return statuses.find((s) => s.value === status)?.label || status
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <Button
          color="primary"
          startContent={<Plus size={20} />}
          onClick={() => router.push('/admin/dashboard/posts/new')}
        >
          新規追加
        </Button>
      </div>

      <Table aria-label="記事一覧表">
        <TableHeader>
          <TableColumn>タイトル</TableColumn>
          <TableColumn>スラッグ</TableColumn>
          <TableColumn>カテゴリ</TableColumn>
          <TableColumn>日付</TableColumn>
          <TableColumn>ステータス</TableColumn>
          <TableColumn align="center">アクション</TableColumn>
        </TableHeader>
        <TableBody>
          {items.map((post) => (
            <TableRow key={post.id as Key}>
              <TableCell>
                <Link
                  href={`/posts/${post.slug}`}
                  className="text-primary hover:underline"
                >
                  {post.title}
                </Link>
              </TableCell>
              <TableCell>{post.slug}</TableCell>
              <TableCell>{post.category}</TableCell>
              <TableCell>
                {new Date(post.date).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })}
              </TableCell>
              <TableCell>
                <Chip color={getStatusColor(post.status)} variant="flat">
                  {getStatusLabel(post.status)}
                </Chip>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 justify-end">
                  <Button
                    isIconOnly
                    color="warning"
                    aria-label="編集"
                    onPress={() => handleEdit(post.id)}
                  >
                    <Edit size={20} />
                  </Button>
                  <Button
                    isIconOnly
                    color="danger"
                    aria-label="削除"
                    onPress={() => handleDelete(post.id)}
                  >
                    <Trash2 size={20} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-center">
        <Pagination
          total={pages}
          page={page}
          onChange={setPage}
          showControls
          variant="bordered"
        />
      </div>
    </div>
  )
}
