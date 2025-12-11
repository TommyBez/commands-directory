'use client'

import { CheckIcon } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

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

  const isIconOnly = !showText || size === 'icon'
  const iconSize = showText ? 'size-4' : 'size-5'
  const tooltipText = copied ? 'Copied!' : 'Install with shadcn'
  const ariaLabel = isIconOnly ? tooltipText : undefined

  const buttonContent = copied ? (
    <>
      <CheckIcon aria-hidden="true" className={iconSize} />
      {showText && <span className="ml-2">Copied!</span>}
    </>
  ) : (
    <>
      <Image
        alt="shadcn/ui"
        aria-hidden={isIconOnly ? 'true' : undefined}
        className={iconSize}
        height={20}
        src="/shadcn-logo.png"
        width={20}
      />
      {showText && <span className="ml-2">Install with shadcn</span>}
    </>
  )

  const button = (
    <Button
      aria-label={ariaLabel}
      onClick={handleCopy}
      size={size}
      variant={variant}
    >
      {buttonContent}
    </Button>
  )

  if (isIconOnly) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent>{tooltipText}</TooltipContent>
      </Tooltip>
    )
  }

  return button
}
