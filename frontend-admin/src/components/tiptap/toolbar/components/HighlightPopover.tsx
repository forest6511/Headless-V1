// components/tiptap/toolbar/components/HighlightPopover.tsx

'use client'

import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react'
import { t } from '@/lib/translations'
import { Highlighter } from 'lucide-react'
import { HIGHLIGHT_COLORS } from '@/config/constants'
import { Editor } from '@tiptap/react'
import { useLanguageStore } from '@/stores/admin/languageStore'

export const HighlightPopover = ({ editor }: { editor: Editor }) => {
  const currentLanguage = useLanguageStore((state) => state.language)
  return (
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
  )
}
