'use client'

import { SignedIn } from '@clerk/nextjs'
import {
  FolderIcon,
  HeartIcon,
  HomeIcon,
  PlusCircleIcon,
  SearchIcon,
  SendIcon,
  ShieldIcon,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import type { Category } from '@/db/schema/categories'

type AppSidebarProps = {
  isAdmin?: boolean
  categories?: Category[]
}

export function AppSidebar({
  isAdmin = false,
  categories = [],
}: AppSidebarProps) {
  const pathname = usePathname()

  const mainNavItems = [
    {
      title: 'Home',
      url: '/',
      icon: HomeIcon,
    },
    {
      title: 'Browse Commands',
      url: '/commands',
      icon: SearchIcon,
    },
  ]

  const userNavItems = [
    {
      title: 'Favorites',
      url: '/favorites',
      icon: HeartIcon,
    },
    {
      title: 'Submit Command',
      url: '/commands/new',
      icon: PlusCircleIcon,
    },
    {
      title: 'My Submissions',
      url: '/submissions',
      icon: SendIcon,
    },
  ]

  const adminNavItems = [
    {
      title: 'Admin Panel',
      url: '/admin/commands',
      icon: ShieldIcon,
    },
  ]

  return (
    <Sidebar>
      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Categories Navigation */}
        {categories.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Categories</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {categories.map((category) => {
                  const categoryUrl = `/commands?category=${category.slug}`
                  return (
                    <SidebarMenuItem key={category.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === categoryUrl}
                        tooltip={category.description ?? category.name}
                      >
                        <Link href={categoryUrl}>
                          <FolderIcon />
                          <span>{category.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* User Navigation - Only show when signed in */}
        <SignedIn>
          <SidebarGroup>
            <SidebarGroupLabel>Your Content</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {userNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      tooltip={item.title}
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SignedIn>

        {/* Admin Navigation - Only show for admins */}
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      tooltip={item.title}
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}
