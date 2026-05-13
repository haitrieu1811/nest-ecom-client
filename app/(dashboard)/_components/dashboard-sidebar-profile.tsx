'use client'

import { BadgeCheck, ChevronsUpDown, LogOut, SettingsIcon } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import useIsClient from '@/hooks/use-is-client'
import { ProfileInLSType } from '@/types/utils.type'
import Link from 'next/link'
import PATH from '@/constants/path'

export default function DashboardSidebarProfile({ profile }: { profile: ProfileInLSType | null }) {
  const { isMobile } = useSidebar()
  const isClient = useIsClient()

  if (!isClient || !profile) return <Skeleton className="h-14" />

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={profile.avatar ?? ''} alt={profile.name ?? ''} />
                <AvatarFallback className="rounded-lg">
                  {profile.email ? profile.email.slice(0, 2).toUpperCase() : 'UN'}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{profile.name}</span>
                <span className="truncate text-xs">{profile.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={profile.avatar ?? ''} alt={profile.name ?? ''} />
                  <AvatarFallback className="rounded-lg">
                    {profile.email ? profile.email.slice(0, 2).toUpperCase() : 'UN'}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{profile.name}</span>
                  <span className="truncate text-xs">{profile.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href={PATH.DASHBOARD_PROFILE}>
                  <BadgeCheck />
                  Tài khoản
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <SettingsIcon />
                Cài đặt
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
