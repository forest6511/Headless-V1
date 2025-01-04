import { Loader2 } from 'lucide-react'

interface LoadingProps {
  isLoading: boolean
}

export function Loading({ isLoading }: LoadingProps) {
  if (!isLoading) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg flex items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p>Loading...</p>
      </div>
    </div>
  )
}
