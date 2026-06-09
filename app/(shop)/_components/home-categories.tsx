'use client'

import Link from 'next/link'
import { SparklesIcon } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import PATH from '@/constants/path'
import { CategoryIncludeTranslationsType } from '@/schemas/category.schema'
import { Card, CardHeader, CardTitle, CardAction, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function HomeCategories({ categories }: { categories: CategoryIncludeTranslationsType[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Danh mục sản phẩm</CardTitle>
        <CardAction>
          <Button asChild variant="link" size="sm">
            <Link href={PATH.CATEGORIES}>Xem tất cả</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={PATH.CATEGORY_DETAIL(category.name, category.id)}
              className="group relative overflow-hidden rounded-2xl border bg-card p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="pointer-events-none absolute -top-10 -right-8 size-20 rounded-full bg-muted/40 blur-xl" />

              <div className="relative flex min-h-36 flex-col items-center justify-center gap-3">
                <div className="rounded-2xl border bg-background/70 p-1.5 shadow-sm backdrop-blur-sm transition-transform duration-300 group-hover:scale-105 dark:bg-black/20">
                  <Avatar className="size-14 md:size-16">
                    <AvatarImage src={category.logo || undefined} alt={category.name} className="object-cover" />
                    <AvatarFallback className="font-semibold">{category.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </div>

                <span className="line-clamp-2 text-xs font-semibold leading-5 md:text-sm">{category.name}</span>

                <span className="inline-flex items-center gap-1 rounded-full border bg-background/60 px-2 py-1 text-[10px] text-muted-foreground opacity-80 backdrop-blur-sm transition group-hover:opacity-100 dark:bg-black/20">
                  <SparklesIcon className="size-2.5" />
                  Khám phá
                </span>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
