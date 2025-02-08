'use client'

import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import { useEffect, useState } from 'react'
import Toolbar, { ResponsiveImage } from './Toolbar'
import { Heading } from '@tiptap/extension-heading'
import { Bold } from '@tiptap/extension-bold'
import { OrderedList } from '@tiptap/extension-ordered-list'
import { ListItem } from '@tiptap/extension-list-item'
import { BulletList } from '@tiptap/extension-bullet-list'
import { Italic } from '@tiptap/extension-italic'
import { Link } from '@tiptap/extension-link'
import { Blockquote } from '@tiptap/extension-blockquote'
import { Highlight } from '@tiptap/extension-highlight'
import { Underline } from '@tiptap/extension-underline'
// History拡張機能のインポートを削除

const lowlight = createLowlight(common)

interface TiptapEditorProps {
  value?: string
  onChange?: (html: string, textLength: number) => void
  defaultValue?: string
}

export const CSS_CLASS_NAME_PREFIX = 'cms'
const EMPTY_CONTENT = `<p class="${CSS_CLASS_NAME_PREFIX}"></p>`

const TiptapEditor = ({ value, onChange }: TiptapEditorProps) => {
  const [isMounted, setIsMounted] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: {
          depth: 100,
          newGroupDelay: 500,
        },
        paragraph: {
          HTMLAttributes: {
            class: `${CSS_CLASS_NAME_PREFIX}`,
          },
        },
        hardBreak: false,
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: `${CSS_CLASS_NAME_PREFIX}`,
        },
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: `${CSS_CLASS_NAME_PREFIX}`,
        },
      }),
      ListItem.configure({
        HTMLAttributes: {
          class: `${CSS_CLASS_NAME_PREFIX}`,
        },
      }),
      Heading.configure({
        levels: [2, 3],
        HTMLAttributes: {
          class: `${CSS_CLASS_NAME_PREFIX}`,
        },
      }),
      Bold.configure({
        HTMLAttributes: {
          class: `${CSS_CLASS_NAME_PREFIX}`,
        },
      }),
      Italic.configure({
        HTMLAttributes: {
          class: `${CSS_CLASS_NAME_PREFIX}`,
        },
      }),
      Link.configure({
        HTMLAttributes: {
          class: `${CSS_CLASS_NAME_PREFIX}`,
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: `${CSS_CLASS_NAME_PREFIX}`,
        },
      }),
      Blockquote.configure({
        HTMLAttributes: {
          class: `${CSS_CLASS_NAME_PREFIX}`,
        },
      }),
      ResponsiveImage,
      Highlight.configure({
        multicolor: true,
        HTMLAttributes: {
          class: `${CSS_CLASS_NAME_PREFIX}`,
        },
      }),
      Underline.configure({
        HTMLAttributes: {
          class: `${CSS_CLASS_NAME_PREFIX}`,
        },
      }),
      // 別途追加していたHistory拡張機能を削除
    ],
    autofocus: true,
    content: value || EMPTY_CONTENT,
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      let html = editor.getHTML()

      html = html.replace(
        /<li[^>]*><p[^>]*>(.*?)<\/p><\/li>/g,
        `<li class="${CSS_CLASS_NAME_PREFIX}">$1</li>`
      )

      html = html.replace(
        /<blockquote[^>]*><p[^>]*>(.*?)<\/p><\/blockquote>/g,
        `<blockquote class="${CSS_CLASS_NAME_PREFIX}">$1</blockquote>`
      )

      const textLength = editor.getText().replace(/\n/g, '').length

      const content = html === EMPTY_CONTENT ? '' : html
      onChange?.(content, textLength)
    },
    immediatelyRender: false,
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div className="flex flex-col h-full">
      {editor && (
        <div className="sticky top-0 z-[10] bg-white/100 shadow-sm backdrop-blur-sm">
          <Toolbar editor={editor} />
        </div>
      )}
      <div className="flex-1 overflow-hidden border rounded-sm">
        <div className="h-full overflow-y-auto p-2">
          <EditorContent editor={editor} className="prose max-w-none p-2" />
        </div>
      </div>
    </div>
  )
}

export default TiptapEditor
