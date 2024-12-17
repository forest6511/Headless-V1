'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import { useState, useEffect } from 'react'
import Toolbar from './Toolbar'
import { Heading } from '@tiptap/extension-heading'

const lowlight = createLowlight(common)

interface TiptapEditorProps {
  value?: string
  onChange?: (html: string) => void
  defaultValue?: string
}

const EMPTY_CONTENT = '<p class="my-custom-paragraph"></p>'

const TiptapEditor = ({
  value,
  onChange,
}: TiptapEditorProps) => {
  const [isMounted, setIsMounted] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
        paragraph: {
          HTMLAttributes: {
            class: 'my-custom-paragraph',
          },
        },
        hardBreak: false,
      }),
      Heading.configure({
        levels: [1, 2, 3],
        HTMLAttributes: {
          class: 'my-custom-heading',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'my-custom-image',
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'my-custom-code-block',
        },
      }),
    ],
    content: value || EMPTY_CONTENT,
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      // 空のエディタの場合は空文字を返す
      const content = html === EMPTY_CONTENT ? '' : html
      onChange?.(content)
    },
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div className="border border-gray-300 rounded-lg p-4">
      {editor && <Toolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  )
}

export default TiptapEditor
