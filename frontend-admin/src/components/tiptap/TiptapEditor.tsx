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

const lowlight = createLowlight(common)

interface TiptapEditorProps {
  value?: string
  onChange?: (html: string, textLength: number) => void
  defaultValue?: string
}

export const CSS_CLASS_NAME_PREFIX = 'cms'
const EMPTY_CONTENT = `<p class="${CSS_CLASS_NAME_PREFIX}-paragraph"></p>`

const TiptapEditor = ({ value, onChange }: TiptapEditorProps) => {
  const [isMounted, setIsMounted] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
        paragraph: {
          HTMLAttributes: {
            class: `${CSS_CLASS_NAME_PREFIX}-paragraph`,
          },
        },
        hardBreak: false,
      }),
      // CSSの設定が必要ないなら下記は設定の必要なし
      OrderedList.configure({
        HTMLAttributes: {
          class: `${CSS_CLASS_NAME_PREFIX}-ordered-list`,
        },
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: `${CSS_CLASS_NAME_PREFIX}-bullet-list`,
        },
      }),
      ListItem.configure({
        HTMLAttributes: {
          class: `${CSS_CLASS_NAME_PREFIX}-list-item`,
        },
      }),
      Heading.configure({
        levels: [1, 2, 3],
        HTMLAttributes: {
          class: `${CSS_CLASS_NAME_PREFIX}-heading`,
        },
      }),
      Bold.configure({
        HTMLAttributes: {
          class: `${CSS_CLASS_NAME_PREFIX}-strong`,
        },
      }),
      Italic.configure({
        HTMLAttributes: {
          class: `${CSS_CLASS_NAME_PREFIX}-italic`,
        },
      }),
      Image.configure({
        inline: true,
        HTMLAttributes: {
          class: `${CSS_CLASS_NAME_PREFIX}-image`,
        },
      }),
      Link.configure({
        HTMLAttributes: {
          class: `${CSS_CLASS_NAME_PREFIX}-link`,
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: `${CSS_CLASS_NAME_PREFIX}-code-block`,
        },
      }),
      Blockquote.configure({
        HTMLAttributes: {
          class: `${CSS_CLASS_NAME_PREFIX}-blockquote`,
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
      let html = editor.getHTML()

      // ListItem内のPタグを除去
      html = html.replace(
        /<li[^>]*><p[^>]*>(.*?)<\/p><\/li>/g,
        `<li class="${CSS_CLASS_NAME_PREFIX}-list-item">$1</li>`
      )

      // Blockquote内のPタグを除去
      html = html.replace(
        /<blockquote[^>]*><p[^>]*>(.*?)<\/p><\/blockquote>/g,
        `<blockquote class="${CSS_CLASS_NAME_PREFIX}-blockquote">$1</blockquote>`
      )

      // 改行を除去した文字数
      const textLength = editor.getText().replace(/\n/g, '').length

      // 空のエディタの場合は空文字を返す
      const content = html === EMPTY_CONTENT ? '' : html
      onChange?.(content, textLength)
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
