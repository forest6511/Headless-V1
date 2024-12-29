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
  Heading1,
  Link,
  Quote,
  Highlighter,
  Underline,
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

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {/* H1 */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}`}
        aria-label="見出し1"
      >
        <Heading1 size={20} />
      </button>

      {/* H2 */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}`}
        aria-label="見出し2"
      >
        <Heading2 size={20} />
      </button>

      {/* H3 */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''}`}
        aria-label="見出し3"
      >
        <Heading3 size={20} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
        aria-label="太字"
      >
        <Bold size={20} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
        aria-label="イタリック"
      >
        <Italic size={20} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
        aria-label="箇条書きリスト"
      >
        <List size={20} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
        aria-label="番号付きリスト"
      >
        <ListOrdered size={20} />
      </button>

      {/* 画像 */}
      <button
        type="button"
        onClick={onOpen}
        className="p-2"
        aria-label="画像を挿入"
      >
        <ImageIcon size={20} />
      </button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>画像の挿入</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="画像URL"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <Input
                label="代替テキスト (任意)"
                placeholder="画像の説明"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              キャンセル
            </Button>
            <Button color="primary" onPress={handleAddImage}>
              追加
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* リンク */}
      <button
        type="button"
        onClick={onLinkOpen}
        className={`p-2 ${editor.isActive('link') ? 'bg-gray-200' : ''}`}
        aria-label="リンクを挿入"
      >
        <Link size={20} />
      </button>
      <Modal isOpen={isLinkOpen} onClose={onLinkClose}>
        <ModalContent>
          <ModalHeader>リンクの挿入</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="リンクURL"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
              <Input
                label="リンクテキスト (任意)"
                placeholder="表示テキスト"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onLinkClose}>
              キャンセル
            </Button>
            <Button color="primary" onPress={handleAddLink}>
              追加
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`p-2 ${editor.isActive('codeBlock') ? 'bg-gray-200' : ''}`}
        aria-label="コードブロック"
      >
        <Code size={20} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 ${editor.isActive('blockquote') ? 'bg-gray-200' : ''}`}
      >
        <Quote size={20} />
      </button>

      {/* ハイライトボタン */}
      <Popover placement="bottom">
        <PopoverTrigger>
          <button
            type="button"
            className={`p-2 ${editor.isActive('highlight') ? 'bg-gray-200' : ''}`}
            aria-label="ハイライト"
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
                    editor.chain().focus().toggleHighlight({ color: color.value }).run()
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
        className={`p-2 ${editor.isActive('underline') ? 'bg-gray-200' : ''}`}
        aria-label="下線"
      >
        <Underline size={20} />
      </button>
    </div>
  )
}

export default Toolbar
