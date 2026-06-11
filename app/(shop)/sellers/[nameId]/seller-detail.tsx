/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import {
  CalendarIcon,
  CheckCircle2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  Grid2X2Icon,
  HeartIcon,
  InfoIcon,
  MessageCircleIcon,
  PercentIcon,
  PlusIcon,
  RotateCcwIcon,
  SearchIcon,
  ShieldCheckIcon,
  SlidersHorizontalIcon,
  SparklesIcon,
  StarIcon,
  StoreIcon,
  TrendingUpIcon,
  UsersIcon,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import ProductItem from '@/app/(shop)/_components/product-item'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useProductsList from '@/hooks/use-products-list'
import { CategoryIncludeTranslationsType } from '@/schemas/category.schema'
import { SellerType } from '@/schemas/user.schema'

type SellerDetailProps = {
  seller: SellerType
  categories: CategoryIncludeTranslationsType[]
  sellerId: number
}

const MOCK_VOUCHERS = [
  { code: 'NEST10K', discount: '10.000 ₫', desc: 'Đơn tối thiểu 100k', expiry: '30/06/2026' },
  { code: 'NEST30K', discount: '30.000 ₫', desc: 'Đơn tối thiểu 300k', expiry: '30/06/2026' },
  { code: 'NEST50K', discount: '50.000 ₫', desc: 'Đơn tối thiểu 500k', expiry: '30/06/2026' },
  { code: 'NEST15PCT', discount: '15%', desc: 'Giảm tối đa 50k đơn từ 200k', expiry: '30/06/2026' },
]

export default function SellerDetail({ seller, categories, sellerId }: SellerDetailProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'all_products' | 'profile'>('home')
  const [isFollowed, setIsFollowed] = useState(false)
  const [savedVouchers, setSavedVouchers] = useState<string[]>([])

  // Search & Filter State
  const [searchVal, setSearchVal] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined)
  const [sortBy, setSortBy] = useState<'name' | 'basePrice' | 'createdAt'>('createdAt')
  const [orderBy, setOrderBy] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchVal)
      setPage(1) // Reset to first page when search changes
    }, 400)
    return () => clearTimeout(handler)
  }, [searchVal])

  // Query products for all products tab
  const {
    products: allProducts,
    pagination,
    getProductsListQuery,
  } = useProductsList({
    createdById: sellerId,
    categoryId: selectedCategoryId,
    name: debouncedSearch || undefined,
    sortBy,
    orderBy,
    page,
    limit: 12,
  })

  // Query products for home tab - Top Sellers (sorted by base price desc as simulation)
  const { products: topProducts, getProductsListQuery: topQuery } = useProductsList({
    createdById: sellerId,
    limit: 6,
    sortBy: 'basePrice',
    orderBy: 'desc',
    enabled: activeTab === 'home',
  })

  // Query products for home tab - New Arrivals (sorted by created at desc)
  const { products: newProducts, getProductsListQuery: newQuery } = useProductsList({
    createdById: sellerId,
    limit: 6,
    sortBy: 'createdAt',
    orderBy: 'desc',
    enabled: activeTab === 'home',
  })

  const getJoinTime = (dateString: string) => {
    const joinedDate = new Date(dateString)
    const now = new Date()
    const diffYears = now.getFullYear() - joinedDate.getFullYear()
    const diffMonths = now.getMonth() - joinedDate.getMonth() + diffYears * 12
    if (diffMonths >= 12) {
      return `${Math.floor(diffMonths / 12)} năm trước`
    }
    if (diffMonths > 0) {
      return `${diffMonths} tháng trước`
    }
    return 'Mới tham gia'
  }

  const handleFollowToggle = () => {
    setIsFollowed((prev) => {
      const next = !prev
      if (next) {
        toast.success(`Cảm ơn bạn đã theo dõi ${seller.name || 'Người bán'}!`)
      } else {
        toast.info(`Đã bỏ theo dõi ${seller.name || 'Người bán'}`)
      }
      return next
    })
  }

  const handleSaveVoucher = (code: string) => {
    if (savedVouchers.includes(code)) return
    setSavedVouchers((prev) => [...prev, code])
    toast.success(`Lưu mã giảm giá ${code} thành công!`)
  }

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || (pagination && newPage > pagination.totalPages)) return
    setPage(newPage)
    const element = document.getElementById('shop-products-header')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Follower count dynamic display
  const followersCount = useMemo(() => {
    const baseFollowers = ((sellerId * 157) % 15000) + 4200
    const finalCount = isFollowed ? baseFollowers + 1 : baseFollowers
    return finalCount >= 1000 ? `${(finalCount / 1000).toFixed(1)}k` : finalCount.toString()
  }, [sellerId, isFollowed])

  return (
    <div className="space-y-6 py-6 md:py-10">
      {/* 1. Shop Banner & Stats Section */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-linear-to-r from-primary/10 via-background to-background p-6 shadow-xs dark:from-primary/20 dark:via-background dark:to-background">
        {/* Subtle dot pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(var(--primary)_1px,transparent_1px)] opacity-5 bg-size-[16px_16px]" />

        <div className="relative z-10 grid gap-6 md:grid-cols-12 md:items-center">
          {/* Shop Card (Left) */}
          <div className="md:col-span-5 lg:col-span-4 rounded-xl border border-primary/10 bg-primary/5 p-4 dark:bg-zinc-900/40">
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <Avatar className="size-20 border-2 border-primary/25 ring-2 ring-primary/10">
                  <AvatarImage src={seller.avatar ?? undefined} alt={seller.name ?? ''} className="object-cover" />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                    {seller.name?.slice(0, 2).toUpperCase() ?? 'SE'}
                  </AvatarFallback>
                </Avatar>
                {/* Shopee Favorite Badge */}
                <Badge className="absolute -bottom-1 -left-1 bg-red-500 px-1 py-0.5 text-[9px] font-bold hover:bg-red-500">
                  Yêu thích+
                </Badge>
              </div>

              <div className="space-y-1">
                <h1 className="text-xl font-bold tracking-tight line-clamp-1 text-foreground">
                  {seller.name ?? 'Người bán Nest'}
                </h1>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  Đang hoạt động
                </p>
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={handleFollowToggle}
                    variant={isFollowed ? 'secondary' : 'default'}
                    size="sm"
                    className={`h-8 text-xs ${
                      isFollowed
                        ? 'border border-primary/25 text-primary hover:bg-primary/5 bg-transparent'
                        : 'bg-primary text-white hover:bg-primary/90'
                    }`}
                  >
                    {isFollowed ? (
                      <>
                        <CheckCircle2Icon className="size-3.5 mr-1" />
                        Đang Theo Dõi
                      </>
                    ) : (
                      <>
                        <PlusIcon className="size-3.5 mr-1" />
                        Theo Dõi
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => toast.info('Tính năng chat đang được nâng cấp, vui lòng thử lại sau!')}
                    variant="outline"
                    size="sm"
                    className="h-8 border-primary/25 bg-transparent text-primary hover:bg-primary/5 hover:text-primary text-xs"
                  >
                    <MessageCircleIcon className="size-3.5 mr-1" />
                    Chat ngay
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Shop Stats Grid (Right) */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 md:col-span-7 lg:col-span-8 text-foreground md:border-l md:border-primary/10 md:pl-8">
            <div className="flex items-center gap-2.5">
              <StoreIcon className="size-4.5 text-primary shrink-0" />
              <p className="text-sm font-medium text-muted-foreground">
                Sản phẩm: <span className="text-primary">{pagination?.totalRows ?? 12}</span>
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <UsersIcon className="size-4.5 text-primary shrink-0" />
              <p className="text-sm font-medium text-muted-foreground">
                Người theo dõi: <span className="text-primary">{followersCount}</span>
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <MessageCircleIcon className="size-4.5 text-primary shrink-0" />
              <p className="text-sm font-medium text-muted-foreground">
                Tỉ lệ phản hồi chat: <span className="text-primary">98% (Trong vài giờ)</span>
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <StarIcon className="size-4.5 text-primary shrink-0" />
              <p className="text-sm font-medium text-muted-foreground">
                Đánh giá: <span className="text-primary">4.9 / 5.0 (2.4k đánh giá)</span>
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <HeartIcon className="size-4.5 text-primary shrink-0" />
              <p className="text-sm font-medium text-muted-foreground">
                Đang theo dõi: <span className="text-primary">12</span>
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <CalendarIcon className="size-4.5 text-primary shrink-0" />
              <p className="text-sm font-medium text-muted-foreground">
                Tham gia: <span className="text-primary">{getJoinTime(seller.createdAt)}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Custom Shopee Style Tab Bar using Shadcn Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => {
          setActiveTab(val as any)
          if (val === 'all_products') setPage(1)
        }}
        className="w-full"
      >
        <TabsList
          variant="line"
          className="border-b rounded-t-xl shadow-xs w-full justify-start p-0 h-auto gap-6 bg-transparent"
        >
          <TabsTrigger
            value="home"
            className="after:bg-primary data-active:text-primary dark:data-active:text-primary relative px-4 pb-4 pt-2 text-sm font-semibold transition-all duration-200 text-slate-600 dark:text-slate-400 hover:text-primary bg-transparent border-none shadow-none rounded-none data-active:bg-transparent cursor-pointer"
          >
            Cửa Hàng
          </TabsTrigger>
          <TabsTrigger
            value="all_products"
            className="after:bg-primary data-active:text-primary dark:data-active:text-primary relative px-4 pb-4 pt-2 text-sm font-semibold transition-all duration-200 text-slate-600 dark:text-slate-400 hover:text-primary bg-transparent border-none shadow-none rounded-none data-active:bg-transparent cursor-pointer"
          >
            Tất Cả Sản Phẩm
          </TabsTrigger>
          <TabsTrigger
            value="profile"
            className="after:bg-primary data-active:text-primary dark:data-active:text-primary relative px-4 pb-4 pt-2 text-sm font-semibold transition-all duration-200 text-slate-600 dark:text-slate-400 hover:text-primary bg-transparent border-none shadow-none rounded-none data-active:bg-transparent cursor-pointer"
          >
            Hồ Sơ Cửa Hàng
          </TabsTrigger>
        </TabsList>

        {/* 3. Tab Contents */}
        <div className="mt-6">
          {/* ==================== TAB 1: CỬA HÀNG (HOME) ==================== */}
          <TabsContent value="home" className="focus-visible:outline-none focus-visible:ring-0">
            <div className="space-y-8 animate-in fade-in-50 duration-300">
              {/* Voucher Pocket */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200">
                  <PercentIcon className="size-5 text-primary" />
                  Mã Giảm Giá Của Shop
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {MOCK_VOUCHERS.map((voucher) => {
                    const isSaved = savedVouchers.includes(voucher.code)
                    return (
                      <div
                        key={voucher.code}
                        className="group relative flex overflow-hidden rounded-lg border border-red-200 bg-red-50/10 shadow-2xs hover:shadow-sm transition-all duration-200 dark:border-red-950/20 dark:bg-red-950/5"
                      >
                        {/* Ticket left side indicator */}
                        <div className="flex w-16 shrink-0 flex-col items-center justify-center bg-linear-to-br from-red-500 to-rose-600 text-white font-black text-center text-xs p-1 select-none">
                          <span>Nest</span>
                          <span>Ecom</span>
                        </div>

                        {/* Ticket jagged/perforated line divider */}
                        <div className="w-1.5 flex flex-col justify-around bg-red-50/20 py-1 border-l border-dashed border-red-200/50 dark:bg-zinc-900 dark:border-zinc-800" />

                        {/* Ticket content (Right) */}
                        <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
                          <div className="space-y-1">
                            <p className="text-sm font-black text-slate-800 dark:text-slate-200">{voucher.discount}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{voucher.desc}</p>
                          </div>
                          <div className="flex items-center justify-between mt-3 gap-2">
                            <p className="text-[9px] text-slate-400">HSD: {voucher.expiry}</p>
                            <Button
                              size="sm"
                              disabled={isSaved}
                              onClick={() => handleSaveVoucher(voucher.code)}
                              className={`h-6 px-3 text-[10px] font-bold rounded-md shrink-0 ${
                                isSaved
                                  ? 'bg-slate-200 text-slate-500 dark:bg-zinc-800 dark:text-zinc-500'
                                  : 'bg-red-500 text-white hover:bg-red-600'
                              }`}
                            >
                              {isSaved ? 'Đã lưu' : 'Lưu'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Top Sellers Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-200">
                  <TrendingUpIcon className="size-5 text-primary" />
                  Sản Phẩm Bán Chạy
                </h3>

                {topQuery.isLoading ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="aspect-3/4 rounded-xl bg-slate-100 dark:bg-zinc-800 animate-pulse" />
                    ))}
                  </div>
                ) : topProducts.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground border border-dashed rounded-xl">
                    Shop hiện chưa cập nhật sản phẩm nổi bật
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {topProducts.map((p) => (
                      <ProductItem key={p.id} product={p} />
                    ))}
                  </div>
                )}
              </div>

              {/* New Products Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-200">
                  <SparklesIcon className="size-5 text-primary" />
                  Sản Phẩm Mới Nhất
                </h3>

                {newQuery.isLoading ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="aspect-3/4 rounded-xl bg-slate-100 dark:bg-zinc-800 animate-pulse" />
                    ))}
                  </div>
                ) : newProducts.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground border border-dashed rounded-xl">
                    Shop chưa cập nhật sản phẩm mới
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {newProducts.map((p) => (
                      <ProductItem key={p.id} product={p} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* ==================== TAB 2: TẤT CẢ SẢN PHẨM ==================== */}
          <TabsContent value="all_products" className="focus-visible:outline-none focus-visible:ring-0">
            <div className="grid gap-6 md:grid-cols-4 items-start animate-in fade-in-50 duration-300">
              {/* Sidebar filter (Left) */}
              <Card className="md:col-span-1 border-slate-200/50 shadow-2xs dark:border-zinc-800/80">
                <CardContent className="p-4 space-y-5">
                  <h4 className="font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200 border-b pb-3 text-sm">
                    <SlidersHorizontalIcon className="size-4 text-primary" />
                    Danh Mục Cửa Hàng
                  </h4>
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setSelectedCategoryId(undefined)
                        setPage(1)
                      }}
                      className={`w-full flex items-center justify-between text-left text-xs font-semibold px-2.5 py-2 rounded-lg transition-colors ${
                        selectedCategoryId === undefined
                          ? 'bg-primary/10 text-primary dark:bg-primary/20'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <span>Tất cả sản phẩm</span>
                      {selectedCategoryId === undefined && <ChevronRightIcon className="size-3.5" />}
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategoryId(cat.id)
                          setPage(1)
                        }}
                        className={`w-full flex items-center justify-between text-left text-xs font-semibold px-2.5 py-2 rounded-lg transition-colors ${
                          selectedCategoryId === cat.id
                            ? 'bg-primary/10 text-primary dark:bg-primary/20'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
                        }`}
                      >
                        <span className="truncate pr-2">{cat.name}</span>
                        {selectedCategoryId === cat.id && <ChevronRightIcon className="size-3.5" />}
                      </button>
                    ))}
                  </div>

                  {/* Reset filters button */}
                  {(selectedCategoryId !== undefined || searchVal || sortBy !== 'createdAt' || orderBy !== 'desc') && (
                    <Button
                      onClick={() => {
                        setSelectedCategoryId(undefined)
                        setSearchVal('')
                        setSortBy('createdAt')
                        setOrderBy('desc')
                        setPage(1)
                      }}
                      variant="outline"
                      className="w-full text-xs font-bold h-8 flex items-center justify-center gap-1.5 border-primary/30 text-primary hover:bg-primary/5"
                    >
                      <RotateCcwIcon className="size-3.5" />
                      Đặt lại bộ lọc
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Product display list (Right) */}
              <div className="md:col-span-3 space-y-5">
                {/* Filter controls toolbar */}
                <div
                  id="shop-products-header"
                  className="bg-card p-3 rounded-xl border border-slate-200/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 dark:border-zinc-800/80 shadow-2xs"
                >
                  {/* Sort buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-muted-foreground mr-1">Sắp xếp theo:</span>
                    <Button
                      onClick={() => {
                        setSortBy('createdAt')
                        setOrderBy('desc')
                        setPage(1)
                      }}
                      size="sm"
                      variant={sortBy === 'createdAt' && orderBy === 'desc' ? 'default' : 'secondary'}
                      className={`text-xs font-bold h-8 px-4 ${
                        sortBy === 'createdAt' && orderBy === 'desc'
                          ? 'bg-primary text-white hover:bg-primary/90'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-zinc-800 dark:text-slate-300'
                      }`}
                    >
                      Mới nhất
                    </Button>
                    <Button
                      onClick={() => {
                        setSortBy('name')
                        setOrderBy('asc')
                        setPage(1)
                      }}
                      size="sm"
                      variant={sortBy === 'name' ? 'default' : 'secondary'}
                      className={`text-xs font-bold h-8 px-4 ${
                        sortBy === 'name'
                          ? 'bg-primary text-white hover:bg-primary/90'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-zinc-800 dark:text-slate-300'
                      }`}
                    >
                      Phổ biến
                    </Button>

                    {/* Price sort custom trigger */}
                    <div className="relative">
                      <select
                        value={`${sortBy}-${orderBy}`}
                        onChange={(e) => {
                          const [s, o] = e.target.value.split('-') as [any, any]
                          setSortBy(s)
                          setOrderBy(o)
                          setPage(1)
                        }}
                        className="text-xs font-bold h-8 px-3.5 pr-8 rounded-md bg-slate-100 dark:bg-zinc-800 border-none outline-none text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer appearance-none"
                      >
                        <option value="createdAt-desc">Giá: Sắp xếp</option>
                        <option value="basePrice-asc">Giá: Thấp đến Cao</option>
                        <option value="basePrice-desc">Giá: Cao đến Thấp</option>
                      </select>
                      <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500">
                        <ChevronRightIcon className="size-3.5 rotate-90" />
                      </div>
                    </div>
                  </div>

                  {/* Shop specific search input */}
                  <div className="relative max-w-xs w-full sm:w-64">
                    <Input
                      placeholder="Tìm trong shop này..."
                      className="pr-10 h-8 text-xs font-semibold border-slate-200 dark:border-zinc-800/80 bg-background"
                      value={searchVal}
                      onChange={(e) => setSearchVal(e.target.value)}
                    />
                    <div className="absolute right-0 top-0 h-8 w-9 flex items-center justify-center bg-primary rounded-r-md text-white select-none">
                      <SearchIcon className="size-3.5" />
                    </div>
                  </div>
                </div>

                {/* Products list grid */}
                {getProductsListQuery.isLoading ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="aspect-3/4 rounded-xl bg-slate-100 dark:bg-zinc-800 animate-pulse" />
                    ))}
                  </div>
                ) : allProducts.length === 0 ? (
                  <div className="text-center py-20 bg-card rounded-2xl border border-slate-200/50 dark:border-zinc-800/80 space-y-4">
                    <Grid2X2Icon className="size-12 mx-auto text-slate-300 dark:text-slate-700" />
                    <div className="space-y-1.5">
                      <p className="font-bold text-slate-800 dark:text-slate-200">Không tìm thấy sản phẩm nào</p>
                      <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                        Thử tìm kiếm với từ khóa khác hoặc đặt lại bộ lọc để tìm sản phẩm mong muốn.
                      </p>
                    </div>
                    {searchVal && (
                      <Button
                        size="sm"
                        onClick={() => {
                          setSearchVal('')
                        }}
                        className="bg-primary text-white hover:bg-primary/90 font-bold text-xs"
                      >
                        Xóa tìm kiếm
                      </Button>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {allProducts.map((p) => (
                        <ProductItem key={p.id} product={p} />
                      ))}
                    </div>

                    {/* Pagination component */}
                    {pagination && pagination.totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2.5 pt-8 select-none">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handlePageChange(page - 1)}
                          disabled={page === 1}
                          className="size-8 rounded-lg"
                        >
                          <ChevronLeftIcon className="size-4" />
                        </Button>

                        {Array.from({ length: pagination.totalPages }).map((_, idx) => {
                          const pageNum = idx + 1
                          return (
                            <Button
                              key={pageNum}
                              size="sm"
                              variant={page === pageNum ? 'default' : 'outline'}
                              onClick={() => handlePageChange(pageNum)}
                              className={`size-8 rounded-lg font-bold text-xs ${
                                page === pageNum
                                  ? 'bg-primary text-white hover:bg-primary/90'
                                  : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-zinc-800'
                              }`}
                            >
                              {pageNum}
                            </Button>
                          )
                        })}

                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handlePageChange(page + 1)}
                          disabled={page === pagination.totalPages}
                          className="size-8 rounded-lg"
                        >
                          <ChevronRightIcon className="size-4" />
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </TabsContent>

          {/* ==================== TAB 3: HỒ SƠ SHOP (PROFILE) ==================== */}
          <TabsContent value="profile" className="focus-visible:outline-none focus-visible:ring-0">
            <div className="space-y-6 animate-in fade-in-50 duration-300">
              <div className="grid gap-6 md:grid-cols-3">
                {/* Detailed Description */}
                <Card className="md:col-span-2 border-slate-200/50 dark:border-zinc-800/80 shadow-2xs">
                  <CardContent className="p-5 space-y-4">
                    <h3 className="font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200 text-sm">
                      <InfoIcon className="size-4.5 text-primary" />
                      Giới Thiệu Người Bán
                    </h3>
                    <div className="text-sm text-slate-600 dark:text-slate-400 space-y-3 leading-relaxed">
                      <p>
                        Chào mừng bạn đến với <strong>{seller.name || 'Người bán Nest'}</strong> - Không gian mua sắm
                        trực tuyến tin cậy với hàng ngàn sản phẩm đa dạng và chất lượng hàng đầu.
                      </p>
                      <p>
                        Chúng tôi luôn cam kết cung cấp các mặt hàng chính hãng chất lượng cao, có nguồn gốc xuất xứ rõ
                        ràng. Hỗ trợ khách hàng chu đáo và nhiệt tình trước, trong và sau khi mua sắm là tiêu chí cốt
                        lõi của chúng tôi.
                      </p>
                      <p>
                        Hãy nhấn nút <strong>Theo Dõi</strong> người bán ngay hôm nay để nhận thông báo sớm nhất về các
                        mã giảm giá độc quyền và những đợt Sale sốc hàng tuần nhé!
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Info Card */}
                <Card className="md:col-span-1 border-slate-200/50 dark:border-zinc-800/80 shadow-2xs">
                  <CardContent className="p-5 space-y-4">
                    <h3 className="font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200 text-sm">
                      <StoreIcon className="size-4.5 text-primary" />
                      Thông Tin Liên Hệ
                    </h3>
                    <div className="space-y-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-3">
                        <CalendarIcon className="size-4 text-slate-400 shrink-0" />
                        <span>Tham gia từ: {new Date(seller.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Shop policy grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <Card className="border-slate-200/50 dark:border-zinc-800/80 shadow-2xs bg-slate-50/30 dark:bg-zinc-900/10">
                  <CardContent className="p-5 flex gap-4 items-start">
                    <div className="p-2.5 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary shrink-0">
                      <ShieldCheckIcon className="size-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Cam Kết Chính Hãng 100%</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Sản phẩm được nhập trực tiếp từ thương hiệu hoặc nhà phân phối ủy quyền. Hoàn tiền gấp đôi nếu
                        phát hiện hàng giả.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200/50 dark:border-zinc-800/80 shadow-2xs bg-slate-50/30 dark:bg-zinc-900/10">
                  <CardContent className="p-5 flex gap-4 items-start">
                    <div className="p-2.5 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary shrink-0">
                      <RotateCcwIcon className="size-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Đổi Trả Dễ Dàng</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Chính sách trả hàng, hoàn tiền miễn phí trong vòng 15 ngày kể từ khi nhận hàng nếu có lỗi của
                        nhà sản xuất.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200/50 dark:border-zinc-800/80 shadow-2xs bg-slate-50/30 dark:bg-zinc-900/10">
                  <CardContent className="p-5 flex gap-4 items-start">
                    <div className="p-2.5 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary shrink-0">
                      <ClockIcon className="size-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Giao Hàng Siêu Tốc</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Đơn hàng được chuẩn bị và bàn giao cho đơn vị vận chuyển sớm nhất có thể. Đảm bảo giao hàng
                        nhanh chóng toàn quốc.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
