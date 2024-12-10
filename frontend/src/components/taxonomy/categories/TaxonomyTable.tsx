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
import { TaxonomyListResponse } from '@/types/api/taxonomy/response'
import { TaxonomyActions } from './TaxonomyActions'
import { TAXONOMY_COLUMNS } from './constants'
import React from 'react'

interface TaxonomyTableProps {
  taxonomies: TaxonomyListResponse[]
  onDelete: () => void
  isLoading?: boolean
}

export const TaxonomyTable: React.FC<TaxonomyTableProps> = ({
  taxonomies,
  onDelete,
  isLoading = false,
}) => {
  const renderCell = (
    taxonomy: TaxonomyListResponse,
    columnKey: React.Key
  ): React.ReactNode => {
    switch (columnKey) {
      case 'name':
        return taxonomy.name ? (
          <Link href={`/taxonomy/${taxonomy.slug}`}>{taxonomy.name}</Link>
        ) : null
      case 'breadcrumb':
        if (Array.isArray(taxonomy.breadcrumbs)) {
          return taxonomy.breadcrumbs
            .map((breadcrumb) => breadcrumb.name)
            .join(' / ')
        }
        return null
      case 'count':
        return (
          <Link href={`/taxonomy/${taxonomy.slug}/items`}>
            {taxonomy.postIds.length}
          </Link>
        )
      case 'actions':
        return <TaxonomyActions taxonomyId={taxonomy.id} onDelete={onDelete} />
      default:
        const cellValue = taxonomy[columnKey as keyof TaxonomyListResponse]
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
    <Table aria-label="タクソノミー一覧">
      <TableHeader>
        {TAXONOMY_COLUMNS.map((column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === 'actions' ? 'end' : 'start'}
          >
            {column.name}
          </TableColumn>
        ))}
      </TableHeader>
      <TableBody items={taxonomies}>
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
