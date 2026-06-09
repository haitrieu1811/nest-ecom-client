'use client'

import { Inbox, Search, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'

import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover'
import { Spinner } from '@/components/ui/spinner'
import PATH from '@/constants/path'
import useDebounce from '@/hooks/use-debounce'
import useProductsList from '@/hooks/use-products-list'
import { cn, formatCurrency } from '@/lib/utils'

type HeaderSearchProps = {
  className?: string
}

export default function HeaderSearch({ className }: HeaderSearchProps) {
  const [query, setQuery] = React.useState<string>('')
  const [isOpen, setIsOpen] = React.useState<boolean>(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const debouncedQuery = useDebounce(query, 1000)

  const { products, getProductsListQuery } = useProductsList({
    name: debouncedQuery,
    page: 1,
    enabled: !!debouncedQuery.trim(),
  })

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(query.trim() !== '')
  }, [query])

  const handleClear = () => {
    setQuery('')
    inputRef.current?.focus()
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <div className={cn('relative w-full', className)}>
      <Popover open={isOpen && query.trim() !== ''} onOpenChange={setIsOpen}>
        <PopoverAnchor asChild>
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center w-full rounded-full border-[1.6px] border-primary bg-card pl-4 overflow-hidden h-9.5 focus-within:ring-2 focus-within:ring-primary/15 transition-all"
          >
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => {
                if (query.trim()) setIsOpen(true)
              }}
              placeholder="Tìm kiếm sản phẩm..."
              className="flex-1 min-w-0 bg-transparent text-sm outline-hidden border-0 py-1.5 focus:ring-0 placeholder:text-muted-foreground text-slate-800 dark:text-slate-200"
            />
            {query && (
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={handleClear}
                className="p-1 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer mr-2 shrink-0"
              >
                <X className="size-3.5" />
              </button>
            )}
            <button
              type="submit"
              className="h-full px-3.5 md:px-5 bg-primary text-white hover:bg-primary/90 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <Search className="size-4 text-white" />
            </button>
          </form>
        </PopoverAnchor>

        <PopoverContent
          align="center"
          sideOffset={8}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          className="w-(--radix-popover-anchor-width) md:w-[720px] lg:w-[780px] p-3.5 max-h-[420px] overflow-y-auto flex flex-col gap-2 dark:border-slate-800 bg-card border border-border shadow-lg rounded-xl z-50"
        >
          {getProductsListQuery.isLoading ? (
            <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground select-none">
              <Spinner />
              Đang tìm kiếm...
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="px-2.5 py-1 text-sm font-semibold text-muted-foreground select-none border-b border-border/30 pb-2">
                Sản phẩm gợi ý ({products.length})
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-0.5">
                {products.map((product) => {
                  const productUrl = PATH.PRODUCT_DETAIL(product.name, product.id)
                  return (
                    <Link
                      key={product.id}
                      href={productUrl}
                      onClick={() => setQuery('')}
                      className="flex items-center gap-3.5 p-2.5 rounded-lg border border-border/60 bg-card hover:bg-muted/50 hover:border-primary/30 hover:shadow-xs transition-all duration-200 group"
                    >
                      <div className="relative size-14 rounded-md overflow-hidden bg-muted/20 border border-border/30 shrink-0 flex items-center justify-center">
                        {product.thumbnail ? (
                          <Image
                            src={product.thumbnail}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            unoptimized
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-slate-400 bg-muted/10">
                            No Pic
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                          {product.name}
                        </p>
                        <div className="mt-1">
                          <span className="text-sm font-bold text-red-600 dark:text-red-500">
                            {formatCurrency(product.basePrice)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </>
          ) : (
            <div className="py-8 px-4 flex flex-col items-center justify-center text-center select-none">
              <Inbox className="size-8 text-muted-foreground/60 mb-2 stroke-[1.5]" />
              <p className="text-sm text-muted-foreground font-semibold">Không tìm thấy kết quả nào</p>
              <p className="text-xs text-muted-foreground/70 mt-0.5">Thử tìm kiếm với từ khóa khác xem sao nhé</p>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}
