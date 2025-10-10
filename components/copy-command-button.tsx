'use client'

import { CheckIcon, CopyIcon } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface CopyCommandButtonProps {
  content: string
}

export function CopyCommandButton({ content }: CopyCommandButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button onClick={handleCopy} size="lg">
      {copied ? (
        <>
          <CheckIcon className="mr-2 h-4 w-4" />
          Copied!
        </>
      ) : (
        <>
          <CopyIcon className="mr-2 h-4 w-4" />
          Copy Command
        </>
      )}
    </Button>
  )
}
