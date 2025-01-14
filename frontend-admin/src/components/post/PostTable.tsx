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
} from '@nextui-org/react'
import { PostResponse } from '@/types/api/post/response'
import { createPostColumns } from '@/config/constants'
import { Language } from '@/types/api/common/types'
import { getBreadcrumbForCategory } from '@/lib/utils/category'
import { CategoryListResponse } from '@/types/api/category/response'
import { PostActions } from '@/components/post/PostActions'
import { ROUTES } from '@/config/routes'
import { formatDateTime } from '@/lib/utils/post'
import { t } from '@/lib/translations'

interface PostTableProps {
  posts: PostResponse[]
  categories: CategoryListResponse[]
  page: number
  totalPages: number
  currentLanguage: Language
  onPageChange: (page: number) => void
  onEdit: (id: string) => void
  onDelete: () => void
}

export const PostTable = ({
  posts,
  categories,
  page,
  totalPages,
  currentLanguage,
  onPageChange,
  onEdit,
  onDelete,
}: PostTableProps) => {
  const getPostTitle = (post: PostResponse) => {
    return post.translations.find((t) => t.language === currentLanguage)?.title
  }

  const getStatusInfo = (post: PostResponse) => {
    const status = post.translations.find(
      (t) => t.language === currentLanguage
    )?.status
    return {
      color: status === 'PUBLISHED' ? 'success' : 'warning',
      label: status,
    } as const
  }

  return (
    <>
      <Table aria-label={t(currentLanguage, 'posts.tableLabel')}>
        <TableHeader>
          {createPostColumns(currentLanguage).map((column) => (
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
                  {getPostTitle(post) ||
                    t(currentLanguage, 'posts.notTranslated')}
                </Link>
              </TableCell>
              <TableCell>{post.slug}</TableCell>
              <TableCell>
                {getBreadcrumbForCategory(
                  post.categoryId,
                  categories,
                  currentLanguage
                )}
              </TableCell>
              <TableCell>
                {post.tags.map((tag) => tag.name).join(', ')}
              </TableCell>
              <TableCell>{formatDateTime(post.createdAt)}</TableCell>
              <TableCell>{formatDateTime(post.updatedAt)}</TableCell>
              <TableCell>
                <Chip color={getStatusInfo(post).color} variant="flat">
                  {getStatusInfo(post).label}
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
