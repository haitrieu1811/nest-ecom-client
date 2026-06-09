import {
  ChevronRightIcon,
  Clock3Icon,
  MessageCircleIcon,
  ShieldCheckIcon,
  StarIcon,
  StoreIcon,
  UsersIcon,
} from 'lucide-react'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { productApi } from '@/apis/product.api'
import ProductDescription from '@/app/(shop)/products/[nameId]/product-description'
import ProductDetail from '@/app/(shop)/products/[nameId]/product-detail'
import ProductReviews from '@/app/(shop)/products/[nameId]/product-reviews'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import PATH from '@/constants/path'
import { extractIdFromNameId, formatCurrency } from '@/lib/utils'
import { ProductDetailType } from '@/schemas/product.schema'

const RELATED_POSTS = [
  {
    id: 1,
    title: '5 tiêu chí chọn tai nghe bluetooth phù hợp nhu cầu',
    excerpt: 'Hướng dẫn chọn tai nghe theo mục đích nghe nhạc, chơi game và làm việc online.',
    date: '30/05/2026',
    readTime: '6 phút đọc',
  },
  {
    id: 2,
    title: 'Cách bảo quản pin tai nghe để sử dụng bền hơn',
    excerpt: 'Những mẹo đơn giản giúp kéo dài tuổi thọ pin và đảm bảo chất lượng âm thanh ổn định.',
    date: '28/05/2026',
    readTime: '4 phút đọc',
  },
  {
    id: 3,
    title: 'So sánh ANC và ENC: công nghệ nào phù hợp với bạn?',
    excerpt: 'Phân biệt nhanh hai công nghệ chống ồn phổ biến trên các mẫu tai nghe hiện đại.',
    date: '24/05/2026',
    readTime: '7 phút đọc',
  },
] as const

