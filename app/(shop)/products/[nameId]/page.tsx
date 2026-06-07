import { Metadata } from 'next'
import Link from 'next/link'
import {
  ChevronRightIcon,
  Clock3Icon,
  MessageCircleIcon,
  MessageSquareTextIcon,
  ShieldCheckIcon,
  StarIcon,
  StoreIcon,
  TruckIcon,
  UsersIcon,
} from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export const metadata: Metadata = {
  title: 'Chi tiết sản phẩm',
  description: 'Xem chi tiết sản phẩm',
}

const RELATED_PRODUCTS = [
  {
    id: 1,
    name: 'Tai nghe Bluetooth Pro X1',
    price: '490.000đ',
    oldPrice: '790.000đ',
    sold: 'Đã bán 1.2k',
    href: '/products/tai-nghe-bluetooth-pro-x1-i-101',
  },
  {
    id: 2,
    name: 'Tai nghe TWS Noise Cancel N5',
    price: '690.000đ',
    oldPrice: '990.000đ',
    sold: 'Đã bán 860',
    href: '/products/tai-nghe-tws-noise-cancel-n5-i-102',
  },
  {
    id: 3,
    name: 'Loa bluetooth mini bass sâu',
    price: '520.000đ',
    oldPrice: '740.000đ',
    sold: 'Đã bán 540',
    href: '/products/loa-bluetooth-mini-bass-sau-i-103',
  },
  {
    id: 4,
    name: 'Sạc nhanh GaN 65W',
    price: '360.000đ',
    oldPrice: '590.000đ',
    sold: 'Đã bán 1.4k',
    href: '/products/sac-nhanh-gan-65w-i-104',
  },
] as const

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

const REVIEWS = [
  {
    id: 1,
    name: 'Nguyen Minh Anh',
    rating: 5,
    comment: 'Âm thanh chi tiết, đeo êm. Dùng học online và nghe nhạc đều ổn, pin khá trâu.',
    date: '27/05/2026',
    tag: 'Đã mua hàng',
  },
  {
    id: 2,
    name: 'Tran Gia Bao',
    rating: 4,
    comment: 'Kết nối nhanh, độ trễ thấp. Hộp sạc hơi bám vân tay nhưng nhìn chung đáng tiền.',
    date: '23/05/2026',
    tag: 'Đã mua hàng',
  },
  {
    id: 3,
    name: 'Le Thanh Thuy',
    rating: 5,
    comment: 'Mic thoại rõ, giao hàng nhanh. Mình hài lòng vì mức giá sale rất tốt.',
    date: '20/05/2026',
    tag: 'Đã mua hàng',
  },
] as const

