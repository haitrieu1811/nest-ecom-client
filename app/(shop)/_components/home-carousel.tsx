/* eslint-disable react-hooks/set-state-in-effect */

'use client'

import { useState, useEffect } from 'react'
import { FlameIcon, GemIcon, ShieldCheckIcon } from 'lucide-react'
import Link from 'next/link'
import Autoplay from 'embla-carousel-autoplay'

import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'
import PATH from '@/constants/path'

const CAROUSEL_ITEMS = [
  {
    title: 'Mua Sắm Thông Minh, Giá Tốt Mỗi Ngày',
    description: 'Khám phá hàng ngàn sản phẩm chính hãng với ưu đãi cập nhật liên tục cho mọi nhu cầu mua sắm của bạn.',
    cta: 'Mua Ngay',
    href: PATH.CATEGORIES,
    Icon: FlameIcon,
    badge: 'HOT DEAL',
    badgeClass: 'bg-rose-500/10 text-rose-500 border-rose-500/30 dark:bg-rose-500/20 dark:text-rose-400',
    gradient:
      'bg-gradient-to-br from-pink-50 via-rose-50 to-amber-50 dark:from-pink-950/20 dark:via-rose-950/30 dark:to-amber-950/20',
    visual: (
      <div className="relative flex justify-center items-center h-full w-full">
        {/* Pulsing aura */}
        <div className="absolute size-60 bg-rose-500/20 rounded-full blur-3xl animate-pulse-glow" />

        {/* Core Glassmorphic Card */}
        <div className="relative z-10 flex flex-col justify-center items-center w-52 h-52 md:w-56 md:h-56 rounded-2xl border border-white/45 dark:border-white/10 bg-white/10 dark:bg-black/20 backdrop-blur-md shadow-2xl animate-float-slow overflow-hidden">
          <div className="p-3.5 rounded-full bg-rose-500/10 border border-rose-500/20 shadow-inner">
            <FlameIcon className="size-12 md:size-14 text-rose-500 animate-pulse" />
          </div>
          <span className="absolute bottom-5 text-[9px] md:text-xs font-black text-slate-800 dark:text-slate-100 tracking-wider bg-white/70 dark:bg-zinc-900/60 px-3 py-1 rounded-full border border-white/20 select-none">
            GIẢM ĐẾN 50%
          </span>
          {/* Decorative design brackets */}
          <div className="absolute top-0 right-0 size-8 border-t-2 border-r-2 border-rose-500/20 rounded-tr-2xl" />
          <div className="absolute bottom-0 left-0 size-8 border-b-2 border-l-2 border-rose-500/20 rounded-bl-2xl" />
        </div>

        {/* Mini floating elements */}
        <div className="absolute top-4 left-1/2 -translate-x-20 bg-amber-400 dark:bg-amber-500 text-slate-950 font-black text-[9px] md:text-[10px] px-2 py-0.5 rounded-md shadow-lg rotate-12 animate-float-medium select-none border border-amber-300 dark:border-amber-400">
          🔥 FLASH SALE
        </div>
        <div className="absolute bottom-6 right-1/2 translate-x-20 bg-white dark:bg-zinc-800 text-rose-500 p-2 rounded-full shadow-lg -rotate-12 animate-float-fast border border-slate-100 dark:border-zinc-700">
          <svg className="size-4 md:size-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
      </div>
    ),
  },
  {
    title: 'Sản Phẩm Tuyển Chọn, Phong Cách Riêng',
    description:
      'Từ thiết bị công nghệ hiện đại đến đồ gia dụng cao cấp, mọi mặt hàng đều được chọn lựa để đảm bảo bền và đẹp.',
    cta: 'Xem Danh Mục',
    href: PATH.CATEGORIES,
    Icon: GemIcon,
    badge: 'EXCLUSIVE',
    badgeClass: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/30 dark:bg-indigo-500/20 dark:text-indigo-400',
    gradient:
      'bg-gradient-to-br from-violet-50 via-indigo-50 to-cyan-50 dark:from-violet-950/20 dark:via-indigo-950/30 dark:to-cyan-950/20',
    visual: (
      <div className="relative flex justify-center items-center h-full w-full">
        {/* Pulsing aura */}
        <div className="absolute size-60 bg-indigo-500/20 rounded-full blur-3xl animate-pulse-glow" />

        {/* Core Glassmorphic Card */}
        <div className="relative z-10 flex flex-col justify-center items-center w-52 h-52 md:w-56 md:h-56 rounded-2xl border border-white/45 dark:border-white/10 bg-white/10 dark:bg-black/20 backdrop-blur-md shadow-2xl animate-float-medium overflow-hidden">
          <div className="p-3.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 shadow-inner">
            <GemIcon className="size-12 md:size-14 text-indigo-600 dark:text-indigo-400 animate-pulse" />
          </div>
          <span className="absolute bottom-5 text-[9px] md:text-xs font-black text-slate-800 dark:text-slate-100 tracking-wider bg-white/70 dark:bg-zinc-900/60 px-3 py-1 rounded-full border border-white/20 select-none">
            PREMIUM 100%
          </span>
          {/* Decorative design brackets */}
          <div className="absolute top-0 left-0 size-8 border-t-2 border-l-2 border-indigo-500/20 rounded-tl-2xl" />
          <div className="absolute bottom-0 right-0 size-8 border-b-2 border-r-2 border-indigo-500/20 rounded-br-2xl" />
        </div>

        {/* Mini floating elements */}
        <div className="absolute top-2 right-1/2 translate-x-20 bg-indigo-600 text-white font-black text-[9px] md:text-[10px] px-2 py-0.5 rounded-md shadow-lg -rotate-12 animate-float-slow select-none border border-indigo-500">
          ⭐ 5.0 RATING
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-20 bg-white dark:bg-zinc-800 text-indigo-500 p-2 rounded-full shadow-lg rotate-12 animate-float-fast border border-slate-100 dark:border-zinc-700">
          <svg className="size-4 md:size-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.246.588 1.81l-3.97 2.883a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 00-1.175 0l-3.97 2.883c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.98 9.72c-.783-.564-.383-1.81.588-1.81h4.907a1 1 0 00.95-.69l1.519-4.674z"
            />
          </svg>
        </div>
      </div>
    ),
  },
  {
    title: 'An Tâm Mua Sắm, Dịch Vụ Tận Tâm',
    description:
      'Hỗ trợ chu đáo, chính sách đổi trả rõ ràng miễn phí và trải nghiệm thanh toán bảo mật tuyệt đối cho mọi khách hàng.',
    cta: 'Khám Phá Ưu Đãi',
    href: PATH.HOME,
    Icon: ShieldCheckIcon,
    badge: 'SECURE',
    badgeClass: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-400',
    gradient:
      'bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 dark:from-emerald-950/20 dark:via-teal-950/30 dark:to-blue-950/20',
    visual: (
      <div className="relative flex justify-center items-center h-full w-full">
        {/* Pulsing aura */}
        <div className="absolute size-60 bg-emerald-500/20 rounded-full blur-3xl animate-pulse-glow" />

        {/* Core Glassmorphic Card */}
        <div className="relative z-10 flex flex-col justify-center items-center w-52 h-52 md:w-56 md:h-56 rounded-2xl border border-white/45 dark:border-white/10 bg-white/10 dark:bg-black/20 backdrop-blur-md shadow-2xl animate-float-slow overflow-hidden">
          <div className="p-3.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-inner">
            <ShieldCheckIcon className="size-12 md:size-14 text-emerald-500 animate-pulse" />
          </div>
          <span className="absolute bottom-5 text-[9px] md:text-xs font-black text-slate-800 dark:text-slate-100 tracking-wider bg-white/70 dark:bg-zinc-900/60 px-3 py-1 rounded-full border border-white/20 select-none">
            TIN CẬY 100%
          </span>
          {/* Decorative design brackets */}
          <div className="absolute top-0 right-0 size-8 border-t-2 border-r-2 border-emerald-500/20 rounded-tr-2xl" />
          <div className="absolute bottom-0 left-0 size-8 border-b-2 border-l-2 border-emerald-500/20 rounded-bl-2xl" />
        </div>

        {/* Mini floating elements */}
        <div className="absolute top-6 left-1/2 -translate-x-20 bg-emerald-500 text-white font-black text-[9px] md:text-[10px] px-2.5 py-0.5 rounded-md shadow-lg rotate-6 animate-float-medium select-none border border-emerald-400">
          🛡️ AN TOÀN 100%
        </div>
        <div className="absolute bottom-6 right-1/2 translate-x-20 bg-white dark:bg-zinc-800 text-emerald-500 p-2 rounded-full shadow-lg -rotate-12 animate-float-fast border border-slate-100 dark:border-zinc-700">
          <svg className="size-4 md:size-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.952 11.952 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>
      </div>
    ),
  },
] as const

