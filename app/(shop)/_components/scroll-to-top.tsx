'use client'

import * as React from 'react'
import { ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => {
      window.removeEventListener('scroll', toggleVisibility)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <button
      onClick={scrollToTop}
      aria-label="Cuộn lên đầu trang"
      className={cn(
        'fixed right-4 md:right-8 z-40 flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/20 transition-all duration-300 hover:scale-110 active:scale-95 hover:bg-primary/95 cursor-pointer border border-primary/10',
        isVisible 
          ? 'bottom-20 md:bottom-8 opacity-100 translate-y-0' 
          : 'bottom-20 md:bottom-8 opacity-0 translate-y-6 pointer-events-none'
      )}
    >
      <ArrowUp className="size-5 stroke-[2.5]" />
    </button>
  )
}
