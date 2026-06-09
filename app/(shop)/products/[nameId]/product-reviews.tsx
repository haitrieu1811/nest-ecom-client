'use client'

import { MessageSquareTextIcon, StarIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import ImageZoomDialog from './image-zoom-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { FieldLabel } from '@/components/ui/field'
import InputImages from '@/components/input-images'

interface Review {
  id: number
  name: string
  rating: number
  comment: string
  date: string
  tag: string
  images: string[]
}

// Mock review data with images
const INITIAL_REVIEWS: Review[] = [
  {
    id: 1,
    name: 'Nguyen Minh Anh',
    rating: 5,
    comment: 'Âm thanh chi tiết, đeo êm. Dùng học online và nghe nhạc đều ổn, pin khá trâu. Đóng gói rất cẩn thận.',
    date: '27/05/2026',
    tag: 'Đã mua hàng',
    images: ['https://picsum.photos/id/1/600/400', 'https://picsum.photos/id/2/600/400'],
  },
  {
    id: 2,
    name: 'Tran Gia Bao',
    rating: 4,
    comment: 'Kết nối nhanh, độ trễ thấp. Hộp sạc hơi bám vân tay nhưng nhìn chung đáng tiền.',
    date: '23/05/2026',
    tag: 'Đã mua hàng',
    images: ['https://picsum.photos/id/3/600/400'],
  },
  {
    id: 3,
    name: 'Le Thanh Thuy',
    rating: 5,
    comment: 'Mic thoại rõ, giao hàng nhanh. Mình hài lòng vì mức giá sale rất tốt. Sẽ tiếp tục ủng hộ shop.',
    date: '20/05/2026',
    tag: 'Đã mua hàng',
    images: [
      'https://picsum.photos/id/4/600/400',
      'https://picsum.photos/id/5/600/400',
      'https://picsum.photos/id/6/600/400',
    ],
  },
]

const INITIAL_STATS = {
  totalCount: 128,
  average: 4.8,
  breakdown: [
    { stars: 5, count: 102 },
    { stars: 4, count: 18 },
    { stars: 3, count: 6 },
    { stars: 2, count: 2 },
    { stars: 1, count: 0 },
  ],
}

export default function ProductReviews() {
  const [reviewsList, setReviewsList] = React.useState<Review[]>(INITIAL_REVIEWS)
  const [stats, setStats] = React.useState(INITIAL_STATS)
  const [showForm, setShowForm] = React.useState(false)

  // Form State
  const [formRating, setFormRating] = React.useState(5)
  const [hoverRating, setHoverRating] = React.useState<number | null>(null)
  const [formComment, setFormComment] = React.useState('')
  const [formFiles, setFormFiles] = React.useState<File[]>([])

  // Keep track of all created object URLs to revoke them when unmounted
  const persistentUrlsRef = React.useRef<string[]>([])

  const createPersistentUrl = React.useCallback((file: File) => {
    const url = URL.createObjectURL(file)
    persistentUrlsRef.current.push(url)
    return url
  }, [])

  React.useEffect(() => {
    return () => {
      // Clean up all persistent blob URLs
      // eslint-disable-next-line react-hooks/exhaustive-deps
      persistentUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [])

  const [zoomState, setZoomState] = React.useState<{
    isOpen: boolean
    images: string[]
    initialIndex: number
  }>({
    isOpen: false,
    images: [],
    initialIndex: 0,
  })

  // Calculate percentages dynamically
  const breakdownWithPercent = React.useMemo(() => {
    return stats.breakdown.map((item) => {
      const percentage = stats.totalCount > 0 ? Math.round((item.count / stats.totalCount) * 100) : 0
      return {
        ...item,
        percentage,
      }
    })
  }, [stats])

  const resetForm = () => {
    setFormRating(5)
    setFormComment('')
    setFormFiles([])
  }

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()

    const createdImages = formFiles.map((file) => createPersistentUrl(file))

    const newReview = {
      id: Date.now(),
      name: 'Khách hàng',
      rating: formRating,
      comment: formComment.trim(),
      date: new Date().toLocaleDateString('vi-VN'),
      tag: 'Đã mua hàng',
      images: createdImages,
    }

    setReviewsList((prev) => [newReview, ...prev])

    // Update stats dynamically
    setStats((prev) => {
      const updatedBreakdown = prev.breakdown.map((item) => {
        if (item.stars === formRating) {
          return { ...item, count: item.count + 1 }
        }
        return item
      })
      const newTotalCount = prev.totalCount + 1
      const oldSum = prev.breakdown.reduce((sum, item) => sum + item.stars * item.count, 0)
      const newAverage = Number(((oldSum + formRating) / newTotalCount).toFixed(1))

      return {
        totalCount: newTotalCount,
        average: newAverage,
        breakdown: updatedBreakdown,
      }
    })

    setShowForm(false)
    resetForm()
  }

  const handleOpenChange = (open: boolean) => {
    setShowForm(open)
    if (!open) {
      resetForm()
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-xl">
            <MessageSquareTextIcon className="size-5 text-primary" />
            Đánh giá sản phẩm
          </CardTitle>
          <CardDescription>Phản hồi từ khách hàng đã mua và sử dụng sản phẩm.</CardDescription>
        </div>
        <Dialog open={showForm} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="self-start sm:self-center">
              Thêm đánh giá
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Viết đánh giá của bạn</DialogTitle>
              <DialogDescription>Phản hồi của bạn giúp ích rất nhiều cho các khách hàng khác.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitReview} className="space-y-4 pt-2">
              <div>
                <FieldLabel className="mb-1.5">Đánh giá số sao</FieldLabel>
                <div className="flex items-center gap-1.5 py-1.5">
                  {Array.from({ length: 5 }).map((_, idx) => {
                    const starVal = idx + 1
                    const isFilled = hoverRating !== null ? starVal <= hoverRating : starVal <= formRating
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormRating(starVal)}
                        onMouseEnter={() => setHoverRating(starVal)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="text-amber-500 hover:scale-110 transition-transform focus:outline-hidden cursor-pointer"
                      >
                        <StarIcon className={`size-6 ${isFilled ? 'fill-current' : 'text-muted-foreground/30'}`} />
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <FieldLabel className="mb-1.5" htmlFor="review-comment">
                  Nội dung đánh giá
                </FieldLabel>
                <Textarea
                  id="review-comment"
                  required
                  rows={3}
                  placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  className="resize-y min-h-[80px]"
                />
              </div>

              <div>
                <InputImages
                  files={formFiles}
                  maxFiles={5}
                  onChange={setFormFiles}
                  onCancel={() => setFormFiles([])}
                  title="Hình ảnh sản phẩm"
                  description="PNG, JPG hoặc WEBP. Có thể chọn tối đa 5 ảnh."
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowForm(false)
                    resetForm()
                  }}
                >
                  Hủy
                </Button>
                <Button type="submit" size="sm">
                  Gửi đánh giá
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rating Breakdown Section */}
        <div className="grid gap-6 rounded-xl border bg-muted/20 p-5 md:grid-cols-[1fr_2fr] items-center">
          <div className="text-center md:border-r md:border-border md:pr-6">
            <p className="text-5xl font-extrabold text-foreground">{stats.average}</p>
            <div className="mt-2 flex justify-center gap-1 text-amber-500">
              {Array.from({ length: 5 }).map((_, index) => (
                <StarIcon key={index} className="size-5 fill-current" />
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">trên 5 • {stats.totalCount} đánh giá</p>
          </div>

          <div className="space-y-2">
            {breakdownWithPercent.map((stat) => (
              <div key={stat.stars} className="flex items-center gap-3 text-xs">
                <span className="w-12 font-medium flex items-center gap-0.5 justify-end text-muted-foreground">
                  {stat.stars} <StarIcon className="size-3 fill-amber-500 text-amber-500" />
                </span>
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${stat.percentage}%` }}
                  />
                </div>
                <span className="w-16 text-muted-foreground text-right">
                  {stat.percentage}% ({stat.count})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Review List */}
        <div className="grid gap-4 md:grid-cols-2">
          {reviewsList.map((review) => (
            <div
              key={review.id}
              className="rounded-xl border bg-card p-5 shadow-xs transition-colors hover:border-primary/20"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {review.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{review.name}</p>
                    <div className="flex items-center gap-0.5 text-amber-500 mt-0.5">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <StarIcon
                          key={index}
                          className={`size-3.5 ${index < review.rating ? 'fill-current' : 'text-muted-foreground/30'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400"
                >
                  {review.tag}
                </Badge>
              </div>

              <p className="mt-3.5 text-sm text-foreground leading-relaxed">{review.comment}</p>

              {/* Review Images */}
              {review.images.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {review.images.map((imgUrl: string, idx: number) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() =>
                        setZoomState({
                          isOpen: true,
                          images: [...review.images],
                          initialIndex: idx,
                        })
                      }
                      className="relative size-16 overflow-hidden rounded-lg border bg-muted/20 hover:border-primary/50 transition-all hover:scale-95 duration-200 cursor-pointer"
                    >
                      <Image src={imgUrl} alt={`review-image-${idx}`} fill className="object-cover" unoptimized />
                    </button>
                  ))}
                </div>
              )}

              <p className="mt-3 text-[11px] text-muted-foreground">{review.date}</p>
            </div>
          ))}
        </div>
      </CardContent>

      {/* Zoom Image Dialog */}
      <ImageZoomDialog
        images={zoomState.images}
        isOpen={zoomState.isOpen}
        onOpenChange={(open) => setZoomState((prev) => ({ ...prev, isOpen: open }))}
        initialIndex={zoomState.initialIndex}
        alt="Ảnh đánh giá"
      />
    </Card>
  )
}
