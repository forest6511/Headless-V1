'use client'

import { MediaFile } from '@/types/api/media/types'
import { Modal, ModalContent, ModalHeader, ModalBody } from '@nextui-org/react'
import { useMediaView } from '@/hooks/media/useMediaView'
import { useLanguageStore } from '@/stores/admin/languageStore'
import { t } from '@/lib/translations'

interface MediaSelectModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (file: MediaFile) => void
}

export function MediaSelectModal({
  isOpen,
  onClose,
  onSelect,
}: MediaSelectModalProps) {
  const { files, containerRef, isFetching } = useMediaView(0)
  const currentLanguage = useLanguageStore((state) => state.language)

  const handleSelect = (file: MediaFile) => {
    onSelect(file)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <ModalHeader>{t(currentLanguage, 'media.select.title')}</ModalHeader>
        <ModalBody>
          <div ref={containerRef} className="h-[60vh] overflow-auto">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 p-4">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="relative aspect-square group cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => handleSelect(file)}
                >
                  <img
                    src={file.thumbnailUrl}
                    alt={
                      file.translations.find(
                        (t) => t.language === currentLanguage
                      )?.title || ''
                    }
                    className="absolute inset-0 w-full h-full object-cover rounded-lg"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                    <div className="absolute bottom-0 left-0 right-0 p-2 text-white text-sm truncate">
                      {
                        file.translations.find(
                          (t) => t.language === currentLanguage
                        )?.title
                      }
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
