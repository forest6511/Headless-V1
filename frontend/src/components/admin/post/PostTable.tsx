import { Key } from 'react'
import Link from 'next/link'
import { Edit, Trash2 } from 'lucide-react'
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Button,
  Chip,
  Pagination,
} from '@nextui-org/react'
import { PostWithCategoryId } from '@/types/api/post/response'
import { POST_COLUMNS } from '@/config/constants'
import { PostStatuses } from '@/types/api/post/types'
import { getBreadcrumbForCategory } from '@/lib/utils/category'
import { CategoryListResponse } from '@/types/api/category/response'

interface PostTableProps {
  posts: PostWithCategoryId[]
  categories: CategoryListResponse[]
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export const PostTable = ({
  posts,
  categories,
  page,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
}: PostTableProps) => {
  const getStatusColor = (status: string) => {
    return status === 'PUBLISHED' ? 'success' : 'warning'
  }

  const getStatusLabel = (status: string) => {
    return PostStatuses.find((s) => s.value === status)?.label || status
  }

  return (
    <>
      <Table aria-label="記事一覧表">
        <TableHeader>
          {POST_COLUMNS.map((column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === 'actions' ? 'end' : 'start'}
            >
              {column.name}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
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
              <TableCell>
                {getBreadcrumbForCategory(post.categoryId, categories)}
              </TableCell>
              <TableCell>
                {/* TODO 共通化 */}
                {new Date(post.updateAt).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </TableCell>
              <TableCell>
                <Chip color={getStatusColor(post.postStatus)} variant="flat">
                  {getStatusLabel(post.postStatus)}
                </Chip>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 justify-end">
                  <Button
                    isIconOnly
                    color="warning"
                    aria-label="編集"
                    onPress={() => onEdit(post.id)}
                  >
                    <Edit size={20} />
                  </Button>
                  <Button
                    isIconOnly
                    color="danger"
                    aria-label="削除"
                    onPress={() => onDelete(post.id)}
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
          total={totalPages}
          page={page}
          onChange={onPageChange}
          showControls
          variant="bordered"
        />
      </div>
    </>
  )
}
