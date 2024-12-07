import { Button } from '@nextui-org/react'
import { Edit, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

interface TaxonomyActionsProps {
  taxonomyId: string
  onDelete?: (id: string) => void
}

export const TaxonomyActions: React.FC<TaxonomyActionsProps> = ({
  taxonomyId,
  onDelete,
}) => {
  const router = useRouter()

  const handleEdit = () => {
    router.push(`/admin/dashboard/taxonomy/categories/edit/${taxonomyId}`)
  }

  return (
    <div className="flex items-center gap-2 justify-end">
      <Button isIconOnly color="warning" aria-label="編集" onClick={handleEdit}>
        <Edit size={20} />
      </Button>
      <Button
        isIconOnly
        color="danger"
        aria-label="削除"
        onClick={() => onDelete?.(taxonomyId)}
      >
        <Trash2 size={20} />
      </Button>
    </div>
  )
}
