'use client'

import { LayersIcon, SearchIcon, ShieldCheckIcon, StarIcon, StoreIcon, TruckIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

import QuantityController from '@/app/(shop)/_components/quantity-controller'
import ImageZoomDialog from './image-zoom-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
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

  // Danh sách ảnh hiển thị (Gộp ảnh của SKU được chọn vào đầu danh sách, sau đó là ảnh mặc định, loại bỏ trùng lặp)
  const displayImages = React.useMemo(() => {
    const skuImages = selectedSku && selectedSku.images ? selectedSku.images : []
    return Array.from(new Set([...skuImages, ...defaultImages]))
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
                      <SearchIcon size={16} />
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
      <ImageZoomDialog
        images={displayImages}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialIndex={dialogImageIndex}
        alt={product.name}
      />
    </div>
  )
}
