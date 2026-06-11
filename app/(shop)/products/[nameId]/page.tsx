import {
  BookOpenIcon,
  ChevronRightIcon,
  Clock3Icon,
  LayersIcon,
  MessageCircleIcon,
  ShieldCheckIcon,
  StarIcon,
  StoreIcon,
  UsersIcon,
} from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { productApi } from '@/apis/product.api'
import ProductItem from '@/app/(shop)/_components/product-item'
import ProductDescription from '@/app/(shop)/products/[nameId]/product-description'
import ProductDetail from '@/app/(shop)/products/[nameId]/product-detail'
import ProductReviews from '@/app/(shop)/products/[nameId]/product-reviews'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import PATH from '@/constants/path'
import { extractIdFromNameId } from '@/lib/utils'
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
              <AvatarImage src={product.createdBy.avatar ?? undefined} alt={product.createdBy.name ?? ''} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {product.createdBy.name?.slice(0, 2).toUpperCase() ?? 'UN'}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-2">
              <div>
                <p className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                  <StoreIcon className="size-4 text-primary" />
                  Shop bán sản phẩm
                </p>
                <p className="text-lg font-semibold text-foreground">{product.createdBy.name ?? ''}</p>
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
            <Button asChild className="min-w-32">
              <Link href={PATH.SELLER_DETAIL(product.createdBy.name ?? '', product.createdBy.id)}>
                <StoreIcon className="size-4" />
                Xem shop
              </Link>
            </Button>
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
        <Card className="xl:col-span-8 overflow-visible">
          <CardHeader className="flex flex-row items-center justify-between gap-4 pb-5">
            <div className="space-y-1">
              <CardTitle className="text-lg sm:text-xl font-medium flex items-center gap-2 text-slate-800 dark:text-slate-100">
                <LayersIcon className="size-5 text-primary shrink-0" />
                Sản phẩm cùng danh mục
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm font-normal text-slate-500 dark:text-slate-400">
                Gợi ý thêm các sản phẩm liên quan bạn có thể quan tâm.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {relatedProducts.map((p) => (
                <ProductItem key={p.id} product={p} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Related Posts */}
        <Card className="xl:col-span-4 overflow-visible">
          <CardHeader className="flex flex-row items-center justify-between gap-4 pb-5">
            <div className="space-y-1">
              <CardTitle className="text-lg sm:text-xl font-medium flex items-center gap-2 text-slate-800 dark:text-slate-100">
                <BookOpenIcon className="size-5 text-primary shrink-0" />
                Bài viết liên quan
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm font-normal text-slate-500 dark:text-slate-400">
                Kiến thức và mẹo sử dụng hiệu quả hơn.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {RELATED_POSTS.map((post) => (
                <Link
                  key={post.id}
                  href={PATH.HOME}
                  className="group block p-4 rounded-xl border border-slate-200/50 dark:border-zinc-800/80 bg-linear-to-b from-white/70 to-slate-50/50 dark:from-zinc-900/40 dark:to-zinc-950/20 shadow-2xs hover:shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30"
                >
                  <h4 className="line-clamp-2 text-sm font-medium leading-snug text-slate-800 dark:text-zinc-100 group-hover:text-primary transition-colors duration-200">
                    {post.title}
                  </h4>
                  <p className="mt-1.5 line-clamp-2 text-xs text-slate-500 dark:text-zinc-400 font-normal leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="mt-3.5 pt-2 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-slate-400 dark:text-zinc-500 font-normal">
                    <span className="inline-flex items-center gap-1">
                      <Clock3Icon className="size-3.5" />
                      {post.readTime}
                    </span>
                    <span>{post.date}</span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
