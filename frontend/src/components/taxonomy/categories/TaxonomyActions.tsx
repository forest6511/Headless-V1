import { Button } from '@nextui-org/react'
import { Edit, Trash2 } from 'lucide-react'
import React from 'react'

interface TaxonomyActionsProps {
  taxonomyId: string
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export const TaxonomyActions: React.FC<TaxonomyActionsProps> = ({
  taxonomyId,
  onEdit,
  onDelete,
}) => (
  <div className="flex items-center gap-2 justify-end">
    <Button
      isIconOnly
      color="warning"
      aria-label="編集"
      onClick={() => onEdit?.(taxonomyId)}
    >
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
