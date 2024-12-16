import { useRouter } from 'next/navigation'
import { Button } from '@nextui-org/react'
import { Plus } from 'lucide-react'

export const AddCategoryButton = () => {
  const router = useRouter()

  return (
    <Button
      color="primary"
      startContent={<Plus size={20} />}
      onClick={() => router.push('/admin/dashboard/categories/new')}
    >
      新規追加
    </Button>
  )
}
