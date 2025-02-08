// components/tiptap/toolbar/components/ToolbarButtonProps.tsx
import React from 'react'

interface ToolbarButtonProps {
  onClick: () => void
  isActive?: boolean
  disabled?: boolean
  icon: React.ReactNode
  ariaLabel: string
}

export const ToolbarButton = ({
  onClick,
  isActive = false,
  disabled = false,
  icon,
  ariaLabel,
}: ToolbarButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${
        isActive ? 'bg-gray-200' : ''
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      aria-label={ariaLabel}
    >
      {icon}
    </button>
  )
}
