/* eslint-disable react-hooks/set-state-in-effect */

'use client'

import { useTheme } from '@teispace/next-themes'
import { Home, Moon, Package, ShoppingCart, Sun, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as React from 'react'

import PATH from '@/constants/path'

export default function MobileNav() {
  const pathname = usePathname()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const currentTheme = mounted ? resolvedTheme || theme : 'light'

  const toggleTheme = () => {
    setTheme(currentTheme === 'dark' ? 'light' : 'dark')
  }

  // Check active state for account pages
  const isAccountActive = pathname.startsWith(PATH.ACCOUNT) && !pathname.startsWith(PATH.ACCOUNT_ORDERS)

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-background/80 backdrop-blur-lg border-t border-border/50 pb-safe shadow-[0_-4px_16px_rgba(0,0,0,0.03)] dark:shadow-[0_-4px_24px_rgba(0,0,0,0.2)] md:hidden transition-all duration-300">
      <div className="grid h-full grid-cols-5 items-center justify-center">
        {/* 1. Trang chủ */}
        <Link
          href={PATH.HOME}
          className={`flex flex-col items-center justify-center gap-1 h-full text-center transition-all duration-200 ${
            pathname === PATH.HOME ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Home className="size-5 transition-transform duration-200 active:scale-90" />
          <span className="text-[10px] font-bold leading-none">Trang chủ</span>
        </Link>

        {/* 2. Giỏ hàng */}
        <Link
          href="/cart"
          className={`flex flex-col items-center justify-center gap-1 h-full text-center transition-all duration-200 ${
            pathname === '/cart' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <ShoppingCart className="size-5 transition-transform duration-200 active:scale-90" />
          <span className="text-[10px] font-bold leading-none">Giỏ hàng</span>
        </Link>

        {/* 3. Đổi giao diện (Toggle dark/light mode) */}
        <button
          onClick={toggleTheme}
          className="flex flex-col items-center justify-center gap-1 h-full text-center text-muted-foreground hover:text-foreground transition-all duration-200 cursor-pointer"
          aria-label="Toggle Theme"
        >
          {currentTheme === 'dark' ? (
            <Sun className="size-5 text-yellow-500 animate-pulse active:scale-90 shrink-0" />
          ) : (
            <Moon className="size-5 text-indigo-600 dark:text-indigo-400 active:scale-90 shrink-0" />
          )}
          <span className="text-[10px] font-bold leading-none">Giao diện</span>
        </button>

        {/* 4. Đơn mua */}
        <Link
          href={PATH.ACCOUNT_ORDERS}
          className={`flex flex-col items-center justify-center gap-1 h-full text-center transition-all duration-200 ${
            pathname.startsWith(PATH.ACCOUNT_ORDERS) ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Package className="size-5 transition-transform duration-200 active:scale-90" />
          <span className="text-[10px] font-bold leading-none">Đơn mua</span>
        </Link>

        {/* 5. Tài khoản */}
        <Link
          href={PATH.ACCOUNT}
          className={`flex flex-col items-center justify-center gap-1 h-full text-center transition-all duration-200 ${
            isAccountActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <User className="size-5 transition-transform duration-200 active:scale-90" />
          <span className="text-[10px] font-bold leading-none">Tài khoản</span>
        </Link>
      </div>
    </nav>
  )
}
