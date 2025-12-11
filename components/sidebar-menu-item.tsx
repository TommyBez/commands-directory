'use client'

import {
  FolderIcon,
  HeartIcon,
  HomeIcon,
  type LucideIcon,
  PlusCircleIcon,
  SearchIcon,
  SendIcon,
  ShieldIcon,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'

type IconName =
  | 'home'
  | 'search'
  | 'heart'
  | 'plus-circle'
  | 'send'
  | 'shield'
  | 'folder'

const iconMap: Record<IconName, LucideIcon> = {
  home: HomeIcon,
  search: SearchIcon,
  heart: HeartIcon,
  'plus-circle': PlusCircleIcon,
  send: SendIcon,
  shield: ShieldIcon,
  folder: FolderIcon,
}

type SidebarMenuItemProps = {
  title: string
  url: string
  icon: IconName
  tooltip?: string
}

export function SidebarMenuItemLink({
  title,
  url,
  icon,
  tooltip,
}: SidebarMenuItemProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const Icon = iconMap[icon]

  // Handle URLs with query params (like category URLs)
  const urlPath = url.split('?')[0]
  const urlQueryString = url.split('?')[1] ?? ''
  const urlParams = new URLSearchParams(urlQueryString)

  // Check if current pathname matches
  const pathnameMatches = urlPath === pathname

  // If URL has query params, check if they match
  // If URL has no query params, pathname match is sufficient
  const isActive =
    pathnameMatches &&
    (urlQueryString === '' ||
      Array.from(urlParams.entries()).every(
        ([key, value]) => searchParams.get(key) === value,
      ))

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} tooltip={tooltip ?? title}>
        <Link href={url}>
          <Icon />
          <span>{title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
