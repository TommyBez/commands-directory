import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import { McpModal } from '@/components/mcp-modal'
import { ThemeToggle } from '@/components/theme-toggle'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { UserButtons } from '@/components/user-buttons'
import { UserButtonsSkeleton } from '@/components/user-buttons-skeleton'

export function Header() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-1 border-b px-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]:h-12 sm:h-16 sm:gap-2 sm:px-4">
      <SidebarTrigger className="-ml-1" />
      <div className="flex flex-1 items-center justify-between gap-1 sm:gap-2">
        <Link className="flex items-center gap-1.5 sm:gap-2" href="/">
          <Image
            alt="Cursor Commands Explorer"
            className="size-8 sm:size-12"
            height={24}
            src="/cursor-commands-logo.png"
            width={24}
          />
          <h1 className="hidden font-semibold text-base sm:inline sm:text-lg">
            Cursor Commands Explorer
          </h1>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          <McpModal />
          <Suspense fallback={<UserButtonsSkeleton />}>
            <UserButtons />
          </Suspense>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
