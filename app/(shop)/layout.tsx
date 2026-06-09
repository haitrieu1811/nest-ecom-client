import React from 'react'

import Header from '@/app/(shop)/_components/header'
import Footer from '@/app/(shop)/_components/footer'
import MobileNav from '@/app/(shop)/_components/mobile-nav'
import ScrollToTop from '@/app/(shop)/_components/scroll-to-top'

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <React.Fragment>
      <Header />
      <div className="pb-16 md:pb-0">
        <main className="max-w-7xl mx-auto px-4 md:px-6 xl:px-0">{children}</main>
      </div>
      <Footer />
      <MobileNav />
      <ScrollToTop />
    </React.Fragment>
  )
}
