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
import React, { useState } from 'react'
import { postApi } from '@/lib/api'
import toast from 'react-hot-toast'
import { useLanguageStore } from '@/stores/admin/languageStore'
import { t } from '@/lib/translations'

interface PostActionsProps {
  postId: string
  onEdit: (id: string) => void
  onDelete: () => void
}

export const PostActions: React.FC<PostActionsProps> = ({
  postId,
  onEdit,
  onDelete,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [isDeleting, setIsDeleting] = useState(false)
  const currentLanguage = useLanguageStore((state) => state.language)

  const handleEdit = () => {
    onEdit(postId)
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await postApi.deletePost(postId)
      toast.success(t(currentLanguage, 'posts.deleteSuccess'))
      onDelete()
    } catch (error) {
      console.error(t(currentLanguage, 'posts.deleteError'), error)
      toast.error(t(currentLanguage, 'posts.deleteError'))
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
          aria-label={t(currentLanguage, 'common.edit')}
          onPress={handleEdit}
        >
          <Edit size={20} />
        </Button>
        <Button
          isIconOnly
          color="danger"
          aria-label={t(currentLanguage, 'common.delete')}
          onPress={onOpen}
        >
          <Trash2 size={20} />
        </Button>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {t(currentLanguage, 'posts.deleteConfirm.title')}
              </ModalHeader>
              <ModalBody>
                {t(currentLanguage, 'posts.deleteConfirm.message')}
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  {t(currentLanguage, 'common.cancel')}
                </Button>
                <Button
                  color="danger"
                  isLoading={isDeleting}
                  onPress={async () => {
                    await handleDelete()
                    onClose()
                  }}
                >
                  {t(currentLanguage, 'common.delete')}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
