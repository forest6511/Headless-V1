import { Editor } from '@tiptap/react'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  ImageIcon,
  Code,
  Heading3,
  Heading2,
  Link,
  Quote,
  Highlighter,
  Underline,
  Undo2,
  Redo2,
  ImagePlus,
} from 'lucide-react'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  useDisclosure,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@nextui-org/react'
import { useState } from 'react'
import { useLanguageStore } from '@/stores/admin/languageStore'
import { t } from '@/lib/translations'
import { MediaFile } from '@/types/api/media/types'
import { MediaSelectModal } from '@/components/tiptap/MediaSelectModal'

const HIGHLIGHT_COLORS = [
  { label: 'Yellow', value: '#fef08a' },
  { label: 'Green', value: '#bbf7d0' },
  { label: 'Blue', value: '#bfdbfe' },
  { label: 'Pink', value: '#fecdd3' },
  { label: 'Purple', value: '#e9d5ff' },
]

const Toolbar = ({ editor }: { editor: Editor }) => {
  if (!editor) {
    return null
  }

  const currentLanguage = useLanguageStore((state) => state.language)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isLinkOpen,
    onOpen: onLinkOpen,
    onClose: onLinkClose,
  } = useDisclosure()
  const [imageUrl, setImageUrl] = useState('')
  const [imageAlt, setImageAlt] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')

  const handleAddImage = () => {
    if (imageUrl) {
      editor
        .chain()
        .focus()
        .setImage({
          src: imageUrl,
          alt: imageAlt || undefined,
        })
        .run()
      setImageUrl('')
      setImageAlt('')
      onClose()
    }
  }

  const handleAddLink = () => {
    if (linkUrl) {
      editor
        .chain()
        .focus()
        .insertContent(`<a href="${linkUrl}">${linkText || linkUrl}</a>`)
        .run()
      setLinkUrl('')
      setLinkText('')
      onLinkClose()
    }
  }

  const {
    isOpen: isMediaOpen,
    onOpen: onMediaOpen,
    onClose: onMediaClose,
  } = useDisclosure()
  const handleMediaSelect = (file: MediaFile) => {
    editor
      .chain()
      .focus()
      .setImage({
        src: file.largeUrl,
        alt:
          file.translations.find((t) => t.language === currentLanguage)
            ?.title || '',
      })
      .run()
  }

  return (
    <div className="flex flex-wrap gap-1 mb-4 bg-white border border-gray-300 rounded-md p-2 shadow-sm">
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${!editor.can().undo() ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label={t(currentLanguage, 'editor.toolbar.undo')}
      >
        <Undo2 size={20} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${!editor.can().redo() ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label={t(currentLanguage, 'editor.toolbar.redo')}
      >
        <Redo2 size={20} />
      </button>

      <div className="border-r border-gray-300 mx-2 h-6"></div>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}`}
        aria-label={t(currentLanguage, 'editor.toolbar.heading2')}
      >
        <Heading2 size={20} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''}`}
        aria-label={t(currentLanguage, 'editor.toolbar.heading3')}
      >
        <Heading3 size={20} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
        aria-label={t(currentLanguage, 'editor.toolbar.bold')}
      >
        <Bold size={20} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
        aria-label={t(currentLanguage, 'editor.toolbar.italic')}
      >
        <Italic size={20} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
        aria-label={t(currentLanguage, 'editor.toolbar.bulletList')}
      >
        <List size={20} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
        aria-label={t(currentLanguage, 'editor.toolbar.orderedList')}
      >
        <ListOrdered size={20} />
      </button>

      {/*
      <button
        type="button"
        onClick={onOpen}
        className="p-2 rounded-md hover:bg-gray-100 transition-colors"
        aria-label={t(currentLanguage, 'editor.toolbar.image.button')}
      >
        <ImageIcon size={20} />
      </button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>
            {t(currentLanguage, 'editor.toolbar.image.title')}
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label={t(currentLanguage, 'editor.toolbar.image.url')}
                placeholder={t(
                  currentLanguage,
                  'editor.toolbar.image.urlPlaceholder'
                )}
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <Input
                label={t(currentLanguage, 'editor.toolbar.image.alt')}
                placeholder={t(
                  currentLanguage,
                  'editor.toolbar.image.altPlaceholder'
                )}
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              {t(currentLanguage, 'editor.toolbar.cancel')}
            </Button>
            <Button color="primary" onPress={handleAddImage}>
              {t(currentLanguage, 'editor.toolbar.add')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      */}

      <button
        type="button"
        onClick={onLinkOpen}
        className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${editor.isActive('link') ? 'bg-gray-200' : ''}`}
        aria-label={t(currentLanguage, 'editor.toolbar.link.button')}
      >
        <Link size={20} />
      </button>
      <Modal isOpen={isLinkOpen} onClose={onLinkClose}>
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
            <Button color="danger" variant="light" onPress={onLinkClose}>
              {t(currentLanguage, 'editor.toolbar.cancel')}
            </Button>
            <Button color="primary" onPress={handleAddLink}>
              {t(currentLanguage, 'editor.toolbar.add')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${editor.isActive('codeBlock') ? 'bg-gray-200' : ''}`}
        aria-label={t(currentLanguage, 'editor.toolbar.code')}
      >
        <Code size={20} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${editor.isActive('blockquote') ? 'bg-gray-200' : ''}`}
        aria-label={t(currentLanguage, 'editor.toolbar.quote')}
      >
        <Quote size={20} />
      </button>

      {/* メディアを選択 */}
      <button
        type="button"
        onClick={onMediaOpen}
        className="p-2 rounded-md hover:bg-gray-100 transition-colors"
        aria-label="メディアを選択"
      >
        <ImagePlus size={20} />
      </button>
      <MediaSelectModal
        isOpen={isMediaOpen}
        onClose={onMediaClose}
        onSelect={handleMediaSelect}
      />

      <Popover placement="bottom">
        <PopoverTrigger>
          <button
            type="button"
            className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${editor.isActive('highlight') ? 'bg-gray-200' : ''}`}
            aria-label={t(currentLanguage, 'editor.toolbar.highlight')}
          >
            <Highlighter size={20} />
          </button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="p-2">
            <div className="grid grid-cols-5 gap-1">
              {HIGHLIGHT_COLORS.map((color) => (
                <button
                  key={color.value}
                  className="w-6 h-6 rounded-full border border-gray-200 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color.value }}
                  onClick={() => {
                    editor
                      .chain()
                      .focus()
                      .toggleHighlight({ color: color.value })
                      .run()
                  }}
                  title={color.label}
                />
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${editor.isActive('underline') ? 'bg-gray-200' : ''}`}
        aria-label={t(currentLanguage, 'editor.toolbar.underline')}
      >
        <Underline size={20} />
      </button>
    </div>
  )
}

export default Toolbar
