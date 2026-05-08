'use client'

import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import HeaderAccount from '@/app/(shop)/_components/header-account'
import ModeToggle from '@/components/mode-toggle'
import PATH from '@/constants/path'
import useIsClient from '@/hooks/use-is-client'
import { useAppStore } from '@/providers/app.provider'

export default function ShopHeader() {
  const { isAuthenticated } = useAppStore()
  const isClient = useIsClient()
  return (
    <header className="border-b">
      <div className="w-7xl h-14 mx-auto flex justify-between items-center">
        <Link href={PATH.HOME} className="text-2xl font-bold flex items-center space-x-2">
          <ShoppingBag />
          <span>NestEcom</span>
        </Link>
        <div className="flex items-center space-x-4">
          {!isAuthenticated && isClient && (
            <React.Fragment>
              <Link href={PATH.LOGIN}>Đăng nhập</Link>
              <Link href={PATH.REGISTER}>Đăng ký</Link>
            </React.Fragment>
          )}
          {isAuthenticated && isClient && <HeaderAccount />}
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
