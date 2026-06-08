'use client'

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  LayersIcon,
  ShieldCheckIcon,
  StarIcon,
  StoreIcon,
  TruckIcon,
} from 'lucide-react'
import Image from 'next/image'
import React from 'react'

import QuantityController from '@/app/(shop)/_components/quantity-controller'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { cn, formatCurrency } from '@/lib/utils'
import { ProductDetailType, SKUType } from '@/schemas/product.schema'

type ProductDetailProps = {
  product: ProductDetailType
}

export default function ProductDetail({ product }: ProductDetailProps) {
  // Bộ sưu tập ảnh mặc định của sản phẩm (ảnh đại diện + ảnh phụ)
  const defaultImages = React.useMemo(() => {
    return [product.thumbnail, ...product.images].filter((img): img is string => !!img)
  }, [product])

  // Chọn SKU đầu tiên làm mặc định nếu có
  const [selectedSku, setSelectedSku] = React.useState<SKUType | null>(() => {
    return product.skus.length > 0 ? product.skus[0] : null
  })

  // Danh sách ảnh hiển thị (Ưu tiên ảnh của SKU được chọn, nếu không có ảnh SKU thì dùng ảnh sản phẩm)
  const displayImages = React.useMemo(() => {
    if (selectedSku && selectedSku.images && selectedSku.images.length > 0) {
      return selectedSku.images
    }
    return defaultImages
  }, [selectedSku, defaultImages])

  // Ảnh đang được chọn hiển thị lớn
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null)

  // Cập nhật ảnh hiển thị lớn khi danh sách ảnh thay đổi
  React.useEffect(() => {
    if (displayImages.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedImage(displayImages[0])
    } else {
      setSelectedImage(null)
    }
  }, [displayImages])

  // Giá hiển thị hiện tại (Ưu tiên giá SKU)
  const currentPrice = selectedSku ? selectedSku.price : product.basePrice
  const hasDiscount = product.virtualPrice > currentPrice
  const discountPercent = hasDiscount
    ? Math.round(((product.virtualPrice - currentPrice) / product.virtualPrice) * 100)
    : 0

  const [quantity, setQuantity] = React.useState(1)
  const currentStock = selectedSku ? selectedSku.stock : 100

  // Trạng thái Dialog xem ảnh phóng to
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [dialogImageIndex, setDialogImageIndex] = React.useState(0)

  return (
    <div className="grid gap-6 xl:grid-cols-12">
      {/* Cột trái: Bộ sưu tập hình ảnh */}
      <Card className="gap-0 py-0 xl:order-1 xl:col-span-5 xl:self-start">
        <CardContent className="p-0">
          <div className="grid gap-3 p-3">
            {/* Ảnh lớn (Clickable to open dialog) */}
            <button
              type="button"
              onClick={() => {
                const currentIdx = displayImages.indexOf(selectedImage || '')
                setDialogImageIndex(currentIdx >= 0 ? currentIdx : 0)
                setIsDialogOpen(true)
              }}
              className="relative w-full aspect-4/3 overflow-hidden rounded-xl border bg-muted/20 text-left hover:cursor-zoom-in group outline-hidden"
            >
              {selectedImage ? (
                <>
                  <Image
                    src={selectedImage}
                    alt={product.name}
                    fill
                    className="object-cover transition-all duration-300 group-hover:scale-[1.02]"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="bg-black/60 px-3 py-1.5 rounded-full text-xs font-semibold text-white flex items-center gap-1.5 backdrop-blur-xs shadow-xs">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
                      Click để phóng to
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                  Không có ảnh sản phẩm
                </div>
              )}
            </button>

            {/* Danh sách ảnh thu nhỏ dưới dạng Carousel / Căn đều */}
            {displayImages.length > 0 && (
              <div className="relative">
                {displayImages.length <= 5 ? (
                  <div className="flex justify-center gap-1.5">
                    {displayImages.map((img, index) => {
                      const isActive = selectedImage === img
                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setSelectedImage(img)}
                          className={cn(
                            'relative flex-1 aspect-4/3 overflow-hidden rounded-md border bg-muted/10 transition-all outline-hidden max-w-[20%]',
                            isActive
                              ? 'border-primary ring-2 ring-primary/15 scale-95'
                              : 'border-border hover:border-primary/50',
                          )}
                        >
                          <Image src={img} alt={`thumbnail-${index + 1}`} fill className="object-cover" unoptimized />
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <Carousel opts={{ align: 'start', dragFree: true }} className="w-full">
                    <CarouselContent className="-ml-1.5">
                      {displayImages.map((img, index) => {
                        const isActive = selectedImage === img
                        return (
                          <CarouselItem key={index} className="basis-1/5 pl-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedImage(img)}
                              className={cn(
                                'relative w-full aspect-4/3 overflow-hidden rounded-md border bg-muted/10 transition-all outline-hidden',
                                isActive
                                  ? 'border-primary ring-2 ring-primary/15 scale-95'
                                  : 'border-border hover:border-primary/50',
                              )}
                            >
                              <Image
                                src={img}
                                alt={`thumbnail-${index + 1}`}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </button>
                          </CarouselItem>
                        )
                      })}
                    </CarouselContent>
                    <CarouselPrevious className="absolute -left-1 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-xs" />
                    <CarouselNext className="absolute -right-1 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-xs" />
                  </Carousel>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Cột phải: Thông tin chi tiết & Chọn SKU */}
      <Card className="xl:order-2 xl:col-span-7">
        <CardContent className="space-y-5 p-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-red-500 text-white hover:bg-red-500">Flash Sale</Badge>
              <Badge variant="outline">Chính hãng</Badge>
              <Badge variant="outline">Đổi trả 7 ngày</Badge>
            </div>
            <h1 className="text-2xl font-bold leading-tight text-slate-800 dark:text-slate-200">{product.name}</h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <StarIcon className="size-3.5 fill-amber-400 text-amber-500" />
                4.8/5 (128 đánh giá)
              </span>
              <span>•</span>
              <span>Đã bán 1.2k</span>
              <span>•</span>
              <span>Mã SP: NEST-PRO-{product.id}</span>
            </div>
          </div>

          {/* Khung Giá hiển thị */}
          <div className="rounded-xl border bg-muted/20 p-4">
            <div className="flex flex-wrap items-baseline gap-2">
              <p className="text-3xl font-extrabold text-red-600 dark:text-red-500">{formatCurrency(currentPrice)}</p>
              {hasDiscount && (
                <>
                  <p className="text-sm text-muted-foreground line-through font-semibold">
                    {formatCurrency(product.virtualPrice)}
                  </p>
                  <Badge className="bg-red-500 text-white hover:bg-red-500 font-bold text-[10px] px-1.5 py-0.5 border-0">
                    -{discountPercent}%
                  </Badge>
                </>
              )}
            </div>
          </div>

          <div className="grid gap-2 text-sm text-muted-foreground">
            <p className="inline-flex items-center gap-2">
              <StoreIcon className="size-4 text-primary" />
              Bán bởi: <span className="font-semibold text-slate-700 dark:text-slate-300">Nest Official Store</span>
            </p>
            <p className="inline-flex items-center gap-2">
              <TruckIcon className="size-4 text-primary" />
              Freeship extra • Nhận hàng trong hôm nay
            </p>
            <p className="inline-flex items-center gap-2">
              <ShieldCheckIcon className="size-4 text-primary" />
              Bảo hành chính hãng 12 tháng
            </p>
          </div>

          <Separator />

          {/* Chọn SKU (Các phiên bản sản phẩm) */}
          {product.skus.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-semibold flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                <LayersIcon className="size-4 text-slate-500" />
                Chọn Phiên Bản
              </p>
              <div className="flex flex-wrap gap-2.5">
                {product.skus.map((sku) => {
                  const isActive = selectedSku?.id === sku.id
                  const skuAvatar = sku.images?.[0] || product.thumbnail

                  return (
                    <button
                      key={sku.id}
                      type="button"
                      onClick={() => setSelectedSku(sku)}
                      className={cn(
                        'flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-all duration-200 select-none outline-hidden text-foreground',
                        isActive
                          ? 'border-primary bg-primary/10 ring-2 ring-primary/10'
                          : 'border-border bg-card hover:border-primary/50',
                      )}
                    >
                      {skuAvatar && (
                        <div className="relative size-6 overflow-hidden rounded-md border bg-muted/20">
                          <Image src={skuAvatar} alt={sku.value} fill className="object-cover" unoptimized />
                        </div>
                      )}
                      <span>{sku.value}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Số lượng */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Số lượng</p>
            <div className="flex items-center gap-2">
              <QuantityController value={quantity} onChange={setQuantity} max={currentStock} size="lg" />
              <p className="text-sm text-muted-foreground">Còn {currentStock} sản phẩm</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <Button size="lg" className="min-w-36 font-semibold">
              Mua ngay
            </Button>
            <Button size="lg" variant="outline" className="min-w-36 font-semibold">
              Thêm vào giỏ
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dialog phóng to hình ảnh */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[95vw] w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-7xl h-[90vh] border-none bg-popover p-6 text-popover flex flex-col sm:rounded-2xl outline-hidden">
          <DialogTitle className="sr-only">Xem ảnh sản phẩm</DialogTitle>
          <DialogDescription className="sr-only">Xem ảnh sản phẩms</DialogDescription>
          {/* Ảnh lớn phóng to */}
          <div className="relative w-full flex-1 min-h-0 flex items-center justify-center">
            {displayImages[dialogImageIndex] ? (
              <Image
                src={displayImages[dialogImageIndex]}
                alt={`${product.name} - ${dialogImageIndex + 1}`}
                fill
                className="object-contain select-none rounded-lg"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                Không có ảnh
              </div>
            )}

            {/* Nút Previous / Next */}
            {displayImages.length > 1 && (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  type="button"
                  className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-white/10 hover:bg-white/20 text-white hover:text-white outline-hidden cursor-pointer size-12"
                  onClick={(e) => {
                    e.stopPropagation()
                    setDialogImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length)
                  }}
                >
                  <ChevronLeftIcon className="size-8" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  type="button"
                  className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-white/10 hover:bg-white/20 text-white hover:text-white outline-hidden cursor-pointer size-12"
                  onClick={(e) => {
                    e.stopPropagation()
                    setDialogImageIndex((prev) => (prev + 1) % displayImages.length)
                  }}
                >
                  <ChevronRightIcon className="size-8" />
                </Button>
              </>
            )}
          </div>

          {/* Danh sách ảnh thu nhỏ chuyển nhanh trong Dialog */}
          {displayImages.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-2 max-w-full overflow-x-auto py-1 shrink-0">
              {displayImages.map((img, idx) => {
                const isActive = dialogImageIndex === idx
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setDialogImageIndex(idx)}
                    className={cn(
                      'relative size-14 overflow-hidden rounded-md border-2 bg-muted/10 transition-all outline-hidden cursor-pointer',
                      isActive ? 'border-primary scale-105' : 'border-transparent opacity-60 hover:opacity-100',
                    )}
                  >
                    <Image src={img} alt={`dialog-thumbnail-${idx + 1}`} fill className="object-cover" unoptimized />
                  </button>
                )
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
