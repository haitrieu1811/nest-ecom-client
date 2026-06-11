'use client'

import { ArrowRightIcon, LayoutGridIcon, SearchIcon, TagIcon } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'

import PageHeading from '@/app/(shop)/_components/page-heading'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Input } from '@/components/ui/input'
import PATH from '@/constants/path'
import { CategoryIncludeTranslationsType } from '@/schemas/category.schema'

type CategoriesClientProps = {
  initialCategories: CategoryIncludeTranslationsType[]
}

export default function CategoriesClient({ initialCategories }: CategoriesClientProps) {
  const [searchQuery, setSearchQuery] = useState('')

  // Map categories hierarchically
  const { parentCategories, subcategoriesMap } = useMemo(() => {
    const parents = initialCategories.filter((cat) => !cat.parentId)
    const subMap = new Map<number, CategoryIncludeTranslationsType[]>()

    initialCategories.forEach((cat) => {
      if (cat.parentId) {
        const list = subMap.get(cat.parentId) || []
        list.push(cat)
        subMap.set(cat.parentId, list)
      }
    })

    return { parentCategories: parents, subcategoriesMap: subMap }
  }, [initialCategories])

  // Filter based on search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) {
      return parentCategories.map((parent) => ({
        parent,
        subcategories: subcategoriesMap.get(parent.id) || [],
      }))
    }

    const query = searchQuery.toLowerCase().trim()
    const results: { parent: CategoryIncludeTranslationsType; subcategories: CategoryIncludeTranslationsType[] }[] = []

    parentCategories.forEach((parent) => {
      const parentMatch = parent.name.toLowerCase().includes(query)
      const subs = subcategoriesMap.get(parent.id) || []
      const matchingSubs = subs.filter((sub) => sub.name.toLowerCase().includes(query))

      if (parentMatch || matchingSubs.length > 0) {
        results.push({
          parent,
          // If the parent matched, keep all its subcategories, otherwise only keep the matching ones
          subcategories: parentMatch ? subs : matchingSubs,
        })
      }
    })

    return results
  }, [parentCategories, subcategoriesMap, searchQuery])

  return (
    <div className="w-full space-y-8 py-4">
      {/* Header section with page title & search box */}
      <PageHeading
        badge="Khám phá danh mục"
        title="Tất cả"
        titleHighlight="Danh mục sản phẩm"
        description="Tìm kiếm và lựa chọn danh mục phù hợp với nhu cầu mua sắm của bạn."
      >
        <div className="relative w-full max-w-md mx-auto">
          <div className="relative">
            <SearchIcon className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400 pointer-events-none transition-colors group-focus-within:text-primary" />
            <Input
              type="text"
              placeholder="Tìm kiếm danh mục..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 w-full rounded-2xl border-slate-200 bg-background/80 text-sm font-medium shadow-xs focus-visible:ring-primary/20 dark:border-zinc-800/80 focus-visible:border-primary/50 transition-all backdrop-blur-xs"
            />
          </div>
        </div>
      </PageHeading>

      {/* Categories display */}
      {filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCategories.map(({ parent, subcategories }) => (
            <Card
              key={parent.id}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/50 dark:border-zinc-800/80 bg-linear-to-b from-white/70 to-slate-50/50 dark:from-zinc-900/40 dark:to-zinc-950/20 shadow-xs hover:shadow-md hover:border-primary/30 transition-all duration-300"
            >
              {/* Subtle hover background decoration */}
              <div className="absolute -inset-0.5 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xs pointer-events-none" />

              <CardHeader className="relative z-10 flex flex-row items-center gap-4 pb-4 border-b border-slate-100 dark:border-zinc-800/50">
                <div className="rounded-xl border border-slate-200/50 dark:border-zinc-800/80 bg-background/80 p-1 shadow-xs ring-2 ring-transparent group-hover:ring-primary/10 group-hover:scale-102 dark:bg-black/25 transition-all duration-300">
                  <Avatar className="size-12 md:size-14">
                    <AvatarImage src={parent.logo || undefined} alt={parent.name} className="object-cover" />
                    <AvatarFallback className="font-medium bg-primary/5 text-primary text-sm md:text-base">
                      {parent.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="space-y-1.5">
                  <CardTitle className="text-base md:text-lg font-semibold text-slate-800 dark:text-slate-100">
                    <Link
                      href={PATH.CATEGORY_DETAIL(parent.name, parent.id)}
                      className="hover:text-primary transition-colors duration-200"
                    >
                      {parent.name}
                    </Link>
                  </CardTitle>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {subcategories.length > 0 ? `${subcategories.length} danh mục con` : 'Khám phá ngay'}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="relative z-10 pt-5 space-y-4">
                {parent.description && (
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {parent.description}
                  </p>
                )}

                {subcategories.length > 0 ? (
                  <div className="space-y-2.5">
                    <span className="text-sm font-medium text-slate-400 dark:text-slate-500 block">Danh mục con</span>
                    <div className="flex flex-wrap gap-2">
                      {subcategories.map((sub) => (
                        <Link
                          key={sub.id}
                          href={PATH.CATEGORY_DETAIL(sub.name, sub.id)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/60 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-900/30 px-3.5 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 transition-all duration-200 hover:border-primary/45 hover:bg-primary/5 hover:text-primary"
                        >
                          <TagIcon className="size-3.5 shrink-0 opacity-70 text-slate-400 group-hover/sub:text-primary" />
                          <span>{sub.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="pt-2">
                    <Link
                      href={PATH.CATEGORY_DETAIL(parent.name, parent.id)}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline transition-all duration-200 group-hover:translate-x-1"
                    >
                      <span>Khám phá sản phẩm</span>
                      <ArrowRightIcon className="size-4" />
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Empty className="py-16 border border-dashed border-slate-200 dark:border-zinc-800/80 rounded-2xl bg-slate-50/20 dark:bg-zinc-950/10">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <LayoutGridIcon className="size-6 text-slate-400" />
            </EmptyMedia>
            <EmptyTitle className="text-lg font-medium text-slate-800 dark:text-slate-100">
              Không tìm thấy danh mục
            </EmptyTitle>
            <EmptyDescription className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
              Không tìm thấy danh mục nào phù hợp với từ khóa &ldquo;{searchQuery}&rdquo;.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </div>
  )
}
