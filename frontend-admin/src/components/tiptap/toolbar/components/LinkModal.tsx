// components/tiptap/toolbar/components/LinkModal.tsx
'use client'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from '@nextui-org/react'
import { useState } from 'react'
import { useLanguageStore } from '@/stores/admin/languageStore'
import { t } from '@/lib/translations'
import { Editor } from '@tiptap/react'

interface LinkModalProps {
  isOpen: boolean
  onClose: () => void
  editor: Editor
}

export const LinkModal = ({ isOpen, onClose, editor }: LinkModalProps) => {
  const currentLanguage = useLanguageStore((state) => state.language)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')

  const handleAddLink = () => {
    if (linkUrl) {
      editor
        .chain()
        .focus()
        .insertContent(`<a href="${linkUrl}">${linkText || linkUrl}</a>`)
        .run()
      setLinkUrl('')
      setLinkText('')
      onClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>
          {t(currentLanguage, 'editor.toolbar.link.title')}
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <Input
              label={t(currentLanguage, 'editor.toolbar.link.url')}
              placeholder={t(
                currentLanguage,
                'editor.toolbar.link.urlPlaceholder'
              )}
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
            />
            <Input
              label={t(currentLanguage, 'editor.toolbar.link.text')}
              placeholder={t(
                currentLanguage,
                'editor.toolbar.link.textPlaceholder'
              )}
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            {t(currentLanguage, 'editor.toolbar.cancel')}
          </Button>
          <Button color="primary" onPress={handleAddLink}>
            {t(currentLanguage, 'editor.toolbar.add')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
