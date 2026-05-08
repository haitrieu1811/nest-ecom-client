import React from 'react'

import ShopHeader from '@/app/(shop)/_components/header'

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <React.Fragment>
      <ShopHeader />
      <div>
        <main className="w-7xl mx-auto">{children}</main>
      </div>
    </React.Fragment>
  )
}