const parseProductName = (nameId: string) => {
  const [namePart] = nameId.split('-i-')
  return namePart
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

type ProductDetailPageProps = {
  params: Promise<{
    nameId: string
  }>
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { nameId } = await params
  const productName = parseProductName(nameId)

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 py-4">
      <div className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        <Link href="/" className="transition-colors hover:text-foreground">
          Trang chủ
        </Link>
        <ChevronRightIcon className="size-4" />
        <Link href="/categories" className="transition-colors hover:text-foreground">
          Danh mục
        </Link>
        <ChevronRightIcon className="size-4" />
        <span className="text-foreground">{productName}</span>
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <Card className="xl:order-2 xl:col-span-7">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-red-500 text-white hover:bg-red-500">Flash Sale</Badge>
              <Badge variant="outline">Chính hãng</Badge>
              <Badge variant="outline">Đổi trả 7 ngày</Badge>
            </div>
            <CardTitle className="text-2xl font-bold">{productName}</CardTitle>
            <CardDescription className="flex flex-wrap items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1">
                <StarIcon className="size-3.5 fill-amber-400 text-amber-500" />
                4.8/5 (128 đánh giá)
              </span>
              <span>Đã bán 1.2k</span>
              <span>Mã SP: NEST-PRO-X1</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border bg-muted/30 p-3">
              <div className="flex flex-wrap items-end gap-2">
                <p className="text-3xl font-bold text-red-600">490.000đ</p>
                <p className="text-sm text-muted-foreground line-through">790.000đ</p>
                <Badge className="bg-red-500 text-white hover:bg-red-500">-38%</Badge>
              </div>
            </div>

            <div className="grid gap-2 text-sm text-muted-foreground">
              <p className="inline-flex items-center gap-2">
                <StoreIcon className="size-4 text-primary" />
                Bán bởi: Nest Official Store
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

            <div className="space-y-2">
              <p className="text-sm font-semibold">Phân loại</p>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  Đen
                </Button>
                <Button variant="outline" size="sm">
                  Trắng
                </Button>
                <Button variant="outline" size="sm">
                  Xanh navy
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold">Số lượng</p>
              <div className="flex items-center gap-2">
                <Button size="icon-sm" variant="outline">
                  -
                </Button>
                <div className="min-w-10 rounded-md border px-3 py-1 text-center text-sm">1</div>
                <Button size="icon-sm" variant="outline">
                  +
                </Button>
                <p className="text-xs text-muted-foreground">Còn 27 sản phẩm</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <Button size="lg" className="min-w-36">
                Mua ngay
              </Button>
              <Button size="lg" variant="outline" className="min-w-36">
                Thêm vào giỏ
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="gap-0 py-0 xl:order-1 xl:col-span-5 xl:self-start">
          <CardContent className="p-0">
            <div className="grid gap-2 p-3">
              <div className="flex aspect-4/3 items-center justify-center rounded-xl border border-dashed bg-muted/40 text-sm text-muted-foreground">
                Ảnh sản phẩm chính
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex aspect-4/3 items-center justify-center rounded-md border bg-muted/30 text-[11px] text-muted-foreground"
                  >
                    Ảnh {index + 1}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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

      <div className="grid gap-6 xl:grid-cols-12">
        <Card className="xl:col-span-7">
          <CardHeader>
            <CardTitle>Mô tả sản phẩm</CardTitle>
            <CardDescription>
              Thông tin nổi bật và lý do sản phẩm phù hợp với nhu cầu sử dụng hàng ngày.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Tai nghe Bluetooth Pro X1 được thiết kế cho trải nghiệm nghe nhạc và đàm thoại ổn định cả ngày. Sản phẩm
              hỗ trợ kết nối nhanh, độ trễ thấp và âm bass rõ ràng.
            </p>
            <p>
              Phù hợp cho học tập, làm việc và giải trí, đặc biệt khi cần một thiết bị gọn nhẹ, pin lâu và độ bền cao.
            </p>

            <div className="grid gap-3 pt-1 sm:grid-cols-3">
              <div className="rounded-lg border bg-muted/20 p-3">
                <p className="text-xs uppercase tracking-wide">Kết nối</p>
                <p className="mt-1 text-sm font-semibold text-foreground">Bluetooth 5.3</p>
              </div>
              <div className="rounded-lg border bg-muted/20 p-3">
                <p className="text-xs uppercase tracking-wide">Dung lượng pin</p>
                <p className="mt-1 text-sm font-semibold text-foreground">30 giờ</p>
              </div>
              <div className="rounded-lg border bg-muted/20 p-3">
                <p className="text-xs uppercase tracking-wide">Chống nước</p>
                <p className="mt-1 text-sm font-semibold text-foreground">IPX5</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="xl:col-span-5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquareTextIcon className="size-5 text-primary" />
              Đánh giá sản phẩm
            </CardTitle>
            <CardDescription>Phản hồi từ khách hàng đã mua và sử dụng sản phẩm.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border bg-muted/25 p-4">
              <div className="flex flex-wrap items-end gap-3">
                <p className="text-3xl font-bold text-foreground">4.8</p>
                <p className="pb-1 text-sm text-muted-foreground">trên 5 • 128 đánh giá</p>
              </div>
              <div className="mt-2 flex items-center gap-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, index) => (
                  <StarIcon key={index} className="size-4 fill-current" />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {REVIEWS.map((review) => (
                <div key={review.id} className="rounded-lg border p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarFallback>{review.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold">{review.name}</p>
                        <div className="flex items-center gap-1 text-amber-500">
                          {Array.from({ length: review.rating }).map((_, index) => (
                            <StarIcon key={index} className="size-3.5 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline">{review.tag}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{review.date}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="xl:col-span-8">
          <CardHeader>
            <CardTitle>Sản phẩm cùng danh mục</CardTitle>
            <CardDescription>Gợi ý thêm các sản phẩm liên quan bạn có thể quan tâm.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {RELATED_PRODUCTS.map((product) => (
                <Link
                  key={product.id}
                  href={product.href}
                  className="rounded-lg border p-3 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                >
                  <div className="flex aspect-video items-center justify-center rounded-md border border-dashed bg-muted/40 text-xs text-muted-foreground">
                    Ảnh sản phẩm
                  </div>
                  <p className="mt-2 line-clamp-2 text-center text-sm font-medium">{product.name}</p>
                  <div className="mt-1 flex items-center justify-center gap-2">
                    <p className="text-sm font-bold text-red-600">{product.price}</p>
                    <p className="text-xs text-muted-foreground line-through">{product.oldPrice}</p>
                  </div>
                  <p className="mt-1 text-center text-xs text-muted-foreground">{product.sold}</p>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

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
