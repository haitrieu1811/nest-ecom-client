'use client'

import * as React from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ProductDescriptionProps {
  description: string
}

export default function ProductDescription({ description }: ProductDescriptionProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [isTooLong, setIsTooLong] = React.useState(false)
  const contentRef = React.useRef<HTMLDivElement>(null)

  const THRESHOLD = 250 // Height threshold in pixels

  React.useEffect(() => {
    if (contentRef.current) {
      if (contentRef.current.scrollHeight > THRESHOLD) {
        setIsTooLong(true)
      }
    }
  }, [description])

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev)
  }

  return (
    <div>
      <div className="relative">
        <div
          ref={contentRef}
          className={cn(
            'prose prose-sm max-w-none whitespace-pre-line transition-all duration-300',
            !isExpanded && isTooLong ? 'max-h-[250px] overflow-hidden' : 'max-h-none',
          )}
          dangerouslySetInnerHTML={{ __html: description }}
        />

        {isTooLong && !isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-card to-transparent pointer-events-none" />
        )}
      </div>

      {isTooLong && (
        <div className="mt-4 flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleExpand}
            className="gap-1.5 font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
          >
            {isExpanded ? (
              <>
                Thu gọn <ChevronUp className="size-4" />
              </>
            ) : (
              <>
                Xem thêm <ChevronDown className="size-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
