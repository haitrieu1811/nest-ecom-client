'use client'

import { TimerIcon, ZapIcon } from 'lucide-react'
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
      <Card className="overflow-hidden border bg-card">
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-xl">
              <ZapIcon className="size-5 text-orange-500" />
              <span className="bg-linear-to-r from-orange-500 via-rose-500 to-amber-500 bg-clip-text text-transparent">
                Flash Sale
              </span>
            </CardTitle>
            <CardDescription>Ưu đãi giới hạn hôm nay, số lượng có hạn.</CardDescription>
          </div>

          <div className="flex items-center gap-2 rounded-xl border bg-linear-to-r from-orange-100 via-rose-100 to-amber-100 p-2 backdrop-blur-sm dark:from-orange-950/40 dark:via-rose-950/40 dark:to-amber-950/40">
            <TimerIcon className="size-4 text-muted-foreground" />
            <div className="flex items-center gap-1.5 text-sm font-semibold">
              <span className="min-w-12 rounded-md bg-foreground px-2 py-1 text-center text-background">
                {String(timeLeft.days).padStart(2, '0')}d
              </span>
              <span className="min-w-12 rounded-md bg-foreground px-2 py-1 text-center text-background">
                {String(timeLeft.hours).padStart(2, '0')}h
              </span>
              <span className="min-w-12 rounded-md bg-foreground px-2 py-1 text-center text-background">
                {String(timeLeft.minutes).padStart(2, '0')}m
              </span>
              <span className="min-w-12 rounded-md bg-foreground px-2 py-1 text-center text-background">
                {String(timeLeft.seconds).padStart(2, '0')}s
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 4).map((product) => (
              <ProductItem key={product.id} product={product} />
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
