import React from 'react'

import Header from '@/app/(shop)/_components/header'
import Footer from '@/app/(shop)/_components/footer'

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <React.Fragment>
      <Header />
      <div>
        <main className="w-7xl mx-auto">{children}</main>
      </div>
      <Footer />
    </React.Fragment>
  )
}
