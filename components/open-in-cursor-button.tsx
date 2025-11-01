'use client'

import { ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { generateCommandDeeplink } from '@/lib/utils'

type OpenInCursorButtonProps = {
  commandName: string
  commandContent: string
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  showText?: boolean
}

export function OpenInCursorButton({
  commandName,
  commandContent,
  variant = 'outline',
  size = 'icon',
  showText = false,
}: OpenInCursorButtonProps) {
  const handleOpenInCursor = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const deeplink = generateCommandDeeplink(commandName, commandContent)
    window.location.href = deeplink
  }

  return (
    <Button
      aria-label="Add to Cursor"
      onClick={handleOpenInCursor}
      size={size}
      type="button"
      variant={variant}
    >
      <ExternalLink className={`h-4 w-4 ${showText ? 'mr-2' : ''}`} />
      {showText && <span>Add to Cursor</span>}
    </Button>
  )
}
