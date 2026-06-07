'use client'

import { FlameIcon, GemIcon, ShieldCheckIcon } from 'lucide-react'
import Link from 'next/link'
import Autoplay from 'embla-carousel-autoplay'

import { Button } from '@/components/ui/button'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import PATH from '@/constants/path'

const CAROUSEL_ITEMS = [
  {
    title: 'Mua sắm thông minh, giá tốt mỗi ngày',
    description: 'Khám phá hàng ngàn sản phẩm chính hãng với ưu đãi cập nhật liên tục cho mọi nhu cầu.',
    cta: 'Mua ngay',
    href: PATH.CATEGORIES,
    Icon: FlameIcon,
    gradient:
      'bg-gradient-to-br from-pink-100 via-rose-100 to-amber-100 dark:from-pink-950/40 dark:via-rose-900/50 dark:to-amber-900/40',
    iconColor: 'text-rose-500 dark:text-rose-400',
  },
  {
    title: 'Sản phẩm tuyển chọn cho phong cách riêng',
    description: 'Từ thiết bị công nghệ đến đồ gia dụng, mọi lựa chọn đều được chọn lọc để bền và đẹp.',
    cta: 'Xem danh mục',
    href: PATH.CATEGORIES,
    Icon: GemIcon,
    gradient:
      'bg-gradient-to-br from-violet-100 via-indigo-100 to-cyan-100 dark:from-violet-950/40 dark:via-indigo-900/50 dark:to-cyan-900/40',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
  },
  {
    title: 'An tâm mua sắm với dịch vụ tận tâm',
    description: 'Hỗ trợ nhanh chóng, chính sách rõ ràng và trải nghiệm thanh toán bảo mật cho mọi đơn hàng.',
    cta: 'Khám phá ưu đãi',
    href: PATH.HOME,
    Icon: ShieldCheckIcon,
    gradient:
      'bg-gradient-to-br from-emerald-100 via-teal-100 to-blue-100 dark:from-emerald-950/40 dark:via-teal-900/50 dark:to-blue-900/40',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
] as const

export default function HomeCarousel() {
  return (
    <Carousel
      opts={{ loop: true }}
      plugins={[
        Autoplay({
          delay: 5000,
        }),
      ]}
    >
      <CarouselContent className="items-stretch">
        {CAROUSEL_ITEMS.map((item, index) => (
          <CarouselItem key={index} className="h-full">
            <div
              className={`relative flex h-full min-h-64 overflow-hidden rounded-2xl border p-6 md:min-h-72 md:p-8 ${item.gradient}`}
              aria-label={`Slide ${index + 1}`}
            >
              <div className="relative grid w-full items-center gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">Nest Ecom</p>
                  <h2 className="text-2xl font-bold leading-tight md:text-3xl">{item.title}</h2>
                  <p className="max-w-xl text-sm text-muted-foreground md:text-base">{item.description}</p>
                  <Button asChild>
                    <Link href={item.href}>{item.cta}</Link>
                  </Button>
                </div>

                <div className="hidden md:flex md:justify-end">
                  <div className="rounded-3xl border bg-background/55 p-6 shadow-sm backdrop-blur-sm dark:bg-black/20 md:p-8">
                    <item.Icon className={`size-16 md:size-20 ${item.iconColor}`} />
                  </div>
                </div>
              </div>

              <div className="pointer-events-none absolute -top-24 -right-16 size-56 rounded-full bg-white/55 blur-3xl dark:bg-white/15" />
              <div className="pointer-events-none absolute -bottom-20 -left-14 size-52 rounded-full bg-white/45 blur-3xl dark:bg-white/15" />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="-left-4 -translate-y-1/2" />
      <CarouselNext className="-right-4 -translate-y-1/2" />
    </Carousel>
  )
}
