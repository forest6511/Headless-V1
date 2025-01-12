import {
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
import { createCategoryColumns } from '@/config/constants'
import React from 'react'
import { ROUTES } from '@/config/routes'
import Link from 'next/link'
import { Language } from '@/types/api/common/types'
import { t } from '@/lib/translations'

interface CategoryTableProps {
  categories: CategoryListResponse[]
  onEdit: (id: string) => void
  onDelete: () => void
  isLoading?: boolean
  currentLanguage: Language
}

export const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
  onEdit,
  onDelete,
  isLoading = false,
  currentLanguage,
}) => {
  const getTranslatedName = (category: CategoryListResponse) => {
    return (
      category.translations.find(
        (t) => t.language === currentLanguage.toString()
      )?.name ?? ''
    )
  }

  const getBreadcrumbPath = (
    breadcrumbs: CategoryListResponse['breadcrumbs']
  ) => {
    return breadcrumbs
      .map(
        (breadcrumb) =>
          breadcrumb.translations.find(
            (t) => t.language === currentLanguage.toString()
          )?.name ?? ''
      )
      .join(' / ')
  }

  const renderCell = (
    category: CategoryListResponse,
    columnKey: React.Key
  ): React.ReactNode => {
    switch (columnKey) {
      case 'name':
        const name = getTranslatedName(category)
        return name ? (
          <Link
            href={ROUTES.DASHBOARD.CATEGORIES.EDIT(category.id)}
            className="text-blue-500 hover:text-blue-700"
          >
            {name}
          </Link>
        ) : (
          t(currentLanguage, 'categories.notTranslated')
        )
      case 'breadcrumb':
        if (Array.isArray(category.breadcrumbs)) {
          return getBreadcrumbPath(category.breadcrumbs)
        }
        return null
      case 'count':
        return (
          <Link href={`/categories/${category.slug}/items`}>
            {category.postIds.length}
          </Link>
        )
      case 'actions':
        return (
          <CategoryActions
            categoryId={category.id}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )
      default:
        const cellValue = category[columnKey as keyof CategoryListResponse]
        return cellValue != null && typeof cellValue !== 'object'
          ? String(cellValue)
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
    <Table aria-label={t(currentLanguage, 'categories.tableLabel')}>
      <TableHeader>
        {createCategoryColumns(currentLanguage).map((column) => (
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
