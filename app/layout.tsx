import type { Metadata } from 'next'
import { Archivo as FontSans } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader'

import RefreshToken from '@/components/refresh-token'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import AppProvider from '@/providers/app.provider'
import TanstackQueryProvider from '@/providers/tanstack-query.provider'
import ThemeProvider from '@/providers/theme.provider'
import './globals.css'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
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
            <TooltipProvider>
              <AppProvider>
                <NextTopLoader shadow={false} showSpinner={false} color="var(--primary)" />
                {children}
                <RefreshToken />
                <Toaster richColors position="top-center" />
              </AppProvider>
            </TooltipProvider>
          </ThemeProvider>
        </TanstackQueryProvider>
      </body>
    </html>
  )
}
