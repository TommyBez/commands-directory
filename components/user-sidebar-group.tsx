import { SignedIn } from '@clerk/nextjs'
import { SidebarMenuItemLink } from '@/components/sidebar-menu-item'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuSkeleton,
} from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'

const userNavItems = [
  {
    title: 'Favorites',
    url: '/favorites',
    icon: 'heart' as const,
  },
  {
    title: 'Submit Command',
    url: '/commands/new',
    icon: 'plus-circle' as const,
  },
  {
    title: 'My Submissions',
    url: '/submissions',
    icon: 'send' as const,
  },
]

export function UserSidebarGroupSkeleton() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <Skeleton className="h-4 w-20" />
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {userNavItems.map((item) => (
            <SidebarMenuSkeleton key={item.title} showIcon />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export function UserSidebarGroup() {
  return (
    <SignedIn>
      <SidebarGroup>
        <SidebarGroupLabel>Your Content</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {userNavItems.map((item) => (
              <SidebarMenuItemLink
                icon={item.icon}
                key={item.title}
                title={item.title}
                url={item.url}
              />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SignedIn>
  )
}
