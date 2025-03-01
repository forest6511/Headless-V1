import { Editor } from '@tiptap/react'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Code,
  Heading3,
  Heading2,
  Link,
  Quote,
  Underline,
  Undo2,
  Redo2,
  ImagePlus,
} from 'lucide-react'

import { useDisclosure } from '@nextui-org/react'
import { useLanguageStore } from '@/stores/admin/languageStore'
import { t } from '@/lib/translations'
import { MediaFile } from '@/types/api/media/types'
import { MediaSelectModal } from '@/components/tiptap/toolbar/components/MediaSelectModal'
import { ToolbarButton } from '@/components/tiptap/toolbar/components/ToolbarButtonProps'
import { LinkModal } from '@/components/tiptap/toolbar/components/LinkModal'
import { HighlightPopover } from '@/components/tiptap/toolbar/components/HighlightPopover'
import { TableMenu } from '@/components/tiptap/toolbar/components/TableMenu'

const Toolbar = ({ editor }: { editor: Editor }) => {
  if (!editor) {
    return null
  }
  const currentLanguage = useLanguageStore((state) => state.language)

  const {
    isOpen: isLinkOpen,
    onOpen: onLinkOpen,
    onClose: onLinkClose,
  } = useDisclosure()

  const {
    isOpen: isMediaOpen,
    onOpen: onMediaOpen,
    onClose: onMediaClose,
  } = useDisclosure()

  const handleMediaSelect = (file: MediaFile) => {
    editor
      .chain()
      .focus()
      .insertContent({
        type: 'responsiveImage',
        attrs: {
          src: file.smallUrl,
          // 375px幅と800px幅の画像を指定
          srcset: `${file.smallUrl} 375w, ${file.largeUrl} 800w`,
          // 画面幅に応じて適切なサイズを選択
          sizes: '(max-width: 375px) 375px, 800px',
          alt:
            file.translations.find((t) => t.language === currentLanguage)
              ?.title || '',
          loading: 'lazy',
          decoding: 'async',
        },
      })
      .run()
  }

  return (
    <div className="flex flex-wrap gap-1 mb-4 bg-white border border-gray-300 rounded-md p-2 shadow-sm">
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        icon={<Undo2 size={20} />}
        ariaLabel={t(currentLanguage, 'editor.toolbar.undo')}
      />

      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        icon={<Redo2 size={20} />}
        ariaLabel={t(currentLanguage, 'editor.toolbar.redo')}
      />

      <div className="border-r border-gray-300 mx-2 h-6"></div>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
        icon={<Heading2 size={20} />}
        ariaLabel={t(currentLanguage, 'editor.toolbar.heading2')}
      />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive('heading', { level: 3 })}
        icon={<Heading3 size={20} />}
        ariaLabel={t(currentLanguage, 'editor.toolbar.heading3')}
      />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        icon={<Bold size={20} />}
        ariaLabel={t(currentLanguage, 'editor.toolbar.bold')}
      />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        icon={<Italic size={20} />}
        ariaLabel={t(currentLanguage, 'editor.toolbar.italic')}
      />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        icon={<List size={20} />}
        ariaLabel={t(currentLanguage, 'editor.toolbar.bulletList')}
      />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        icon={<ListOrdered size={20} />}
        ariaLabel={t(currentLanguage, 'editor.toolbar.orderedList')}
      />

      <ToolbarButton
        onClick={onLinkOpen}
        isActive={editor.isActive('link')}
        icon={<Link size={20} />}
        ariaLabel={t(currentLanguage, 'editor.toolbar.link.button')}
      />

      <LinkModal isOpen={isLinkOpen} onClose={onLinkClose} editor={editor} />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        isActive={editor.isActive('codeBlock')}
        icon={<Code size={20} />}
        ariaLabel={t(currentLanguage, 'editor.toolbar.code')}
      />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
        icon={<Quote size={20} />}
        ariaLabel={t(currentLanguage, 'editor.toolbar.quote')}
      />

      {/* メディアを選択 */}
      <ToolbarButton
        onClick={onMediaOpen}
        icon={<ImagePlus size={20} />}
        ariaLabel={t(currentLanguage, 'メディアを選択')}
      />

      <MediaSelectModal
        isOpen={isMediaOpen}
        onClose={onMediaClose}
        onSelect={handleMediaSelect}
      />

      <HighlightPopover editor={editor} />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive('underline')}
        icon={<Underline size={20} />}
        ariaLabel={t(currentLanguage, 'editor.toolbar.underline')}
      />

      <TableMenu editor={editor} />
    </div>
  )
}

export default Toolbar
