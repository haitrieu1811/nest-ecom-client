import { CalendarDaysIcon, Clock3Icon, ImageIcon } from 'lucide-react'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import PATH from '@/constants/path'

const POST_ITEMS = [
  {
    id: 1,
    title: '5 mẹo chọn sản phẩm công nghệ phù hợp ngân sách',
    excerpt: 'Những lưu ý quan trọng để bạn chọn đúng sản phẩm, đúng nhu cầu mà vẫn tối ưu chi phí mua sắm.',
    category: 'Mẹo mua sắm',
    date: '31/05/2026',
    readTime: '6 phút đọc',
  },
  {
    id: 2,
    title: 'Checklist nâng cấp góc làm việc tại nhà',
    excerpt: 'Tổng hợp các thiết bị nên có để nâng cao hiệu suất và giữ không gian làm việc luôn gọn gàng.',
    category: 'Lifestyle',
    date: '29/05/2026',
    readTime: '4 phút đọc',
  },
  {
    id: 3,
    title: 'So sánh nhanh phụ kiện sạc: GaN và sạc truyền thống',
    excerpt: 'Hiểu rõ ưu nhược điểm của từng loại sạc để chọn giải pháp an toàn và bền cho thiết bị.',
    category: 'Review',
    date: '27/05/2026',
    readTime: '5 phút đọc',
  },
  {
    id: 4,
    title: 'Bí quyết kéo dài tuổi thọ pin cho thiết bị di động',
    excerpt: 'Các thói quen sử dụng đơn giản nhưng giúp pin ổn định hơn trong thời gian dài.',
    category: 'Kinh nghiệm',
    date: '24/05/2026',
    readTime: '3 phút đọc',
  },
  {
    id: 5,
    title: 'Thiết lập giỏ hàng thông minh để không bỏ lỡ deal tốt',
    excerpt: 'Mẹo theo dõi giá và ưu đãi theo thời điểm để chốt đơn nhanh, tiết kiệm hơn.',
    category: 'Mẹo mua sắm',
    date: '22/05/2026',
    readTime: '4 phút đọc',
  },
] as const

export default function HomePosts() {
  const [featuredPost, ...otherPosts] = POST_ITEMS

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Bài viết nổi bật</CardTitle>
        <CardDescription>Cập nhật mẹo mua sắm, đánh giá sản phẩm và xu hướng mới mỗi tuần.</CardDescription>
        <CardAction>
          <Button asChild variant="ghost" size="sm">
            <Link href={PATH.HOME}>Xem tất cả</Link>
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="grid gap-4 lg:grid-cols-5">
        <Link
          href={PATH.HOME}
          className="group relative overflow-hidden rounded-2xl border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 lg:col-span-2"
        >
          <div className="pointer-events-none absolute -top-10 -right-10 size-20 rounded-full bg-muted/40 blur-xl" />

          <div className="relative space-y-3">
            <div className="flex aspect-video items-center justify-center rounded-xl border border-dashed bg-muted/60 text-xs text-muted-foreground sm:aspect-21/9 lg:aspect-4/3">
              <span className="inline-flex items-center gap-1.5">
                <ImageIcon className="size-3.5" />
                Image Placeholder
              </span>
            </div>

            <Badge variant="secondary">{featuredPost.category}</Badge>
            <h3 className="line-clamp-2 text-xl font-semibold leading-7 md:text-2xl md:leading-8">{featuredPost.title}</h3>
            <p className="line-clamp-3 text-base text-muted-foreground">{featuredPost.excerpt}</p>

            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <CalendarDaysIcon className="size-4" />
                {featuredPost.date}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock3Icon className="size-4" />
                {featuredPost.readTime}
              </span>
            </div>
          </div>
        </Link>

        <div className="grid gap-3 sm:grid-cols-2 lg:col-span-3">
          {otherPosts.map((post) => (
            <Link
              key={post.id}
              href={PATH.HOME}
              className="group rounded-xl border bg-card p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md hover:shadow-primary/10"
            >
              <div className="space-y-2">
                <div className="flex aspect-video items-center justify-center rounded-lg border border-dashed bg-muted/60 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <ImageIcon className="size-3" />
                    Placeholder
                  </span>
                </div>

                <Badge variant="outline" className="font-normal">
                  {post.category}
                </Badge>
                <h4 className="line-clamp-2 text-base font-semibold leading-6">{post.title}</h4>
                <p className="line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>

                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <CalendarDaysIcon className="size-3.5" />
                    {post.date}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock3Icon className="size-3.5" />
                    {post.readTime}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
