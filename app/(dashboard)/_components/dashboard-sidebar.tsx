'use client'

import { BookTextIcon, ShoppingBagIcon, ShoppingBasketIcon } from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'

import DashboardNavMain from '@/app/(dashboard)/_components/dashboard-main-nav'
import DashboardSidebarProfile from '@/app/(dashboard)/_components/dashboard-sidebar-profile'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import PATH from '@/constants/path'
import { useAppStore } from '@/providers/app.provider'

const data = {
  navMain: [
    {
      title: 'Đơn hàng',
      url: PATH.DASHBOARD_ORDERS,
      icon: BookTextIcon,
      isActive: true,
      items: [
        {
          title: 'Tất cả đơn hàng',
          url: PATH.DASHBOARD_ORDERS,
        },
        {
          title: 'Đơn hàng mới',
          url: '#',
        },
      ],
    },
    {
      title: 'Sản phẩm',
      url: PATH.DASHBOARD_PRODUCTS,
      icon: ShoppingBasketIcon,
      items: [
        {
          title: 'Tất cả sản phẩm',
          url: PATH.DASHBOARD_PRODUCTS,
        },
        {
          title: 'Thêm sản phẩm',
          url: PATH.DASHBOARD_PRODUCTS_NEW,
        },
      ],
    },
  ],
}

export default function DashboardSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { profile } = useAppStore()
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={PATH.DASHBOARD}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <ShoppingBagIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Nest Ecom</span>
                  <span className="truncate text-xs">Dashboard</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <DashboardNavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <DashboardSidebarProfile profile={profile} />
      </SidebarFooter>
    </Sidebar>
  )
}
