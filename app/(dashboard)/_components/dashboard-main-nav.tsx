'use client'

import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

import { DataSidebarType } from '@/app/(dashboard)/_components/dashboard-sidebar'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { ROLE_NAME } from '@/constants/auth.constant'
import PATH from '@/constants/path'
import useIsClient from '@/hooks/use-is-client'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/providers/app.provider'

export default function DashboardNavMain({ items }: { items: DataSidebarType['navMain'] }) {
  const { profile } = useAppStore()
  const isClient = useIsClient()
  const pathname = usePathname()

  const isMainActive = React.useCallback(
    (item: DataSidebarType['navMain'][number]) => {
      if (item.url === PATH.HOME) {
        return pathname === '/'
      }
      if (pathname === item.url) return true
      return item.items?.some((subItem) => pathname === subItem.url) ?? false
    },
    [pathname],
  )

  if (!profile || !isClient) return <Skeleton className="h-40" />

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Danh mục</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isRender = item.onlyAdminAndManager
            ? ([ROLE_NAME.ADMIN, ROLE_NAME.MANAGER] as string[]).includes(profile.role.name)
            : true
          if (!isRender) return null
          const active = isMainActive(item)
          return (
            <Collapsible key={item.title} asChild defaultOpen={active || item.isActive}>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={cn({
                    'bg-muted text-foreground pointer-events-none': active,
                    'hover:bg-muted/50 text-muted-foreground': !active,
                  })}
                >
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction
                        className={cn(
                          'data-[state=open]:rotate-90 transition-transform duration-200 text-muted-foreground/75 hover:text-foreground mr-1',
                          active && 'text-foreground/80',
                        )}
                      >
                        <ChevronRight className="size-4" />
                        <span className="sr-only">Toggle</span>
                      </SidebarMenuAction>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub className="border-l border-muted-foreground/15 ml-4.5 pl-2.5 gap-1 mt-0.5">
                        {item.items?.map((subItem) => {
                          const subActive = pathname === subItem.url
                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                className={cn({
                                  'bg-muted text-foreground pointer-events-none': subActive,
                                  'text-muted-foreground/90 hover:bg-muted/40': !subActive,
                                })}
                              >
                                <Link href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          )
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
