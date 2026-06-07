'use client'

import { LockKeyholeIcon, MapPinHouseIcon, PackageIcon, SettingsIcon, UserIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import PATH from '@/constants/path'
import useIsClient from '@/hooks/use-is-client'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/providers/app.provider'

const NAV_ITEMS = [
  {
    label: 'Tài khoản',
    href: PATH.ACCOUNT,
    icon: UserIcon,
  },
  {
    label: 'Đơn hàng',
    href: PATH.ACCOUNT_ORDERS,
    icon: PackageIcon,
  },
  {
    label: 'Địa chỉ',
    href: PATH.ACCOUNT_ADDRESSES,
    icon: MapPinHouseIcon,
  },
  {
    label: 'Đổi mật khẩu',
    href: PATH.ACCOUNT_CHANGE_PASSWORD,
    icon: LockKeyholeIcon,
  },
  {
    label: 'Cài đặt',
    href: PATH.ACCOUNT_SETTINGS,
    icon: SettingsIcon,
  },
] as const

export default function AccountSidebar() {
  const pathname = usePathname()
  const { profile } = useAppStore()
  const isClient = useIsClient()

  if (!profile || !isClient) return null

  return (
    <aside className="w-full md:sticky md:top-18 md:w-72 md:shrink-0 md:self-start">
      <div className="rounded-2xl border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3 rounded-xl border bg-muted/40 p-3">
          <Avatar className="size-11 ring-2 ring-background">
            <AvatarImage src={profile.avatar || ''} />
            <AvatarFallback>
              {`${profile.email?.[0].toUpperCase()}${profile.email?.[1]?.toUpperCase() || ''}`}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold">{profile.name}</h2>
            <p className="truncate text-xs text-muted-foreground">{profile.email}</p>
          </div>
        </div>

        <div className="mt-4 space-y-1.5">
          <p className="px-2 text-[11px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">Tài khoản</p>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Button
                key={item.href}
                asChild
                variant="ghost"
                className={cn('w-full justify-start gap-2 rounded-lg px-3', {
                  'bg-muted hover:bg-muted': isActive,
                  'hover:bg-muted/70': !isActive,
                })}
              >
                <Link href={item.href} aria-current={isActive ? 'page' : undefined}>
                  <Icon className="size-4" />
                  <span>{item.label}</span>
                </Link>
              </Button>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
