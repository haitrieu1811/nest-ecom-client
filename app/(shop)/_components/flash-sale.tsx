'use client'

import { TimerIcon, ZapIcon, ChevronRightIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import ProductItem from '@/app/(shop)/_components/product-item'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ProductIncludeTranslationsType } from '@/schemas/product.schema'

const getTimeLeft = (endAt: number) => {
  const now = Date.now()
  const distance = Math.max(0, endAt - now)

  const days = Math.floor(distance / (1000 * 60 * 60 * 24))
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((distance % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds }
}

export default function FlashSale({ products }: { products: ProductIncludeTranslationsType[] }) {
  const saleEndAt = React.useMemo(() => {
    const target = new Date()
    target.setHours(23, 59, 59, 999)
    return target.getTime()
  }, [])

  const [timeLeft, setTimeLeft] = React.useState(() => getTimeLeft(saleEndAt))

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(saleEndAt))
    }, 1000)

    return () => clearInterval(timer)
  }, [saleEndAt])

  return (
    <section className="space-y-4">
      <Card className="overflow-hidden border border-slate-200/50 bg-card dark:border-slate-800/80 shadow-xs">
        <CardHeader className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 pt-6">
          <div className="space-y-1 flex flex-col items-center md:items-start text-center md:text-left">
            <CardTitle className="flex items-center gap-2.5 text-2xl md:text-3xl font-black uppercase tracking-wider text-primary select-none pb-1">
              <ZapIcon className="size-7 text-primary fill-primary animate-bounce shrink-0" />
              <span className="relative pb-1">
                Flash Sale
                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-linear-to-r from-primary to-primary/20 rounded-full scale-x-90 origin-left" />
              </span>
            </CardTitle>
            <CardDescription className="font-medium text-xs md:text-sm text-slate-500 dark:text-slate-400">
              Ưu đãi giới hạn hôm nay, số lượng có hạn.
            </CardDescription>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/10 dark:border-primary/20 px-4.5 py-2 shadow-xs shrink-0">
            <TimerIcon className="size-4.5 text-primary animate-pulse shrink-0" />
            <div className="flex items-center gap-1.5 font-mono">
              {/* Days */}
              <div className="flex flex-col items-center">
                <span className="flex h-8 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground font-extrabold text-sm shadow-xs border border-primary/10">
                  {String(timeLeft.days).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
                  Days
                </span>
              </div>
              <span className="text-primary/80 dark:text-primary/70 font-bold self-start mt-1.5 text-sm">:</span>

              {/* Hours */}
              <div className="flex flex-col items-center">
                <span className="flex h-8 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground font-extrabold text-sm shadow-xs border border-primary/10">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
                  Hrs
                </span>
              </div>
              <span className="text-primary/50 dark:text-primary/40 font-bold self-start mt-1.5 text-sm">:</span>

              {/* Minutes */}
              <div className="flex flex-col items-center">
                <span className="flex h-8 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground font-extrabold text-sm shadow-xs border border-primary/10">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
                  Mins
                </span>
              </div>
              <span className="text-primary/50 dark:text-primary/40 font-bold self-start mt-1.5 text-sm">:</span>

              {/* Seconds */}
              <div className="flex flex-col items-center">
                <span className="flex h-8 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground font-extrabold text-sm shadow-xs border border-primary/10 animate-pulse">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
                  Secs
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pb-6">
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {products.slice(0, 6).map((product) => (
              <ProductItem key={product.id} product={product} />
            ))}
          </div>
          <div className="flex justify-center pt-2">
            <Link
              href="/"
              className="group flex items-center gap-1.5 rounded-full bg-linear-to-r from-primary via-primary/95 to-primary/90 hover:from-primary hover:to-primary/95 text-primary-foreground px-5 py-2 font-bold text-xs tracking-wider uppercase shadow-md transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <span>Xem thêm ưu đãi</span>
              <ChevronRightIcon className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
