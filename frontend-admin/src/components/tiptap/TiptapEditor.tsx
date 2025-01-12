'use client'

import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import { useEffect, useState } from 'react'
import Toolbar from './Toolbar'
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
        history: false,
        paragraph: {
          HTMLAttributes: {
            class: `${CSS_CLASS_NAME_PREFIX}`,
          },
        },
        hardBreak: false,
      }),
      // CSSの設定が必要ないなら下記は設定の必要なし
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
      Image.configure({
        inline: true,
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

      // ListItem内のPタグを除去
      html = html.replace(
        /<li[^>]*><p[^>]*>(.*?)<\/p><\/li>/g,
        `<li class="${CSS_CLASS_NAME_PREFIX}">$1</li>`
      )

      // Blockquote内のPタグを除去
      html = html.replace(
        /<blockquote[^>]*><p[^>]*>(.*?)<\/p><\/blockquote>/g,
        `<blockquote class="${CSS_CLASS_NAME_PREFIX}">$1</blockquote>`
      )

      // 改行を除去した文字数
      const textLength = editor.getText().replace(/\n/g, '').length

      // 空のエディタの場合は空文字を返す
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
    <div className="relative">
      {editor && (
        <div className="sticky top-0 z-10 bg-white">
          <Toolbar editor={editor} />
        </div>
      )}
      <div className="overflow-y-auto mt-2 p-2 border rounded-sm">
        <EditorContent editor={editor} className="prose max-w-none" />
      </div>
    </div>
  )
}

export default TiptapEditor
