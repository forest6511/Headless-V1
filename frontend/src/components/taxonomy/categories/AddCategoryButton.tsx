import { Button } from '@nextui-org/react'
import { Plus } from 'lucide-react'

export const AddCategoryButton = () => {
  return (
    <Button
      color="primary"
      startContent={<Plus size={20} />}
      onClick={() => console.log('新規カテゴリ追加')}
    >
      新規追加
    </Button>
  )
}
