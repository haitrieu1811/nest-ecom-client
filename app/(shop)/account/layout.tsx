import { Metadata } from 'next'
import React from 'react'

import AccountSidebar from '@/app/(shop)/account/account-sidebar'

export const metadata: Metadata = {
  title: 'Tài khoản',
  description: 'Quản lý tài khoản của bạn',
}

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start space-x-8 py-8">
      <AccountSidebar />
      <div className="flex-1">{children}</div>
    </div>
  )
}
