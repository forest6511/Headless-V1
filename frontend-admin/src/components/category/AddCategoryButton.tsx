import { useRouter } from 'next/navigation'
import { Button } from '@nextui-org/react'
import { Plus } from 'lucide-react'
import { ROUTES } from '@/config/routes'

export const AddCategoryButton = () => {
  const router = useRouter()

  return (
    <Button
      color="primary"
      startContent={<Plus size={20} />}
      onPress={() => router.push(ROUTES.DASHBOARD.CATEGORIES.NEW)}
    >
      新規追加
    </Button>
  )
}
