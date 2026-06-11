/* eslint-disable react-hooks/set-state-in-effect */

'use client'

import {
  ZapIcon,
  TimerIcon,
  ArrowLeftIcon,
  GiftIcon,
  FlameIcon,
  ShoppingBagIcon,
  PercentIcon,
  TrendingUpIcon,
  CheckIcon,
  HelpCircleIcon,
  ShieldCheckIcon,
  AwardIcon,
  RefreshCwIcon,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { toast } from 'sonner'

import { productApi } from '@/apis/product.api'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import PATH from '@/constants/path'
import { formatCurrency } from '@/lib/utils'
import { ProductIncludeTranslationsType } from '@/schemas/product.schema'

const SESSIONS = [
  { time: '09:00', label: '09:00', status: 'Đã kết thúc' },
  { time: '12:00', label: '12:00', status: 'Đã kết thúc' },
  { time: '15:00', label: '15:00', status: 'Đang diễn ra', active: true },
  { time: '18:00', label: '18:00', status: 'Sắp diễn ra' },
  { time: '21:00', label: '21:00', status: 'Sắp diễn ra' },
]

const VOUCHERS = [
  { id: 'fs', code: 'FSFREE', value: 'FREESHIP 0Đ', desc: 'Tối đa 30k cho mọi đơn hàng', type: 'ship' },
  { id: 'f50', code: 'FLASH50K', value: 'GIẢM 50.000Đ', desc: 'Đơn hàng tối thiểu từ 250k', type: 'cash' },
  { id: 'f10', code: 'FLASH10', value: 'GIẢM 10%', desc: 'Tối đa 120k cho ngành hàng Điện tử', type: 'percent' },
]

const getTimeLeft = (endAt: number) => {
  const now = Date.now()
  const distance = Math.max(0, endAt - now)

  const hours = Math.floor(distance / (1000 * 60 * 60))
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((distance % (1000 * 60)) / 1000)

  return { hours, minutes, seconds }
}

export default function FlashSaleLandingPage() {
  const [products, setProducts] = React.useState<ProductIncludeTranslationsType[]>([])
  const [loading, setLoading] = React.useState(true)
  const [activeSession, setActiveSession] = React.useState('15:00')
  const [claimedVouchers, setClaimedVouchers] = React.useState<string[]>([])

  // Lucky wheel state
  const [spinDeg, setSpinDeg] = React.useState(0)
  const [isSpinning, setIsSpinning] = React.useState(false)
  const [luckyPrize, setLuckyPrize] = React.useState<string | null>(null)

  // FAQ state
  const [openFaq, setOpenFaq] = React.useState<number | null>(null)

  const handleSpinWheel = () => {
    if (isSpinning) return

    const WHEEL_PRIZES = [
      { text: 'Voucher 100k', code: 'WHEEL100K' },
      { text: 'Chúc bạn may mắn', code: 'TRYAGAIN' },
      { text: 'Mã Giảm 20k', code: 'WHEEL20K' },
      { text: 'Miễn Phí Vận Chuyển', code: 'WHEELFS' },
      { text: 'Voucher 50k', code: 'WHEEL50K' },
      { text: 'Voucher Giảm 10%', code: 'WHEEL10' },
    ]

    setIsSpinning(true)
    setLuckyPrize(null)

    // Choose a random prize
    const prizeIndex = Math.floor(Math.random() * WHEEL_PRIZES.length)
    const prize = WHEEL_PRIZES[prizeIndex]

    // Calculate rotation degree (minimum 5 full spins + slice offset)
    const newDeg = spinDeg + 1800 + (360 - (prizeIndex * 60) - 30)
    setSpinDeg(newDeg)

    setTimeout(() => {
      setIsSpinning(false)
      setLuckyPrize(prize.text)
      if (prize.code !== 'TRYAGAIN') {
        toast.success(`Chúc mừng! Bạn đã trúng giải: ${prize.text}. Mã voucher: ${prize.code}`)
      } else {
        toast.error('Rất tiếc! Chúc bạn may mắn ở lượt quay sau nhé.')
      }
    }, 5000)
  }

  // Timer setup (ends at end of current hour + 2 hours to simulate dynamic countdown)
  const saleEndAt = React.useMemo(() => {
    const target = new Date()
    target.setHours(target.getHours() + 2, 59, 59, 999)
    return target.getTime()
  }, [])

  const [timeLeft, setTimeLeft] = React.useState({ hours: 0, minutes: 0, seconds: 0 })

  React.useEffect(() => {
    setTimeLeft(getTimeLeft(saleEndAt))
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(saleEndAt))
    }, 1000)

    return () => clearInterval(timer)
  }, [saleEndAt])

  // Fetch products
  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const res = await productApi.getList({ page: 1, limit: 16 })
        setProducts(res.payload.data)
      } catch (err) {
        console.error('Failed to load products for flash sale landing', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const handleClaimVoucher = (id: string, code: string) => {
    if (claimedVouchers.includes(id)) return
    setClaimedVouchers((prev) => [...prev, id])
    toast.success(`Đã nhận voucher thành công! Mã: ${code}`)
  }

  const handleSessionClick = (session: (typeof SESSIONS)[number]) => {
    if (session.status === 'Sắp diễn ra') {
      toast.info(`Khung giờ ${session.time} sẽ bắt đầu sau ít giờ nữa. Hãy đón chờ nhé!`)
      return
    }
    if (session.status === 'Đã kết thúc') {
      toast.error(`Khung giờ ${session.time} đã kết thúc. Vui lòng săn các deal đang diễn ra!`)
      return
    }
    setActiveSession(session.time)
  }

  const featuredProduct = products[0]
  const listProducts = products.slice(1)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-orange-500/35 selection:text-orange-300 relative overflow-hidden">
      {/* Background decoration elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-rose-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Standalone Landing Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-900 px-4 py-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-slate-100 hover:bg-slate-900 rounded-full"
            >
              <Link href={PATH.HOME}>
                <ArrowLeftIcon className="size-5" />
              </Link>
            </Button>
            <Link href={PATH.HOME} className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tight bg-linear-to-r from-orange-400 to-rose-500 bg-clip-text text-transparent">
                NEST ECOM
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            <Link href={PATH.HOME} className="hover:text-slate-100 transition-colors">
              Cửa hàng
            </Link>
            <span className="text-slate-800">|</span>
            <span className="text-orange-400 flex items-center gap-1">
              <FlameIcon className="size-4 animate-pulse" /> Săn Deal Hot
            </span>
          </div>

          <Button
            asChild
            size="sm"
            className="rounded-full bg-linear-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white font-medium shadow-lg shadow-orange-600/15"
          >
            <Link href={PATH.HOME}>Về Cửa Hàng</Link>
          </Button>
        </div>
      </header>

      {/* Hero Banner Section */}
      <section className="pt-12 pb-8 px-4 text-center max-w-4xl mx-auto relative z-10">
        <div className="inline-flex items-center gap-2 px-4.5 py-1.5 rounded-full bg-orange-600/10 border border-orange-500/20 text-orange-400 text-xs sm:text-sm font-semibold tracking-wide uppercase mb-6 animate-pulse">
          <ZapIcon className="size-4 fill-orange-400" />
          Giờ Vàng Săn Sale - Giảm Đến 70%
        </div>
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight uppercase mb-6 select-none leading-none">
          <span className="bg-linear-to-r from-orange-400 via-red-500 to-rose-600 bg-clip-text text-transparent">
            Flash Sale
          </span>
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed mb-10">
          Chương trình ưu đãi chớp nhoáng với mức giá sốc nhất ngày. Số lượng giới hạn, kết thúc khi hết thời gian hoặc
          hết hàng!
        </p>

        {/* Big Countdown Timer Card */}
        <div className="inline-flex flex-col items-center p-6 sm:p-8 rounded-3xl border border-slate-900 bg-slate-900/40 backdrop-blur-md shadow-2xl relative">
          <div className="absolute -inset-1 rounded-[26px] bg-linear-to-tr from-orange-500/20 to-rose-600/20 blur-md opacity-70 pointer-events-none" />
          <div className="flex items-center gap-2 text-slate-400 text-xs uppercase tracking-widest font-semibold mb-4">
            <TimerIcon className="size-4 text-orange-500 animate-pulse" />
            Thời gian còn lại
          </div>
          <div className="flex items-center gap-3 sm:gap-4 font-mono text-3xl sm:text-5xl font-black">
            {/* Hours */}
            <div className="flex flex-col items-center">
              <span className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-orange-500 shadow-inner">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mt-2">Giờ</span>
            </div>
            <span className="text-orange-500/60 pb-6 sm:pb-7">:</span>

            {/* Minutes */}
            <div className="flex flex-col items-center">
              <span className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-orange-500 shadow-inner">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mt-2">Phút</span>
            </div>
            <span className="text-orange-500/60 pb-6 sm:pb-7">:</span>

            {/* Seconds */}
            <div className="flex flex-col items-center">
              <span className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-orange-500 shadow-inner animate-pulse">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mt-2">Giây</span>
            </div>
          </div>
        </div>
      </section>

      {/* Session Slots Selector Section */}
      <section className="border-y border-slate-900 bg-slate-950/50 sticky top-[73px] z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center overflow-x-auto scrollbar-none py-3 gap-2">
            {SESSIONS.map((sess) => {
              const isActive = activeSession === sess.time
              const isOngoing = sess.status === 'Đang diễn ra'
              const isEnded = sess.status === 'Đã kết thúc'

              return (
                <button
                  key={sess.time}
                  onClick={() => handleSessionClick(sess)}
                  className={`flex-1 min-w-[120px] text-center px-4 py-2.5 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center gap-1 select-none shrink-0 ${
                    isActive
                      ? 'bg-orange-500/10 border-orange-500/40 text-orange-400 shadow-md'
                      : isOngoing
                        ? 'bg-slate-900/60 border-slate-800 text-slate-200 hover:border-slate-700'
                        : 'bg-transparent border-transparent text-slate-500 hover:text-slate-400'
                  }`}
                >
                  <span className="text-base font-bold tracking-wide">{sess.label}</span>
                  <span
                    className={`text-[9px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded-full ${
                      isOngoing
                        ? 'bg-orange-500 text-slate-950 font-black'
                        : isEnded
                          ? 'bg-slate-900 text-slate-600'
                          : 'border border-slate-800 text-slate-600'
                    }`}
                  >
                    {sess.status}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Vouchers Claim Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="flex items-center gap-2.5 mb-8">
          <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
            <GiftIcon className="size-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-wide">Voucher Độc Quyền Giờ Vàng</h2>
            <p className="text-slate-400 text-xs sm:text-sm">Nhận ngay mã giảm giá để chốt đơn rẻ hơn nữa.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {VOUCHERS.map((voucher) => {
            const isClaimed = claimedVouchers.includes(voucher.id)

            return (
              <div
                key={voucher.id}
                className="group relative flex items-center justify-between p-5 rounded-2xl border border-slate-900 bg-slate-900/30 backdrop-blur-xs overflow-hidden transition-all duration-300 hover:border-orange-500/25"
              >
                {/* Visual coupon edge notches */}
                <div className="absolute top-1/2 -left-3 size-6 rounded-full bg-slate-950 border-r border-slate-900 -translate-y-1/2" />
                <div className="absolute top-1/2 -right-3 size-6 rounded-full bg-slate-950 border-l border-slate-900 -translate-y-1/2" />

                <div className="flex items-center gap-4.5 pl-2">
                  <div className="p-3.5 rounded-xl bg-orange-500/10 text-orange-400 group-hover:scale-105 transition-transform">
                    <PercentIcon className="size-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
                      NEST VOUCHER
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-100 leading-snug mt-0.5">
                      {voucher.value}
                    </h3>
                    <p className="text-slate-400 text-xs mt-1">{voucher.desc}</p>
                  </div>
                </div>

                <Button
                  onClick={() => handleClaimVoucher(voucher.id, voucher.code)}
                  variant={isClaimed ? 'secondary' : 'default'}
                  size="sm"
                  disabled={isClaimed}
                  className={`rounded-xl shrink-0 font-semibold text-xs select-none pr-3 ${
                    isClaimed
                      ? 'bg-slate-800 text-slate-500 border-none'
                      : 'bg-orange-500 hover:bg-orange-600 text-slate-950 font-black shadow-md shadow-orange-500/10'
                  }`}
                >
                  {isClaimed ? (
                    <span className="flex items-center gap-1">
                      <CheckIcon className="size-3.5" /> Đã Lấy
                    </span>
                  ) : (
                    'Lấy Mã'
                  )}
                </Button>
              </div>
            )
          })}
        </div>
      </section>

      {/* Featured Hot Deal Section */}
      {featuredProduct && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="flex items-center gap-2.5 mb-8">
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500">
              <FlameIcon className="size-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-wide">Siêu Deal Hủy Diệt Giờ Vàng</h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                Ưu đãi giảm giá sốc nhất, sản phẩm hot nhất phiên chợ.
              </p>
            </div>
          </div>

          <div className="relative group rounded-3xl border border-slate-900 bg-slate-900/20 backdrop-blur-md p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 overflow-hidden">
            {/* Ambient halo blur behind layout */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-rose-600/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="lg:col-span-5 relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-900">
              {featuredProduct.thumbnail ? (
                <Image
                  src={featuredProduct.thumbnail}
                  alt={featuredProduct.name}
                  fill
                  className="object-cover group-hover:scale-102 transition-transform duration-700"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-slate-600 bg-slate-950/80 uppercase font-semibold">
                  Không có ảnh
                </div>
              )}
              <Badge className="absolute top-4 left-4 bg-linear-to-r from-orange-500 to-rose-600 text-white font-extrabold border-none px-3.5 py-1.5 shadow-lg shadow-orange-500/20 text-[11px] uppercase tracking-wider">
                DEAL SỐC NHẤT
              </Badge>
            </div>

            <div className="lg:col-span-7 flex flex-col justify-between py-2">
              <div>
                <span className="text-xs font-bold text-orange-400 uppercase tracking-widest flex items-center gap-1">
                  <TrendingUpIcon className="size-3.5" /> BÁN CHẠY NHẤT
                </span>
                <h3 className="text-xl sm:text-3xl font-bold text-slate-100 leading-snug mt-3 mb-4 line-clamp-2">
                  {featuredProduct.name}
                </h3>
                <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-6 line-clamp-3">
                  {featuredProduct.description.replace(/<[^>]*>/g, '') ||
                    'Sản phẩm chất lượng cao với thiết kế hiện đại, đáp ứng tốt mọi tiêu chuẩn sử dụng hàng ngày.'}
                </p>

                {/* Price Display */}
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="text-3xl sm:text-4xl font-extrabold text-orange-500">
                    {formatCurrency(featuredProduct.basePrice)}
                  </span>
                  {featuredProduct.virtualPrice > featuredProduct.basePrice && (
                    <>
                      <span className="text-base text-slate-500 line-through">
                        {formatCurrency(featuredProduct.virtualPrice)}
                      </span>
                      <span className="text-xs font-black px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-500 border border-rose-500/20">
                        GIẢM{' '}
                        {Math.round(
                          ((featuredProduct.virtualPrice - featuredProduct.basePrice) / featuredProduct.virtualPrice) *
                            100,
                        )}
                        %
                      </span>
                    </>
                  )}
                </div>

                {/* Live Stock Sold Tracker */}
                <div className="space-y-2 max-w-md mb-8">
                  <div className="flex justify-between text-xs font-medium text-slate-400">
                    <span>Đã bán: 78%</span>
                    <span className="text-orange-400 animate-pulse">Sắp cháy hàng!</span>
                  </div>
                  <div className="h-3 w-full bg-slate-900 border border-slate-800 rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full bg-linear-to-r from-orange-500 to-rose-600 rounded-full transition-all duration-1000"
                      style={{ width: '78%' }}
                    />
                  </div>
                </div>
              </div>

              <Button
                asChild
                className="w-full sm:w-auto min-w-48 rounded-2xl bg-linear-to-r from-orange-500 via-red-500 to-rose-600 hover:from-orange-600 hover:via-red-600 hover:to-rose-700 text-white font-bold tracking-wide uppercase py-6 shadow-lg shadow-orange-500/15"
              >
                <Link href={PATH.PRODUCT_DETAIL(featuredProduct.name, featuredProduct.id)}>Săn Ngay Hôm Nay</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Grid of Other Deals */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="flex items-center gap-2.5 mb-8">
          <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
            <ShoppingBagIcon className="size-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-wide">Danh Sách Deal Giờ Vàng</h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Tổng hợp các sản phẩm sale sốc trong khung giờ hiện tại.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-3/4 rounded-2xl bg-slate-900 border border-slate-950 animate-pulse" />
            ))}
          </div>
        ) : listProducts.length === 0 ? (
          <div className="text-center py-20 text-slate-500 border border-slate-900 rounded-3xl bg-slate-900/10">
            Hiện tại chưa có thêm sản phẩm sale nào trong khung giờ này. Quay lại sau nhé!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {listProducts.map((product) => {
              const hasDiscount = product.virtualPrice > product.basePrice
              const discountPercent = hasDiscount
                ? Math.round(((product.virtualPrice - product.basePrice) / product.virtualPrice) * 100)
                : 0

              // Stable pseudo stock level based on product ID
              const stockPercent = 35 + ((product.id * 11) % 55)
              const isLowStock = stockPercent >= 75

              return (
                <div
                  key={product.id}
                  className="group flex flex-col justify-between rounded-2xl border border-slate-900 hover:border-orange-500/25 bg-slate-900/30 backdrop-blur-xs overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-xs hover:shadow-lg hover:shadow-orange-500/5"
                >
                  <Link href={PATH.PRODUCT_DETAIL(product.name, product.id)} className="flex flex-col h-full">
                    {/* Thumbnail wrapper */}
                    <div className="relative aspect-square w-full bg-slate-950 overflow-hidden">
                      {hasDiscount && (
                        <div className="absolute top-3 right-3 z-10 bg-rose-500 text-white font-extrabold text-xs px-2.5 py-0.5 rounded-full select-none shadow-md">
                          -{discountPercent}%
                        </div>
                      )}
                      {product.thumbnail ? (
                        <Image
                          src={product.thumbnail}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-102 transition-transform duration-500"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-slate-600 bg-slate-950/80 uppercase font-semibold">
                          Không có ảnh
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Title - not too small, not too bold */}
                        <h4 className="line-clamp-2 text-sm sm:text-base font-medium leading-snug text-slate-100 group-hover:text-orange-400 transition-colors duration-200 min-h-[44px]">
                          {product.name}
                        </h4>

                        {/* Price Area */}
                        <div className="flex items-baseline gap-2 mt-3 mb-4">
                          <span className="text-lg font-bold text-orange-500">{formatCurrency(product.basePrice)}</span>
                          {hasDiscount && (
                            <span className="text-xs text-slate-500 line-through">
                              {formatCurrency(product.virtualPrice)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Stock levels bar indicator */}
                      <div className="space-y-1.5 mt-2">
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          <span>Đã bán: {stockPercent}%</span>
                          <span className={isLowStock ? 'text-rose-500 animate-pulse' : 'text-slate-500'}>
                            {isLowStock ? 'Sắp Hết' : 'Vừa Mở'}
                          </span>
                        </div>
                        <div className="h-2 w-full bg-slate-950 border border-slate-900/60 rounded-full overflow-hidden p-0.5">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isLowStock ? 'bg-linear-to-r from-orange-500 to-rose-600' : 'bg-orange-500/70'
                            }`}
                            style={{ width: `${stockPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Mini Game Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 p-8 sm:p-10 rounded-3xl border border-slate-900 bg-slate-900/10 backdrop-blur-md relative">
          <div className="lg:max-w-md space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              <AwardIcon className="size-4 animate-bounce" />
              Mini Game Giờ Vàng
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-wide leading-tight">
              Vòng Quay <br />
              <span className="bg-linear-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">May Mắn</span>
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Nhận thêm các phần quà khủng hoàn toàn miễn phí! Quay ngay để nhận mã giảm giá lên tới 100k áp dụng trực tiếp cho giỏ hàng Flash Sale của bạn.
            </p>
            {luckyPrize && (
              <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-center">
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">Phần Quà Nhận Được</span>
                <span className="text-base font-black text-white mt-1 block">{luckyPrize}</span>
              </div>
            )}
          </div>

          {/* Lucky Wheel Graphic */}
          <div className="relative flex items-center justify-center shrink-0">
            {/* Pointer needle */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[22px] border-t-orange-500 z-30 animate-bounce" />

            {/* Glowing outer shadow ring */}
            <div className="absolute -inset-4 rounded-full bg-linear-to-tr from-indigo-500/15 to-purple-500/15 blur-lg pointer-events-none" />

            {/* The Wheel */}
            <div
              className="relative size-72 sm:size-80 rounded-full border-4 border-slate-900 shadow-2xl transition-transform duration-5000 ease-out overflow-hidden z-10"
              style={{
                transform: `rotate(${spinDeg}deg)`,
                backgroundImage: 'conic-gradient(#f59e0b 0deg 60deg, #1e293b 60deg 120deg, #ef4444 120deg 180deg, #10b981 180deg 240deg, #3b82f6 240deg 300deg, #8b5cf6 300deg 360deg)',
              }}
            >
              {/* Wheel Slice Text Labels */}
              <div className="absolute inset-0 z-20 pointer-events-none text-white text-[10px] sm:text-xs font-black">
                <div className="absolute top-[20%] left-1/2 -translate-x-1/2 rotate-30 origin-center text-center">100k</div>
                <div className="absolute top-[38%] right-[10%] rotate-90 origin-center text-center text-slate-400">Trượt</div>
                <div className="absolute bottom-[20%] right-[22%] rotate-[150deg] origin-center text-center">20k</div>
                <div className="absolute bottom-[20%] left-[22%] rotate-[210deg] origin-center text-center">Freeship</div>
                <div className="absolute top-[38%] left-[10%] rotate-[270deg] origin-center text-center">50k</div>
                <div className="absolute top-[20%] left-1/2 -translate-x-1/2 rotate-[330deg] origin-center text-center">10% Off</div>
              </div>

              {/* Radial separator lines */}
              <div className="absolute inset-0 bg-[repeating-conic-gradient(transparent_0deg_59deg,#0f172a_59deg_60deg)] z-15" />
            </div>

            {/* Inner Center Spin Button */}
            <button
              onClick={handleSpinWheel}
              disabled={isSpinning}
              className="absolute size-20 rounded-full bg-white text-slate-950 hover:bg-orange-500 hover:text-white transition-all duration-300 font-black text-sm uppercase shadow-2xl border-4 border-slate-950 flex flex-col items-center justify-center cursor-pointer z-20 select-none scale-95 hover:scale-105 active:scale-95 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed"
            >
              {isSpinning ? (
                <RefreshCwIcon className="size-5 animate-spin" />
              ) : (
                'QUAY'
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Sponsoring Brands */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 border-t border-slate-900/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-wide">Thương Hiệu Tài Trợ Săn Deal</h2>
            <p className="text-slate-400 text-xs sm:text-sm">Mua sắm các thương hiệu đồng hành tài trợ giá kịch sàn.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {[
            { name: 'Apple', deal: 'Giảm đến 30%', logo: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=120&auto=format&fit=crop&q=60' },
            { name: 'Samsung', deal: 'Tặng kèm Quà 2M', logo: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=120&auto=format&fit=crop&q=60' },
            { name: 'Sony', deal: 'Voucher 500k', logo: 'https://images.unsplash.com/photo-1598331668826-20cecc596b86?w=120&auto=format&fit=crop&q=60' },
            { name: 'Nike', deal: 'Đồng giá từ 999k', logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&auto=format&fit=crop&q=60' },
            { name: 'Adidas', deal: 'Mua 2 Giảm 20%', logo: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=120&auto=format&fit=crop&q=60' },
            { name: 'Philips', deal: 'Freeship mọi đơn', logo: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=120&auto=format&fit=crop&q=60' },
          ].map((brand) => (
            <div
              key={brand.name}
              className="group p-5 rounded-2xl border border-slate-900/85 bg-slate-900/10 hover:border-slate-800 hover:bg-slate-900/30 flex flex-col items-center justify-between text-center transition-all duration-300 relative overflow-hidden"
            >
              <div className="relative size-12 mb-3 filter grayscale group-hover:grayscale-0 transition-all duration-300 rounded-lg overflow-hidden">
                <Image src={brand.logo} alt={brand.name} fill className="object-cover" unoptimized />
              </div>
              <h4 className="text-xs font-semibold text-slate-400 group-hover:text-slate-200 transition-colors">{brand.name}</h4>
              <span className="inline-block text-[10px] font-extrabold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full mt-2 leading-none uppercase tracking-wider">
                {brand.deal}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Program Terms & Rules */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 border-t border-slate-900/60">
        <div className="flex items-center gap-2.5 mb-8">
          <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
            <ShieldCheckIcon className="size-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-wide">Thể Lệ Săn Deal Flash Sale</h2>
            <p className="text-slate-400 text-xs sm:text-sm">Quy tắc và thể lệ tham gia chương trình để đảm bảo công bằng.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Thanh toán siêu tốc',
              desc: 'Các sản phẩm trong giỏ hàng không được giữ chỗ. Ưu đãi chỉ dành cho những người hoàn thành đặt hàng sớm nhất.',
            },
            {
              title: 'Giới hạn số lượng',
              desc: 'Mỗi tài khoản khách hàng chỉ được đặt tối đa 2 đơn vị sản phẩm sale trong cùng một khung giờ để tránh gom hàng.',
            },
            {
              title: 'Giao dịch công bằng',
              desc: 'Hệ thống tự động quét và vô hiệu hóa các đơn hàng nghi ngờ gian lận, dùng tool auto click hoặc phần mềm cheat.',
            },
          ].map((rule, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-slate-900 bg-slate-900/10 flex flex-col justify-start gap-3 transition-colors hover:border-slate-800"
            >
              <span className="text-orange-500 font-extrabold text-base tracking-wide">0{idx + 1}.</span>
              <h3 className="text-base sm:text-lg font-bold text-slate-200">{rule.title}</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{rule.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs Section */}
      <section className="max-w-3xl mx-auto px-4 py-12 border-t border-slate-900/60">
        <div className="text-center mb-10 space-y-2">
          <div className="inline-flex items-center justify-center p-2 rounded-full bg-slate-900 text-slate-400">
            <HelpCircleIcon className="size-6" />
          </div>
          <h2 className="text-xl sm:text-3xl font-bold tracking-wide text-slate-100">Câu Hỏi Thường Gặp</h2>
          <p className="text-slate-400 text-xs sm:text-sm">Giải đáp các thắc mắc phổ biến khi mua sắm giờ vàng.</p>
        </div>

        <div className="space-y-4">
          {[
            {
              q: 'Làm thế nào để áp dụng Voucher cùng lúc với Flash Sale?',
              a: 'Hệ thống tự động áp dụng mức giá Flash Sale cho sản phẩm. Khi thanh toán, bạn chỉ cần chọn thêm các Voucher Độc Quyền đã lấy trong ngày để hưởng mức giảm kép từ chương trình.',
            },
            {
              q: 'Sản phẩm bỏ vào giỏ hàng có giữ được mức giá Flash Sale không?',
              a: 'Không. Giá ưu đãi chỉ được giữ khi đơn hàng hoàn thành thanh toán. Hãy thanh toán nhanh nhất có thể vì deal có thể hết số lượng khuyến mãi bất cứ lúc nào.',
            },
            {
              q: 'Mức giá Flash Sale có được hoàn tiền hoặc đổi trả không?',
              a: 'Có. Mọi sản phẩm mua trong Flash Sale vẫn được hưởng đầy đủ các chính sách bảo hành và đổi trả hàng lỗi theo đúng quy định của Nest E-Commerce.',
            },
          ].map((faq, index) => {
            const isOpen = openFaq === index
            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-900 bg-slate-900/10 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-slate-900/20 transition-colors"
                >
                  <span className="text-xs sm:text-sm font-medium text-slate-200">{faq.q}</span>
                  <span className="text-slate-500 font-bold transition-transform duration-300 text-sm">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-40 border-t border-slate-900/60' : 'max-h-0'
                  }`}
                >
                  <div className="p-6 text-xs sm:text-sm text-slate-400 leading-relaxed bg-slate-950/20">
                    {faq.a}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Standalone Landing Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 px-4 py-8 text-center text-xs text-slate-500 tracking-wide mt-16">
        <div className="max-w-7xl mx-auto space-y-4">
          <p className="font-semibold text-slate-400 uppercase tracking-widest text-center">
            Nest E-Commerce Landing Page
          </p>
          <p className="max-w-xl mx-auto leading-relaxed">
            Quy định săn sale: Mỗi sản phẩm chỉ giới hạn tối đa 2 đơn vị trên một khách hàng. Giá sốc chỉ hiển thị trực
            tuyến trong thời gian đếm ngược của chương trình.
          </p>
          <div className="text-[10px] text-slate-600 pt-2">
            © {new Date().getFullYear()} Nest E-Commerce. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
