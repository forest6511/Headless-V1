import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@nextui-org/react'
import { Edit, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { categoryApi } from '@/lib/api'
import toast from 'react-hot-toast'
import { ROUTES } from '@/config/routes'

interface CategoryActionsProps {
  categoryId: string
  onDelete: () => void
}

export const CategoryActions: React.FC<CategoryActionsProps> = ({
  categoryId,
  onDelete,
}) => {
  const router = useRouter()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleEdit = () => {
    router.push(ROUTES.ADMIN.DASHBOARD.CATEGORIES.EDIT(categoryId))
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await categoryApi.deleteCategory(categoryId)
      toast.success('カテゴリーを削除しました')
      onDelete()
    } catch (error) {
      console.error('カテゴリーの削除に失敗しました:', error)
      toast.error('カテゴリーの削除に失敗しました')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div className="flex items-center gap-2 justify-end">
        <Button
          isIconOnly
          color="warning"
          aria-label="編集"
          onPress={handleEdit}
        >
          <Edit size={20} />
        </Button>
        <Button isIconOnly color="danger" aria-label="削除" onPress={onOpen}>
          <Trash2 size={20} />
        </Button>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>カテゴリーの削除</ModalHeader>
              <ModalBody>
                このカテゴリーを削除してもよろしいですか？
                この操作は取り消せません。
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  キャンセル
                </Button>
                <Button
                  color="danger"
                  isLoading={isDeleting}
                  onPress={async () => {
                    await handleDelete()
                    onClose()
                  }}
                >
                  削除
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
