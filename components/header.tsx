'use client'

import Image from 'next/image'
import { ThemeToggle } from '@/components/theme-toggle'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'

export function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]:h-12">
      <SidebarTrigger className="-ml-1" />
      <Separator className="mr-2 h-4" orientation="vertical" />
      <div className="flex flex-1 items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Image
            alt="Cursor Commands Explorer Logo"
            className="h-6 w-6"
            height={24}
            src="/logo.svg"
            width={24}
          />
          <h1 className="font-semibold text-base sm:text-lg">
            Cursor Commands Explorer
          </h1>
        </div>
        <ThemeToggle />
      </div>
    </header>
  )
}