export default function HomeCarousel() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  return (
    <div className="relative group w-full overflow-hidden rounded-3xl border border-slate-200/60 dark:border-zinc-800/80 bg-background shadow-xs">
      {/* Custom Keyframe Animations */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(0.8deg); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-9px) rotate(-1deg); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes pulse-glow {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.06); opacity: 0.5; }
        }
        .animate-float-slow {
          animation: float-slow 7s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium 5s ease-in-out infinite;
        }
        .animate-float-fast {
          animation: float-fast 3s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 5s ease-in-out infinite;
        }
      `}</style>

      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        plugins={[
          Autoplay({
            delay: 5000,
            stopOnInteraction: false,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent className="ml-0">
          {CAROUSEL_ITEMS.map((item, index) => (
            <CarouselItem key={index} className="pl-0 min-w-0 w-full">
              <div
                className={`relative flex min-h-[300px] sm:min-h-[340px] md:min-h-[380px] lg:min-h-[420px] w-full p-6 sm:p-10 md:p-12 lg:p-16 transition-all duration-500 ${item.gradient}`}
                aria-label={`Slide ${index + 1}`}
              >
                {/* Visual Glassmorphic Lighting Backdrop Overlay */}
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/5 dark:to-black/35 pointer-events-none" />
                <div className="absolute -top-32 -left-20 size-72 rounded-full bg-white/40 blur-3xl dark:bg-white/5 pointer-events-none" />
                <div className="absolute -bottom-32 -right-20 size-80 rounded-full bg-white/45 blur-3xl dark:bg-white/5 pointer-events-none" />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
                  {/* Left Side Info Panel */}
                  <div className="space-y-4 lg:col-span-7 flex flex-col justify-center items-start text-left">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-black tracking-wider border select-none ${item.badgeClass}`}
                    >
                      {item.badge}
                    </span>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-[1.15] tracking-tight text-slate-900 dark:text-white drop-shadow-xs">
                      {item.title}
                    </h2>

                    <p className="max-w-md text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {item.description}
                    </p>

                    <div className="pt-1">
                      <Button
                        asChild
                        className="bg-primary hover:bg-primary/95 text-white font-bold h-10 px-5 rounded-lg shadow-md shadow-primary/20 hover:shadow-primary/35 transition-all duration-300 hover:scale-102 cursor-pointer text-xs sm:text-sm"
                      >
                        <Link href={item.href}>{item.cta}</Link>
                      </Button>
                    </div>
                  </div>

                  {/* Right Side Visual Panel */}
                  <div className="hidden lg:flex lg:col-span-5 h-full items-center justify-center relative">
                    {item.visual}
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Carousel Arrow Controls */}
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 dark:bg-zinc-950/90 border border-slate-200 dark:border-zinc-800 size-9 rounded-full hover:bg-white dark:hover:bg-zinc-900 text-foreground shadow-md hover:scale-105 z-20 cursor-pointer" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 dark:bg-zinc-950/90 border border-slate-200 dark:border-zinc-800 size-9 rounded-full hover:bg-white dark:hover:bg-zinc-900 text-foreground shadow-md hover:scale-105 z-20 cursor-pointer" />
      </Carousel>

      {/* Modern Slide Dot Indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {Array.from({ length: count }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => api?.scrollTo(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 border-none cursor-pointer p-0 ${
              current === idx
                ? 'bg-primary w-5'
                : 'bg-slate-400/50 dark:bg-zinc-600/50 hover:bg-slate-500/80 dark:hover:bg-zinc-400 w-1.5'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
