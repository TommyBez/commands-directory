'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { UserButtons } from '@/components/user-buttons'

export function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]:h-12">
      <SidebarTrigger className="-ml-1" />
      <Separator className="mr-2 h-4" orientation="vertical" />
      <div className="flex flex-1 items-center justify-between gap-2">
        <Link className="flex items-center gap-2" href="/">
          <Image
            alt="Cursor Commands Explorer"
            className="size-12"
            height={24}
            src="/cursor-commands-logo.png"
            width={24}
          />
          <h1 className="font-semibold text-base sm:text-lg">
            Cursor Commands Explorer
          </h1>
        </Link>
        <div className="flex items-center gap-2">
          <UserButtons />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
