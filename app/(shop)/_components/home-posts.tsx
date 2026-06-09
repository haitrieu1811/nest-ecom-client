import { CalendarDaysIcon, Clock3Icon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

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
    thumbnail: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=60',
  },
  {
    id: 2,
    title: 'Checklist nâng cấp góc làm việc tại nhà',
    excerpt: 'Tổng hợp các thiết bị nên có để nâng cao hiệu suất và giữ không gian làm việc luôn gọn gàng.',
    category: 'Lifestyle',
    date: '29/05/2026',
    readTime: '4 phút đọc',
    thumbnail: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&auto=format&fit=crop&q=60',
  },
  {
    id: 3,
    title: 'So sánh nhanh phụ kiện sạc: GaN và sạc truyền thống',
    excerpt: 'Hiểu rõ ưu nhược điểm của từng loại sạc để chọn giải pháp an toàn và bền cho thiết bị.',
    category: 'Review',
    date: '27/05/2026',
    readTime: '5 phút đọc',
    thumbnail: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=60',
  },
  {
    id: 4,
    title: 'Bí quyết kéo dài tuổi thọ pin cho thiết bị di động',
    excerpt: 'Các thói quen sử dụng đơn giản nhưng giúp pin ổn định hơn trong thời gian dài.',
    category: 'Kinh nghiệm',
    date: '24/05/2026',
    readTime: '3 phút đọc',
    thumbnail: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=60',
  },
  {
    id: 5,
    title: 'Thiết lập giỏ hàng thông minh để không bỏ lỡ deal tốt',
    excerpt: 'Mẹo theo dõi giá và ưu đãi theo thời điểm để chốt đơn nhanh, tiết kiệm hơn.',
    category: 'Mẹo mua sắm',
    date: '22/05/2026',
    readTime: '4 phút đọc',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60',
  },
  {
    id: 6,
    title: 'Top thiết bị thông minh đáng mua cho phòng khách',
    excerpt: 'Các giải pháp công nghệ đơn giản giúp phòng khách gia đình tiện nghi và thông minh hơn.',
    category: 'Lifestyle',
    date: '20/05/2026',
    readTime: '5 phút đọc',
    thumbnail: 'https://images.unsplash.com/photo-1558882224-cca166733360?w=500&auto=format&fit=crop&q=60',
  },
] as const

export default function HomePosts() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold">Bài viết nổi bật</CardTitle>
        <CardDescription>Cập nhật mẹo mua sắm, đánh giá sản phẩm và xu hướng mới mỗi tuần.</CardDescription>
        <CardAction>
          <Button asChild variant="link" size="sm">
            <Link href={PATH.HOME}>Xem tất cả</Link>
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="grid gap-3 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 pb-4">
        {POST_ITEMS.map((post) => (
          <Link
            key={post.id}
            href={PATH.HOME}
            className="group rounded-xl border border-border/50 bg-card p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/45 hover:shadow-xs flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              {/* Post Thumbnail */}
              <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted/20 border border-border/30 shrink-0">
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
              </div>

              <div className="flex items-center justify-between text-[10px]">
                <span className="font-bold text-primary uppercase tracking-wide">{post.category}</span>
                <span className="text-muted-foreground flex items-center gap-0.5">
                  <Clock3Icon className="size-2.5" />
                  {post.readTime}
                </span>
              </div>
              <h4 className="line-clamp-2 text-sm font-semibold leading-snug">{post.title}</h4>
              <p className="line-clamp-2 text-xs text-muted-foreground leading-normal">{post.excerpt}</p>
            </div>
            <div className="mt-3 pt-2 border-t border-border/40 text-xs text-muted-foreground flex items-center gap-1.5">
              <CalendarDaysIcon className="size-3.5" />
              <span>{post.date}</span>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
