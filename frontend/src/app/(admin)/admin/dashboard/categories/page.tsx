'use client'

import React from 'react'
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  Selection,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react'
import { Edit, MoreVertical, Plus, Trash2 } from 'lucide-react'

interface Category {
  id: string
  name: string
  description: string
  slug: string
  count: number
}

const categories: Category[] = [
  {
    id: '1',
    name: 'カテゴリ1',
    description: '説明1',
    slug: 'category-1',
    count: 10,
  },
  {
    id: '2',
    name: 'カテゴリ2',
    description: '説明2',
    slug: 'category-2',
    count: 20,
  },
  {
    id: '3',
    name: 'カテゴリ3',
    description: '説明3',
    slug: 'category-3',
    count: 30,
  },
]

const columns = [
  { name: 'カテゴリ名', uid: 'name' },
  { name: '説明', uid: 'description' },
  { name: 'スラッグ', uid: 'slug' },
  { name: 'カウント', uid: 'count' },
  { name: 'アクション', uid: 'actions' },
]

export default function CategoryList() {
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]))

  const renderCell = (category: Category, columnKey: React.Key) => {
    const cellValue = category[columnKey as keyof Category]

    switch (columnKey) {
      case 'name':
        return <Link href={`/categories/${category.slug}`}>{cellValue}</Link>
      case 'count':
        return (
          <Link href={`/categories/${category.slug}/items`}>{cellValue}</Link>
        )
      case 'actions':
        return (
          <div className="flex items-center gap-2 justify-end">
            <Button
              isIconOnly
              color="warning"
              aria-label="編集"
              onClick={() => console.log('編集:', category.id)}
            >
              <Edit size={20} />
            </Button>
            <Button
              isIconOnly
              color="danger"
              aria-label="削除"
              onClick={() => console.log('削除:', category.id)}
            >
              <Trash2 size={20} />
            </Button>
          </div>
        )
      default:
        return cellValue
    }
  }

  return (
    <div className="w-full px-4 py-8">
      <div className="flex justify-between mb-4">
        <div className="flex gap-2">
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="bordered"
                startContent={<MoreVertical size={20} />}
              >
                一括操作
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="一括操作">
              <DropdownItem key="delete" startContent={<Trash2 size={20} />}>
                削除
              </DropdownItem>
              <DropdownItem key="edit" startContent={<Edit size={20} />}>
                編集
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Button color="primary" onClick={() => console.log('適用')}>
            適用
          </Button>
        </div>
        <Button
          color="primary"
          startContent={<Plus size={20} />}
          onClick={() => console.log('新規カテゴリ追加')}
        >
          新規追加
        </Button>
      </div>
      <Table
        aria-label="カテゴリ一覧"
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      >
        <TableHeader>
          {columns.map((column) => (
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
    </div>
  )
}
