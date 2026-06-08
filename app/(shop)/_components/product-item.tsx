'use client'

import Image from 'next/image'
import Link from 'next/link'

import PATH from '@/constants/path'
import { formatCurrency } from '@/lib/utils'
import { ProductIncludeTranslationsType } from '@/schemas/product.schema'

type ProductItemProps = {
  product: ProductIncludeTranslationsType
}

export default function ProductItem({ product }: ProductItemProps) {
  const hasDiscount = product.virtualPrice > product.basePrice
  const discountPercent = hasDiscount
    ? Math.round(((product.virtualPrice - product.basePrice) / product.virtualPrice) * 100)
    : 0

  // Kiểm tra sản phẩm mới (tạo trong vòng 7 ngày gần nhất)
  // eslint-disable-next-line react-hooks/purity
  const isNew = Date.now() - new Date(product.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000

  // Số lượng bán ngẫu nhiên/cố định dựa trên ID sản phẩm để hiển thị chân thực
  const sold = 50 + ((product.id * 17) % 950)
  const formattedSold = sold >= 1000 ? `${(sold / 1000).toFixed(1)}k+ đã bán` : `${sold} đã bán`

  const productUrl = PATH.PRODUCT_DETAIL(product.name, product.id)

  return (
    <div className="group relative h-full overflow-hidden rounded-xl border border-slate-200/50 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-[#ee4d2d]/30 hover:shadow-md dark:border-slate-800/80 dark:hover:border-[#ee4d2d]/30">
      <Link href={productUrl} className="flex flex-col h-full justify-between">
        <div>
          {/* Thumbnail Wrapper - Full width to the edges */}
          <div className="relative aspect-square w-full overflow-hidden bg-muted/20">
            {/* Top-Left "New" Badge */}
            {isNew && (
              <div className="absolute top-0 left-0 z-10 bg-[#00b08f] text-white font-bold text-[9px] px-1.5 py-0.5 rounded-br-md select-none">
                MỚI
              </div>
            )}

            {/* Top-Right Discount Badge */}
            {hasDiscount && (
              <div className="absolute top-0 right-0 z-10 bg-[#feeee8] text-[#ee4d2d] font-bold text-[11px] px-1.5 py-0.5 rounded-bl-md select-none border-b border-l border-[#ee4d2d]/10">
                -{discountPercent}%
              </div>
            )}

            {product.thumbnail ? (
              <Image src={product.thumbnail} alt={product.name} fill className="object-cover" unoptimized />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground bg-muted/10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Không có ảnh</span>
              </div>
            )}

            {/* Bottom Play Button Overlay (representing product video) */}
            <div className="absolute bottom-8 right-2.5 z-10 flex size-5.5 items-center justify-center rounded-full bg-black/50 text-white shadow-xs backdrop-blur-3xs transition-transform duration-200 group-hover:scale-105">
              <svg viewBox="0 0 24 24" className="size-3 fill-current pl-px">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>

            {/* Bottom Absolute Promo Banner */}
            <div className="absolute bottom-0 left-0 right-0 h-6 flex overflow-hidden text-[9px] font-black select-none z-10">
              <div className="flex-1 bg-linear-to-r from-[#ff3c14] via-[#ff4820] to-[#ff5d11] flex items-center justify-center text-white px-1 leading-none tracking-wide text-center">
                6.6 SIÊU SALE
              </div>
              <div className="bg-[#ffbe00] flex items-center justify-center text-[#ee4d2d] px-1.5 font-black border-l border-r border-[#ffbe00]/25 leading-none">
                VOUCHER XTRA
              </div>
              <div className="bg-[#00b08f] flex items-center justify-center text-white px-2 leading-none font-bold">
                SHOPEE HOME
              </div>
            </div>
          </div>

          {/* Product Info Section */}
          <div className="p-2.5 space-y-2">
            {/* Title with Inline Favorite Badge */}
            <h3 className="line-clamp-2 text-sm leading-tight text-slate-800 dark:text-slate-200 min-h-9 font-medium">
              <span className="bg-orange-500 text-white font-bold text-[9px] px-1 py-0.5 rounded-[2px] mr-1 select-none inline-block align-middle leading-none">
                Yêu thích
              </span>
              <span className="align-middle">{product.name}</span>
            </h3>

            {/* Tag Chips Row */}
            <div className="flex flex-wrap gap-1">
              <span className="border border-[#ee4d2d]/30 text-[#ee4d2d] text-[9px] font-medium px-1 py-0.5 rounded-[2px] leading-none bg-[#ee4d2d]/2">
                Rẻ Vô Địch
              </span>
              <span className="border border-[#f6a700]/30 text-[#f6a700] text-[9px] font-medium px-1 py-0.5 rounded-[2px] leading-none bg-[#f6a700]/2">
                #ShopThinhHanh
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Section: Price & Sold Count */}
        <div className="p-2.5 pt-0 flex items-end justify-between mt-1">
          {/* Price Container */}
          <div className="flex flex-col gap-1">
            <span className="text-base font-semibold text-orange-500 leading-none">
              {formatCurrency(product.basePrice)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through leading-none">
                {formatCurrency(product.virtualPrice)}
              </span>
            )}
          </div>

          {/* Sold counter */}
          <span className="text-[11px] text-muted-foreground">{formattedSold}</span>
        </div>
      </Link>
    </div>
  )
}
