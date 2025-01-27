import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { X } from 'lucide-react'

interface ImageModalProps {
  imageUrl: string | null
  isOpen: boolean
  onClose: () => void
}

export function ImageModal({ imageUrl, isOpen, onClose }: ImageModalProps) {
  if (!imageUrl) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[80vw] max-h-[80vh] p-0">
        <DialogTitle>
          <VisuallyHidden>拡大画像</VisuallyHidden>
        </DialogTitle>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 rounded-full text-white"
        >
          <X size={24} />
        </button>
        <img
          src={imageUrl || '/placeholder.svg'}
          alt="拡大画像"
          className="w-full h-full object-contain max-w-[70vw] max-h-[70vh]"
        />
      </DialogContent>
    </Dialog>
  )
}
