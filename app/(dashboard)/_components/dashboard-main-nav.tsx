'use client'

import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

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
import { useAppStore } from '@/providers/app.provider'
import useIsClient from '@/hooks/use-is-client'
import { Skeleton } from '@/components/ui/skeleton'
import { ROLE_NAME } from '@/constants/auth.constant'

export default function DashboardNavMain({ items }: { items: DataSidebarType['navMain'] }) {
  const { profile } = useAppStore()
  const isClient = useIsClient()

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
          return (
            <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction className="data-[state=open]:rotate-90">
                        <ChevronRight />
                        <span className="sr-only">Toggle</span>
                      </SidebarMenuAction>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <Link href={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
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
