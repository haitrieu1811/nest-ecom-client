import React from 'react'

import ShopHeader from '@/app/(shop)/_components/header'

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <ShopHeader />
      {children}
    </div>
  )
}
