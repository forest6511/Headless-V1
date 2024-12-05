import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react'
import { Edit, MoreVertical, Trash2 } from 'lucide-react'

export const TaxonomyBulkActions = () => (
  <div className="flex gap-2">
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered" startContent={<MoreVertical size={20} />}>
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
)
