import { ChevronDownIcon, LayoutDashboardIcon, LogOutIcon, SettingsIcon, ShoppingBagIcon, UserIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { ROLE_NAME } from '@/constants/auth.constant'
import PATH from '@/constants/path'
import useIsClient from '@/hooks/use-is-client'
import useLogout from '@/hooks/use-logout'
import { useAppStore } from '@/providers/app.provider'

export default function HeaderAccount() {
  const pathname = usePathname()
  const router = useRouter()
  const { profile } = useAppStore()
  const isClient = useIsClient()

  const { handleLogout } = useLogout({
    onSuccess: () => {
      // Nếu đăng xuất lúc ở các trang private thì redirect về trang login sau khi logout thành công
      if (pathname.startsWith(PATH.ACCOUNT)) {
        router.push(PATH.LOGIN)
      }
    },
  })

  if (!profile || !isClient) return <Skeleton className="h-9 w-28 rounded-full" />

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-9 rounded-full border bg-muted/40 px-2 shadow-sm transition-all hover:border-primary/25 hover:bg-muted/70"
        >
          <Avatar className="size-7">
            <AvatarImage src={profile.avatar || ''} alt={profile.name || 'User'} />
            <AvatarFallback>{profile.name?.slice(0, 2).toUpperCase() || 'UN'}</AvatarFallback>
          </Avatar>
          <span className="hidden max-w-28 truncate text-sm font-medium md:inline">
            {profile.name || profile.email}
          </span>
          <ChevronDownIcon className="size-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 rounded-xl p-1">
        <div className="px-2 py-1.5">
          <div className="rounded-lg border bg-muted/40 p-2.5">
            <p className="truncate text-sm font-semibold">{profile.name || 'Người dùng'}</p>
            <p className="truncate text-xs text-muted-foreground">{profile.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />

        {profile.role.name !== ROLE_NAME.CLIENT && (
          <React.Fragment>
            <DropdownMenuGroup>
              <DropdownMenuItem asChild className="rounded-lg">
                <Link href={PATH.DASHBOARD} className="flex w-full items-center gap-2">
                  <LayoutDashboardIcon className="size-4" />
                  <span>Trang quản trị</span>
                  <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground">
                    {profile.role.name}
                  </span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
          </React.Fragment>
        )}
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="rounded-lg">
            <Link href={PATH.ACCOUNT} className="flex items-center gap-2">
              <UserIcon className="size-4" />
              Tài khoản
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="gap-2 rounded-lg">
            <Link href={PATH.ACCOUNT_ORDERS} className="flex items-center gap-2">
              <ShoppingBagIcon className="size-4" />
              Đơn mua
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="rounded-lg">
            <Link href={PATH.ACCOUNT_SETTINGS} className="flex items-center gap-2">
              <SettingsIcon className="size-4" />
              Cài đặt
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive" onClick={handleLogout} className="gap-2 rounded-lg">
            <LogOutIcon className="size-4" />
            Đăng xuất
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
