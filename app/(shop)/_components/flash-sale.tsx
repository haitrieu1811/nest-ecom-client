'use client'

import { ClockIcon, TimerIcon, ZapIcon } from 'lucide-react'
import React from 'react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const FLASH_SALE_ITEMS = [
  {
    id: 1,
    name: 'Tai nghe Bluetooth Pro X1',
    price: 790000,
    salePrice: 490000,
    discount: '-38%',
  },
  {
    id: 2,
    name: 'Bàn phím cơ RGB TKL',
    price: 1290000,
    salePrice: 890000,
    discount: '-31%',
  },
  {
    id: 3,
    name: 'Chuột gaming siêu nhẹ',
    price: 690000,
    salePrice: 450000,
    discount: '-35%',
  },
  {
    id: 4,
    name: 'Sạc nhanh GaN 65W',
    price: 590000,
    salePrice: 360000,
    discount: '-39%',
  },
] as const

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value)
}

const getTimeLeft = (endAt: number) => {
  const now = Date.now()
  const distance = Math.max(0, endAt - now)

  const days = Math.floor(distance / (1000 * 60 * 60 * 24))
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((distance % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds }
}

export default function FlashSale() {
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
            {FLASH_SALE_ITEMS.map((item) => (
              <Card
                key={item.id}
                className="group relative overflow-hidden pt-2 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
              >
                <Badge className="absolute top-3 left-3 z-10 gap-1 bg-red-500 text-white hover:bg-red-500">
                  <ZapIcon className="size-3.5" />
                  {item.discount}
                </Badge>

                <CardContent className="space-y-3 p-4">
                  <div className="flex aspect-video items-center justify-center rounded-lg border border-dashed bg-muted/60 text-sm text-muted-foreground transition-all duration-300 group-hover:border-primary/35 group-hover:bg-muted/90">
                    Placeholder
                  </div>

                  <h3 className="line-clamp-2 text-sm font-medium leading-5">{item.name}</h3>

                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(item.salePrice)}
                    </span>
                    <span className="text-xs text-muted-foreground line-through">{formatCurrency(item.price)}</span>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <ClockIcon className="size-3.5" />
                    Kết thúc lúc 23:59 hôm nay
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
