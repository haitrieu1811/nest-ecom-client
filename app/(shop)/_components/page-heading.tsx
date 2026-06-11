import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type PageHeadingProps = {
  /** Small badge text above the title */
  badge?: string
  /** Main title — plain text part */
  title: string
  /** Highlighted/gradient part of the title */
  titleHighlight?: string
  /** Description text below the title */
  description?: string
  /** Additional content rendered below the heading (e.g. search box, actions) */
  children?: ReactNode
  /** Additional className for the outer container */
  className?: string
}

export default function PageHeading({
  badge,
  title,
  titleHighlight,
  description,
  children,
  className,
}: PageHeadingProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-3xl border border-slate-200/50 dark:border-zinc-800/80 bg-linear-to-br from-slate-50/80 via-white/50 to-slate-100/30 dark:from-zinc-900/60 dark:via-zinc-950/40 dark:to-zinc-900/20 px-6 py-8 md:px-10 md:py-10 shadow-xs backdrop-blur-md',
        className,
      )}
    >
      {/* Background Glow effects */}
      <div className="absolute right-0 top-0 -translate-y-6 translate-x-6 size-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute left-1/3 bottom-0 translate-y-12 size-36 rounded-full bg-teal-500/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-6 text-center">
        <div className="space-y-3 flex flex-col items-center">
          {badge && (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary dark:bg-primary/20 dark:text-primary-foreground/90 uppercase tracking-wide">
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full size-2 bg-primary"></span>
              </span>
              {badge}
            </div>
          )}
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 leading-tight">
            {title}
            {titleHighlight && (
              <>
                {' '}
                <span className="bg-linear-to-r from-primary to-teal-500 bg-clip-text text-transparent pr-1">
                  {titleHighlight}
                </span>
              </>
            )}
          </h1>
          {description && (
            <p className="text-sm md:text-base font-medium text-slate-500 dark:text-slate-400 max-w-xl">
              {description}
            </p>
          )}
        </div>

        {children && <div className="w-full">{children}</div>}
      </div>
    </div>
  )
}
