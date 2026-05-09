'use client'

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
  },
  {
    label: 'Đơn hàng',
    href: PATH.ACCOUNT_ORDERS,
  },
  {
    label: 'Địa chỉ',
    href: PATH.ACCOUNT_ADDRESSES,
  },
  {
    label: 'Đổi mật khẩu',
    href: PATH.ACCOUNT_CHANGE_PASSWORD,
  },
  {
    label: 'Cài đặt',
    href: PATH.ACCOUNT_SETTINGS,
  },
] as const

export default function AccountSidebar() {
  const pathname = usePathname()
  const { profile } = useAppStore()
  const isClient = useIsClient()

  if (!profile || !isClient) return null

  return (
    <aside className="w-1/5">
      <div className="flex items-start space-x-4">
        <Avatar className="size-10">
          <AvatarImage src={profile.avatar || ''} />
          <AvatarFallback>{`${profile.email?.[0].toUpperCase()}${profile.email?.[1]?.toUpperCase() || ''}`}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-medium">{profile.name}</h2>
          <p className="text-sm text-muted-foreground">{profile.email}</p>
        </div>
      </div>
      <div className="mt-8">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === `/${item.href}`
          return (
            <Button
              key={item.href}
              disabled={isActive}
              asChild
              variant="ghost"
              className={cn('w-full justify-start', {
                'bg-muted/80': isActive,
              })}
            >
              <Link href={item.href}>{item.label}</Link>
            </Button>
          )
        })}
      </div>
    </aside>
  )
}
