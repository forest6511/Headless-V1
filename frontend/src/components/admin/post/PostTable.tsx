import React, { Key } from 'react'
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
import { PostWithCategoryId } from '@/types/api/post/response'
import { POST_COLUMNS } from '@/config/constants'
import { PostStatuses } from '@/types/api/post/types'
import { getBreadcrumbForCategory } from '@/lib/utils/category'
import { CategoryListResponse } from '@/types/api/category/response'
import { PostActions } from '@/components/admin/post/PostActions'
import { ROUTES } from '@/config/routes'

interface PostTableProps {
  posts: PostWithCategoryId[]
  categories: CategoryListResponse[]
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  onEdit: (id: string) => void
  onDelete: () => void
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

  // TODO 共通化
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
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
                  href={ROUTES.DASHBOARD.POSTS.EDIT(post.id)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  {post.title}
                </Link>
              </TableCell>
              <TableCell>{post.slug}</TableCell>
              <TableCell>
                {getBreadcrumbForCategory(post.categoryId, categories)}
              </TableCell>
              <TableCell>{formatDateTime(post.createdAt)}</TableCell>
              <TableCell>{formatDateTime(post.updateAt)}</TableCell>
              <TableCell>
                <Chip color={getStatusColor(post.postStatus)} variant="flat">
                  {getStatusLabel(post.postStatus)}
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
