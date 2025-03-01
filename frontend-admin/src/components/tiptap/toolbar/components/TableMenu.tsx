// components/tiptap/toolbar/components/TableMenu.tsx
import { Editor } from '@tiptap/react'
import { Table } from 'lucide-react'
import { useState } from 'react'
import { useLanguageStore } from '@/stores/admin/languageStore'
import { t } from '@/lib/translations'
import { ToolbarButton } from './ToolbarButtonProps'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from '@nextui-org/react'

export const TableMenu = ({ editor }: { editor: Editor }) => {
  const [isOpen, setIsOpen] = useState(false)
  const currentLanguage = useLanguageStore((state) => state.language)

  const tableOptions = [
    {
      label: t(currentLanguage, 'editor.toolbar.table.insertTable'),
      action: () =>
        editor
          .chain()
          .focus()
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .run(),
    },
    {
      label: t(currentLanguage, 'editor.toolbar.table.addColumnBefore'),
      action: () => editor.chain().focus().addColumnBefore().run(),
      isDisabled: () => !editor.can().addColumnBefore(),
    },
    {
      label: t(currentLanguage, 'editor.toolbar.table.addColumnAfter'),
      action: () => editor.chain().focus().addColumnAfter().run(),
      isDisabled: () => !editor.can().addColumnAfter(),
    },
    {
      label: t(currentLanguage, 'editor.toolbar.table.deleteColumn'),
      action: () => editor.chain().focus().deleteColumn().run(),
      isDisabled: () => !editor.can().deleteColumn(),
    },
    {
      label: t(currentLanguage, 'editor.toolbar.table.addRowBefore'),
      action: () => editor.chain().focus().addRowBefore().run(),
      isDisabled: () => !editor.can().addRowBefore(),
    },
    {
      label: t(currentLanguage, 'editor.toolbar.table.addRowAfter'),
      action: () => editor.chain().focus().addRowAfter().run(),
      isDisabled: () => !editor.can().addRowAfter(),
    },
    {
      label: t(currentLanguage, 'editor.toolbar.table.deleteRow'),
      action: () => editor.chain().focus().deleteRow().run(),
      isDisabled: () => !editor.can().deleteRow(),
    },
    {
      label: t(currentLanguage, 'editor.toolbar.table.deleteTable'),
      action: () => editor.chain().focus().deleteTable().run(),
      isDisabled: () => !editor.can().deleteTable(),
    },
    {
      label: t(currentLanguage, 'editor.toolbar.table.mergeCells'),
      action: () => editor.chain().focus().mergeCells().run(),
      isDisabled: () => !editor.can().mergeCells(),
    },
    {
      label: t(currentLanguage, 'editor.toolbar.table.splitCell'),
      action: () => editor.chain().focus().splitCell().run(),
      isDisabled: () => !editor.can().splitCell(),
    },
    {
      label: t(currentLanguage, 'editor.toolbar.table.toggleHeaderColumn'),
      action: () => editor.chain().focus().toggleHeaderColumn().run(),
      isDisabled: () => !editor.can().toggleHeaderColumn(),
    },
    {
      label: t(currentLanguage, 'editor.toolbar.table.toggleHeaderRow'),
      action: () => editor.chain().focus().toggleHeaderRow().run(),
      isDisabled: () => !editor.can().toggleHeaderRow(),
    },
    {
      label: t(currentLanguage, 'editor.toolbar.table.toggleHeaderCell'),
      action: () => editor.chain().focus().toggleHeaderCell().run(),
      isDisabled: () => !editor.can().toggleHeaderCell(),
    },
    {
      label: t(currentLanguage, 'editor.toolbar.table.mergeOrSplit'),
      action: () => editor.chain().focus().mergeOrSplit().run(),
      isDisabled: () => !editor.can().mergeOrSplit(),
    },
    {
      label: t(currentLanguage, 'editor.toolbar.table.fixTables'),
      action: () => editor.chain().focus().fixTables().run(),
    },
  ]

  const handleOptionClick = (action: () => void) => {
    action()
    setIsOpen(false)
  }

  return (
    <Popover isOpen={isOpen} onOpenChange={setIsOpen} placement="bottom">
      <PopoverTrigger>
        <div>
          <ToolbarButton
            onClick={() => setIsOpen(true)}
            isActive={editor.isActive('table')}
            icon={<Table size={20} />}
            ariaLabel={t(currentLanguage, 'editor.toolbar.table.button')}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-1 p-2 max-h-80 overflow-y-auto">
          {tableOptions.map((option, index) => (
            <Button
              key={index}
              size="sm"
              variant="flat"
              onClick={() => handleOptionClick(option.action)}
              disabled={option.isDisabled ? option.isDisabled() : false}
              className="justify-start text-left"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
