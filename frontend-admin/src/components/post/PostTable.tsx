import Link from 'next/link'
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Chip,
  Pagination,
  Select,
  SelectItem,
} from '@nextui-org/react'
import { PostResponse } from '@/types/api/post/response'
import { POST_COLUMNS } from '@/config/constants'
import { Language, Languages, PostStatuses } from '@/types/api/post/types'
import { getBreadcrumbForCategory } from '@/lib/utils/category'
import { CategoryListResponse } from '@/types/api/category/response'
import { PostActions } from '@/components/post/PostActions'
import { ROUTES } from '@/config/routes'
import { formatDateTime } from '@/lib/utils/post'

interface PostTableProps {
  posts: PostResponse[]
  categories: CategoryListResponse[]
  page: number
  totalPages: number
  currentLanguage: Language // 追加
  onPageChange: (page: number) => void
  onEdit: (id: string) => void
  onDelete: () => void
}

export const PostTable = ({
  posts,
  categories,
  page,
  totalPages,
  currentLanguage, // 追加
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

  const getPostTitle = (post: PostResponse) => {
    return post.translations.find((t) => t.language === currentLanguage)?.title
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
            <TableRow key={post.id}>
              <TableCell>
                <Link
                  href={ROUTES.DASHBOARD.POSTS.EDIT(post.id)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  {getPostTitle(post) || '(未翻訳)'}
                </Link>
              </TableCell>
              <TableCell>{post.slug}</TableCell>
              <TableCell>
                {getBreadcrumbForCategory(post.categoryId, categories)}
              </TableCell>
              <TableCell>
                {post.tags.map((tag) => tag.name).join(', ')}
              </TableCell>
              <TableCell>{formatDateTime(post.createdAt)}</TableCell>
              <TableCell>{formatDateTime(post.updatedAt)}</TableCell>
              <TableCell>
                <Chip color={getStatusColor(post.status)} variant="flat">
                  {getStatusLabel(post.status)}
                </Chip>
              </TableCell>
              <TableCell>
                <PostActions
                  postId={post.id}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
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
