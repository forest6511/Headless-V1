import { Button } from '@nextui-org/button'
import { Card } from '@nextui-org/card'
import { Facebook, Twitter, LinkedinIcon as LinkedIn } from 'lucide-react'

export function RightSidebar() {
  return (
    <aside className="w-[300px] hidden lg:block space-y-6">
      <div className="sticky top-20">
        <Card className="p-4">
          <h3 className="font-bold mb-4">ソーシャルシェア</h3>
          <div className="flex gap-2">
            <Button isIconOnly variant="flat" aria-label="Facebook">
              <Facebook />
            </Button>
            <Button isIconOnly variant="flat" aria-label="Twitter">
              <Twitter />
            </Button>
            <Button isIconOnly variant="flat" aria-label="LinkedIn">
              <LinkedIn />
            </Button>
          </div>
        </Card>

        <Card className="p-4 mt-4">
          <h3 className="font-bold mb-4">広告</h3>
          <div className="aspect-video bg-gray-100 rounded flex items-center justify-center">
            広告スペース
          </div>
        </Card>
      </div>
    </aside>
  )
}
