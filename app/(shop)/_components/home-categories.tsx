'use client'

import Link from 'next/link'
import { LayoutGridIcon } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import PATH from '@/constants/path'
import { CategoryIncludeTranslationsType } from '@/schemas/category.schema'
import { Card, CardHeader, CardTitle, CardAction, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function HomeCategories({ categories }: { categories: CategoryIncludeTranslationsType[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-5">
        <div className="space-y-1.5">
          <CardTitle className="text-lg sm:text-xl font-semobild flex items-center gap-2 text-slate-800 dark:text-slate-100">
            <LayoutGridIcon className="size-5 text-primary shrink-0 animate-pulse" />
            Danh mục sản phẩm
          </CardTitle>
        </div>
        <CardAction>
          <Button asChild variant="link" size="sm">
            <Link href={PATH.CATEGORIES}>Xem tất cả</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={PATH.CATEGORY_DETAIL(category.name, category.id)}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/50 dark:border-zinc-800/80 bg-linear-to-b from-white/70 to-slate-50/50 dark:from-zinc-900/40 dark:to-zinc-950/20 p-3.5 text-center transition-all duration-150 hover:-translate-y-1 hover:border-primary/45 hover:shadow-md hover:shadow-primary/5 backdrop-blur-xs"
            >
              {/* Glowing neon watermark on hover */}
              <div className="absolute -inset-0.5 bg-linear-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-150 rounded-2xl blur-xs pointer-events-none" />

              <div className="relative z-10 flex min-h-[110px] flex-col items-center justify-start gap-2.5 h-full">
                {/* Logo wrapper ring effect */}
                <div className="rounded-2xl border border-slate-200/50 dark:border-zinc-800/80 bg-background/80 p-1.5 shadow-xs transition-all duration-150 ring-2 ring-transparent group-hover:ring-primary/25 group-hover:scale-105 dark:bg-black/25">
                  <Avatar className="size-12 sm:size-13 md:size-14">
                    <AvatarImage src={category.logo || undefined} alt={category.name} className="object-cover" />
                    <AvatarFallback className="font-bold bg-primary/5 text-primary text-xs sm:text-sm">
                      {category.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <span className="line-clamp-2 text-sm font-medium leading-5 group-hover:text-primary transition-colors duration-150 select-none">
                  {category.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
