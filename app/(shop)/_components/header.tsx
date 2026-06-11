'use client'

import { ShoppingBag, X } from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'

import HeaderAccount from '@/app/(shop)/_components/header-account'
import HeaderSearch from '@/app/(shop)/_components/header-search'
import { Button } from '@/components/ui/button'
import ModeToggle from '@/components/mode-toggle'
import PATH from '@/constants/path'
import useIsClient from '@/hooks/use-is-client'
import { useAppStore } from '@/providers/app.provider'

export default function Header() {
  const { isAuthenticated } = useAppStore()
  const isClient = useIsClient()
  const [showBanner, setShowBanner] = React.useState<boolean>(true)
  return (
    <>
      {/* Promo Sale Banner */}
      {showBanner && (
        <div className="w-full relative bg-linear-to-r from-primary/15 via-primary/5 to-background dark:from-primary/25 dark:via-primary/5 dark:to-background text-foreground py-2 text-center text-xs md:text-[13px] font-medium select-none border-b border-border/40 transition-all duration-300">
          <div className="max-w-7xl w-full mx-auto flex items-center justify-center gap-2 pr-10 pl-4 md:px-8 xl:px-0">
            <span className="hidden sm:inline-flex items-center justify-center bg-primary text-primary-foreground text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse shrink-0">
              HOT DEALS
            </span>
            <span className="truncate">
              🔥 Siêu Sale Đổ Bộ: Giảm đến <strong className="font-extrabold text-primary">50%</strong> toàn bộ sản phẩm
              + Freeship toàn quốc!
            </span>
            <Link
              href={PATH.LANDING_FLASH_SALE}
              className="font-bold underline text-primary hover:text-primary/85 transition-colors ml-1.5 shrink-0 flex items-center gap-0.5"
            >
              Săn Deal Ngay
              <span>→</span>
            </Link>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/80 dark:hover:bg-muted/20 transition-colors cursor-pointer"
            aria-label="Tắt quảng cáo"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      <header className="w-full border-b bg-card sticky top-0 z-50 inset-x-0">
        <div className="max-w-7xl w-full h-14 mx-auto flex justify-between items-center px-4 xl:px-0 gap-2 md:gap-4">
          <Link
            href={PATH.HOME}
            className="group flex items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-muted/60 shrink-0"
          >
            <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm transition-transform duration-300 group-hover:scale-105">
              <ShoppingBag className="size-4" />
            </div>
            <div className="leading-tight hidden sm:block">
              <p className="text-base font-bold tracking-wide text-foreground">Nest Ecom</p>
              <p className="text-[11px] text-muted-foreground hidden md:block">Mua hàng trực tuyến</p>
            </div>
          </Link>

          <HeaderSearch className="flex flex-1 min-w-0 md:max-w-md mx-1 md:mx-4 lg:mx-8" />

          <div className="hidden md:flex items-center space-x-4 shrink-0">
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
    </>
  )
}
