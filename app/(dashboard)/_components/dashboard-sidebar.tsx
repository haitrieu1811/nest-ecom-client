'use client'

import {
  BookTextIcon,
  FlagIcon,
  HomeIcon,
  KeyIcon,
  LucideIcon,
  ShoppingBagIcon,
  ShoppingBasketIcon,
  TagsIcon,
  UserIcon,
} from 'lucide-react'
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

export type DataSidebarType = {
  navMain: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    onlyAdminAndManager?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}

const data: DataSidebarType = {
  navMain: [
    {
      title: 'Về trang cửa hàng',
      url: PATH.HOME,
      icon: HomeIcon,
    },
    {
      title: 'Phân quyền',
      url: PATH.DASHBOARD_ROLES,
      icon: KeyIcon,
      onlyAdminAndManager: true,
      items: [
        {
          title: 'Roles',
          url: PATH.DASHBOARD_ROLES,
        },
        {
          title: 'Permissions',
          url: PATH.DASHBOARD_PERMISSIONS,
        },
        {
          title: 'Thêm role mới',
          url: PATH.DASHBOARD_ROLES_NEW,
        },
      ],
    },
    {
      title: 'Người dùng',
      url: PATH.DASHBOARD_USERS,
      icon: UserIcon,
      onlyAdminAndManager: true,
      items: [
        {
          title: 'Tất cả người dùng',
          url: PATH.DASHBOARD_USERS,
        },
        {
          title: 'Thêm người dùng mới',
          url: PATH.DASHBOARD_USERS_NEW,
        },
      ],
    },
    {
      title: 'Danh mục sản phẩm',
      url: PATH.DASHBOARD_CATEGORIES,
      icon: TagsIcon,
      items: [
        {
          title: 'Tất cả danh mục',
          url: PATH.DASHBOARD_CATEGORIES,
        },
        {
          title: 'Thêm danh mục mới',
          url: PATH.DASHBOARD_CATEGORIES_NEW,
        },
      ],
      onlyAdminAndManager: true,
    },
    {
      title: 'Thương hiệu',
      url: PATH.DASHBOARD_BRANDS,
      icon: FlagIcon,
      items: [
        {
          title: 'Tất cả thương hiệu',
          url: PATH.DASHBOARD_BRANDS,
        },
        {
          title: 'Thêm thương hiệu mới',
          url: PATH.DASHBOARD_BRANDS_NEW,
        },
      ],
      onlyAdminAndManager: true,
    },
    {
      title: 'Đơn hàng',
      url: PATH.DASHBOARD_ORDERS,
      icon: BookTextIcon,
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
      onlyAdminAndManager: false,
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
          title: 'Thêm sản phẩm mới',
          url: PATH.DASHBOARD_PRODUCTS_NEW,
        },
      ],
      onlyAdminAndManager: false,
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
