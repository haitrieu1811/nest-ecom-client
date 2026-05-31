'use client'

import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import HeaderAccount from '@/app/(shop)/_components/header-account'
import ModeToggle from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import { ROLE_NAME } from '@/constants/auth.constant'
import PATH from '@/constants/path'
import useIsClient from '@/hooks/use-is-client'
import { useAppStore } from '@/providers/app.provider'

export default function Header() {
  const { isAuthenticated, profile } = useAppStore()
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
            <React.Fragment>
              <Link href={PATH.LOGIN}>Đăng nhập</Link>
              <Link href={PATH.REGISTER}>Đăng ký</Link>
            </React.Fragment>
          )}
          {isAuthenticated && isClient && (
            <div className="flex items-center space-x-4">
              {/* Chỉ hiển thị nút Dashboard nếu người dùng không phải là CLIENT */}
              {profile && profile.role.name !== ROLE_NAME.CLIENT && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={PATH.DASHBOARD}>Trang quản trị</Link>
                </Button>
              )}
              <HeaderAccount />
            </div>
          )}
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
