import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

export function MobileSearchButton() {
  return (
    <Button variant="ghost" size="icon" className="md:hidden">
      <Search className="h-5 w-5" />
      <span className="sr-only">Search</span>
    </Button>
  )
}
