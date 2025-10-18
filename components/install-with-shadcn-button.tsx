'use client'

import { CheckIcon } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

const COPY_TIMEOUT = 2000

type InstallWithShadcnButtonProps = {
  slug: string
  size?: 'default' | 'sm' | 'lg' | 'icon'
  variant?: 'default' | 'outline' | 'secondary' | 'ghost'
  showText?: boolean
}

export function InstallWithShadcnButton({
  slug,
  size = 'default',
  variant = 'default',
  showText = true,
}: InstallWithShadcnButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const installCommand = `pnpx shadcn@latest add https://cursor-commands.com/registry/${slug}`
    await navigator.clipboard.writeText(installCommand)
    setCopied(true)
    setTimeout(() => setCopied(false), COPY_TIMEOUT)
  }

  return (
    <Button onClick={handleCopy} size={size} variant={variant}>
      {copied ? (
        <>
          <CheckIcon className={showText ? 'size-4' : 'size-5'} />
          {showText && <span className="ml-2">Copied!</span>}
        </>
      ) : (
        <>
          <Image
            alt="shadcn/ui"
            className={showText ? 'size-4' : 'size-5'}
            height={20}
            src="/shadcn-logo.png"
            width={20}
          />
          {showText && <span className="ml-2">Install with shadcn</span>}
        </>
      )}
    </Button>
  )
}
