import type { Metadata } from 'next'
import { Mona_Sans as FontSans } from 'next/font/google'

import { Toaster } from '@/components/ui/sonner'
import { cn } from '@/lib/utils'
import TanstackQueryProvider from '@/providers/tanstack-query.provider'
import ThemeProvider from '@/providers/theme.provider'
import './globals.css'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Nest Ecom Trang Chủ',
  description:
    'Trang chủ của Nest Ecom, nơi bạn có thể khám phá các sản phẩm và dịch vụ của chúng tôi. Chúng tôi cung cấp một loạt các sản phẩm chất lượng cao và dịch vụ tuyệt vời để đáp ứng nhu cầu của bạn. Hãy khám phá ngay hôm nay!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn('h-full', 'antialiased', 'font-sans', fontSans.variable)}>
      <body>
        <TanstackQueryProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
            <Toaster richColors position="top-center" />
          </ThemeProvider>
        </TanstackQueryProvider>
      </body>
    </html>
  )
}