type ProductDetailPageProps = {
  params: Promise<{
    nameId: string
  }>
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { nameId } = await params
  const id = extractIdFromNameId(nameId)
  if (!id) {
    return {
      title: 'Sản phẩm không tìm thấy',
      description: 'Sản phẩm không tồn tại trên hệ thống',
    }
  }

  try {
    const res = await productApi.getDetail(String(id))
    const product = res.payload
    const plainDescription = product.description.replace(/<[^>]*>/g, '').slice(0, 160)
    return {
      title: `${product.name} | Nest E-Commerce`,
      description: plainDescription || 'Xem chi tiết sản phẩm và các ưu đãi tại Nest E-Commerce',
      openGraph: {
        title: product.name,
        description: plainDescription,
        images: product.thumbnail ? [product.thumbnail] : [],
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Sản phẩm | Nest E-Commerce',
      description: 'Xem chi tiết sản phẩm tại Nest E-Commerce',
    }
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { nameId } = await params
  const id = extractIdFromNameId(nameId)
  if (!id) {
    notFound()
  }

  let product: ProductDetailType | null = null
  let relatedProducts = []

  try {
    const res = await productApi.getDetail(String(id))
    product = res.payload

    // Fetch related products (e.g. products in same category or just list of products)
    const categoryId = product.categoryId
    const relatedRes = await productApi.getList({
      page: 1,
      limit: 10,
    })
    // Filter out the current product from recommendations if possible, or just take the first 4
    relatedProducts = relatedRes.payload.data
      .filter((p) => p.id !== product?.id && p.categoryId === categoryId)
      .slice(0, 4)
    if (relatedProducts.length === 0) {
      // Fallback: fetch general list of products
      relatedProducts = relatedRes.payload.data.filter((p) => p.id !== product?.id).slice(0, 4)
    }
  } catch (error) {
    console.error('Error fetching product details:', error)
    notFound()
  }

  if (!product) {
    notFound()
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 py-4">
      {/* Breadcrumbs */}
      <div className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        <Link href={PATH.HOME} className="transition-colors hover:text-foreground">
          Trang chủ
        </Link>
        <ChevronRightIcon className="size-4" />
        {product.category ? (
          <>
            <Link
              href={PATH.CATEGORY_DETAIL(product.category.name, product.category.id)}
              className="transition-colors hover:text-foreground"
            >
              {product.category.name}
            </Link>
            <ChevronRightIcon className="size-4" />
          </>
        ) : (
          <>
            <Link href={PATH.CATEGORIES} className="transition-colors hover:text-foreground">
              Danh mục
            </Link>
            <ChevronRightIcon className="size-4" />
          </>
        )}
        <span className="text-foreground font-medium">{product.name}</span>
      </div>

      {/* Main product gallery and details block (including SKU selection) */}
      <ProductDetail product={product} />

      {/* Shop Info Card */}
      <Card className="border-primary/20 bg-linear-to-r from-primary/10 via-background to-background">
        <CardContent className="grid gap-4 py-5 md:grid-cols-[1fr_auto] md:items-center">
          <div className="flex flex-wrap items-start gap-3">
            <Avatar className="size-14 ring-2 ring-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary">NS</AvatarFallback>
            </Avatar>

            <div className="space-y-2">
              <div>
                <p className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                  <StoreIcon className="size-4 text-primary" />
                  Shop bán sản phẩm
                </p>
                <p className="text-lg font-semibold text-foreground">Nest Official Store</p>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="outline" className="gap-1 border-emerald-400/40 bg-emerald-500/10 text-emerald-700">
                  <ShieldCheckIcon className="size-3.5" />
                  Shop Mall uy tín
                </Badge>
                <span className="inline-flex items-center gap-1 rounded-md border px-2 py-1">
                  <StarIcon className="size-3.5 fill-amber-400 text-amber-500" />
                  4.9/5 đánh giá shop
                </span>
                <span className="inline-flex items-center gap-1 rounded-md border px-2 py-1">
                  <UsersIcon className="size-3.5 text-primary" />
                  32.4k người theo dõi
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:justify-end">
            <Button variant="outline" className="min-w-32">
              <MessageCircleIcon className="size-4" />
              Chat với shop
            </Button>
            <Button className="min-w-32">Xem shop</Button>
          </div>
        </CardContent>
      </Card>

      {/* Product Description & Reviews & Related items */}
      <div className="grid gap-6 items-start xl:grid-cols-12">
        {/* Description */}
        <Card className="xl:col-span-12">
          <CardHeader>
            <CardTitle className="text-xl">Mô tả sản phẩm</CardTitle>
            <CardDescription>
              Thông tin nổi bật và lý do sản phẩm phù hợp với nhu cầu sử dụng hàng ngày.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <ProductDescription description={product.description} />
          </CardContent>
        </Card>

        {/* Reviews */}
        <div className="xl:col-span-12">
          <ProductReviews />
        </div>

        {/* Related Products */}
        <Card className="xl:col-span-8">
          <CardHeader>
            <CardTitle>Sản phẩm cùng danh mục</CardTitle>
            <CardDescription>Gợi ý thêm các sản phẩm liên quan bạn có thể quan tâm.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {relatedProducts.map((p) => {
                const discount =
                  p.virtualPrice > p.basePrice ? Math.round(((p.virtualPrice - p.basePrice) / p.virtualPrice) * 100) : 0
                return (
                  <Link
                    key={p.id}
                    href={PATH.PRODUCT_DETAIL(p.name, p.id)}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border bg-background p-3 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-xl border bg-muted/10">
                      {p.thumbnail ? (
                        <Image
                          src={p.thumbnail}
                          alt={p.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                          Không có ảnh
                        </div>
                      )}
                      {discount > 0 && (
                        <Badge className="absolute top-2 right-2 bg-red-500 text-white hover:bg-red-500 text-[10px] font-bold">
                          -{discount}%
                        </Badge>
                      )}
                    </div>
                    <p className="mt-2.5 line-clamp-2 text-sm font-medium text-slate-800 dark:text-slate-200 min-h-10">
                      {p.name}
                    </p>
                    <div className="mt-2 flex flex-col gap-0.5">
                      <p className="text-sm font-bold text-red-600 dark:text-red-500">{formatCurrency(p.basePrice)}</p>
                      {p.virtualPrice > p.basePrice && (
                        <p className="text-xs text-muted-foreground line-through">{formatCurrency(p.virtualPrice)}</p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Related Posts */}
        <Card className="xl:col-span-4">
          <CardHeader>
            <CardTitle>Bài viết liên quan</CardTitle>
            <CardDescription>Kiến thức và mẹo sử dụng giúp bạn chọn mua hiệu quả hơn.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {RELATED_POSTS.map((post) => (
                <article key={post.id} className="rounded-lg border p-4 transition-colors hover:border-primary/40">
                  <p className="text-base font-semibold leading-6">{post.title}</p>
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Clock3Icon className="size-3.5" />
                      {post.readTime}
                    </span>
                    <span>{post.date}</span>
                  </div>
                </article>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
