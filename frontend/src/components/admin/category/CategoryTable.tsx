import {
  Link,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Spinner,
} from '@nextui-org/react'
import { CategoryListResponse } from '@/types/api/category/response'
import { CategoryActions } from './CategoryActions'
import { CATEGORY_COLUMNS } from '@/config/constants'
import React from 'react'

interface CategoryTableProps {
  categories: CategoryListResponse[]
  onDelete: () => void
  isLoading?: boolean
}

export const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
  onDelete,
  isLoading = false,
}) => {
  const renderCell = (
    category: CategoryListResponse,
    columnKey: React.Key
  ): React.ReactNode => {
    switch (columnKey) {
      case 'name':
        return category.name ? (
          <Link href={`/categories/${category.slug}`}>{category.name}</Link>
        ) : null
      case 'breadcrumb':
        if (Array.isArray(category.breadcrumbs)) {
          return category.breadcrumbs
            .map((breadcrumb) => breadcrumb.name)
            .join(' / ')
        }
        return null
      case 'count':
        return (
          <Link href={`/categories/${category.slug}/items`}>
            {category.postIds.length}
          </Link>
        )
      case 'actions':
        return <CategoryActions categoryId={category.id} onDelete={onDelete} />
      default:
        const cellValue = category[columnKey as keyof CategoryListResponse]
        return cellValue !== null && typeof cellValue !== 'object'
          ? cellValue.toString()
          : null
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-52">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <Table aria-label="カテゴリー一覧">
      <TableHeader>
        {CATEGORY_COLUMNS.map((column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === 'actions' ? 'end' : 'start'}
          >
            {column.name}
          </TableColumn>
        ))}
      </TableHeader>
      <TableBody items={categories}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
