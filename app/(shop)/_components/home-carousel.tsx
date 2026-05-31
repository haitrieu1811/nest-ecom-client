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
      'bg-gradient-to-br from-sky-200 via-cyan-100 to-emerald-200 dark:from-sky-950 dark:via-cyan-900 dark:to-emerald-950',
    iconColor: 'text-sky-600 dark:text-sky-300',
  },
  {
    title: 'Sản phẩm tuyển chọn cho phong cách riêng',
    description: 'Từ thiết bị công nghệ đến đồ gia dụng, mọi lựa chọn đều được chọn lọc để bền và đẹp.',
    cta: 'Xem danh mục',
    href: PATH.CATEGORIES,
    Icon: GemIcon,
    gradient:
      'bg-gradient-to-br from-amber-200 via-orange-100 to-rose-200 dark:from-amber-950 dark:via-orange-900 dark:to-rose-950',
    iconColor: 'text-orange-600 dark:text-orange-300',
  },
  {
    title: 'An tâm mua sắm với dịch vụ tận tâm',
    description: 'Hỗ trợ nhanh chóng, chính sách rõ ràng và trải nghiệm thanh toán bảo mật cho mọi đơn hàng.',
    cta: 'Khám phá ưu đãi',
    href: PATH.HOME,
    Icon: ShieldCheckIcon,
    gradient:
      'bg-gradient-to-br from-lime-200 via-emerald-100 to-teal-200 dark:from-lime-950 dark:via-emerald-900 dark:to-teal-950',
    iconColor: 'text-emerald-700 dark:text-emerald-300',
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

              <div className="pointer-events-none absolute -top-24 -right-16 size-56 rounded-full bg-white/35 blur-3xl dark:bg-white/10" />
              <div className="pointer-events-none absolute -bottom-20 -left-14 size-52 rounded-full bg-white/25 blur-3xl dark:bg-white/10" />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="-left-4 -translate-y-1/2" />
      <CarouselNext className="-right-4 -translate-y-1/2" />
    </Carousel>
  )
}
