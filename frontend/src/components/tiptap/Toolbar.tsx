// Toolbar.tsx
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
} from 'lucide-react'

const Toolbar = ({ editor }: { editor: Editor }) => {
  if (!editor) {
    return null
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

      <button
        type="button"
        onClick={() => {
          const url = window.prompt('画像のURLを入力してください')
          if (url) {
            editor.chain().focus().setImage({ src: url }).run()
          }
        }}
        className="p-2"
        aria-label="画像を挿入"
      >
        <ImageIcon size={20} />
      </button>

      <button
        type="button" // 追加
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`p-2 ${editor.isActive('codeBlock') ? 'bg-gray-200' : ''}`}
        aria-label="コードブロック"
      >
        <Code size={20} />
      </button>
    </div>
  )
}

export default Toolbar
