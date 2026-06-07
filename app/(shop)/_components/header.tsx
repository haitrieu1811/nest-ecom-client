'use client'

import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'

import HeaderAccount from '@/app/(shop)/_components/header-account'
import { Button } from '@/components/ui/button'
import ModeToggle from '@/components/mode-toggle'
import PATH from '@/constants/path'
import useIsClient from '@/hooks/use-is-client'
import { useAppStore } from '@/providers/app.provider'

export default function Header() {
  const { isAuthenticated } = useAppStore()
  const isClient = useIsClient()
  return (
    <header className="border-b bg-card sticky top-0 z-50 inset-x-0">
      <div className="w-7xl h-14 mx-auto flex justify-between items-center">
        <Link
          href={PATH.HOME}
          className="group flex items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-muted/60"
        >
          <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm transition-transform duration-300 group-hover:scale-105">
            <ShoppingBag className="size-4" />
          </div>
          <div className="leading-tight">
            <p className="text-base font-bold tracking-wide text-foreground">Nest Ecom</p>
            <p className="text-[11px] text-muted-foreground">Mua hàng trực tuyến</p>
          </div>
        </Link>
        <div className="flex items-center space-x-4">
          {!isAuthenticated && isClient && (
            <div className="flex items-center gap-2">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="rounded-full border-primary/25 px-4 font-semibold text-foreground hover:border-primary/50 hover:bg-primary/10"
              >
                <Link href={PATH.LOGIN}>Đăng nhập</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="rounded-full bg-linear-to-r from-primary via-primary to-primary/80 px-4 font-semibold shadow-md shadow-primary/25 hover:from-primary/90 hover:to-primary"
              >
                <Link href={PATH.REGISTER}>Đăng ký</Link>
              </Button>
            </div>
          )}
          {isAuthenticated && isClient && <HeaderAccount />}
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
