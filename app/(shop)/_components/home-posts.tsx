import { CalendarDaysIcon, Clock3Icon, BookOpenIcon } from 'lucide-react'
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
    <Card className="overflow-visible border border-slate-200/50 bg-card dark:border-zinc-800/80 shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-5">
        <div className="space-y-1">
          <CardTitle className="text-lg sm:text-xl font-medium flex items-center gap-2.5 text-slate-800 dark:text-slate-100">
            <BookOpenIcon className="size-5 text-primary shrink-0" />
            Bài viết nổi bật
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm font-normal text-slate-500 dark:text-slate-400">
            Cập nhật mẹo mua sắm, đánh giá sản phẩm và xu hướng mới mỗi tuần.
          </CardDescription>
        </div>
        <CardAction>
          <Button asChild variant="link" size="sm" className="text-sm font-normal">
            <Link href={PATH.HOME}>Xem tất cả</Link>
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="pt-2 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {POST_ITEMS.map((post) => (
            <Link
              key={post.id}
              href={PATH.HOME}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200/50 dark:border-zinc-800/60 bg-linear-to-b from-white/70 to-slate-50/50 dark:from-zinc-900/40 dark:to-zinc-950/20 shadow-2xs hover:shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 overflow-hidden"
            >
              {/* Post Thumbnail - Full-Bleed Top */}
              <div className="relative aspect-16/10 w-full bg-muted/20 border-b border-slate-100 dark:border-zinc-800/80 shrink-0 overflow-hidden">
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-102 transition-transform duration-500"
                  unoptimized
                />
              </div>

              {/* Padded Text Content */}
              <div className="flex flex-col justify-between flex-1 p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-medium text-primary uppercase tracking-wider">{post.category}</span>
                    <span className="text-slate-400 dark:text-zinc-500 flex items-center gap-1 font-normal">
                      <Clock3Icon className="size-3.5" />
                      {post.readTime}
                    </span>
                  </div>
                  <h4 className="line-clamp-2 text-sm font-medium leading-snug group-hover:text-primary transition-colors duration-200">
                    {post.title}
                  </h4>
                  <p className="line-clamp-2 text-xs sm:text-xs text-muted-foreground leading-relaxed font-normal">
                    {post.excerpt}
                  </p>
                </div>

                <div className="mt-3.5 pt-2.5 border-t border-slate-100 dark:border-zinc-800/80 text-[11px] text-slate-400 dark:text-zinc-500 flex items-center gap-1.5 font-normal">
                  <CalendarDaysIcon className="size-3.5" />
                  <span>{post.date}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
