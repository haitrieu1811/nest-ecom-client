/* eslint-disable react-hooks/set-state-in-effect */

'use client'

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

type ImageZoomDialogProps = {
  images: string[]
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  initialIndex?: number
  alt?: string
}

export default function ImageZoomDialog({
  images,
  isOpen,
  onOpenChange,
  initialIndex = 0,
  alt = 'Hình ảnh',
}: ImageZoomDialogProps) {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex)

  React.useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex)
    }
  }, [isOpen, initialIndex])

  if (!images || images.length === 0) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-7xl h-[90vh] border-none bg-popover p-6 text-popover flex flex-col sm:rounded-2xl outline-hidden">
        <DialogTitle className="sr-only">Xem ảnh sản phẩm</DialogTitle>
        <DialogDescription className="sr-only">Phóng to xem hình ảnh chi tiết</DialogDescription>

        {/* Ảnh lớn phóng to */}
        <div className="relative w-full flex-1 min-h-0 flex items-center justify-center">
          {images[currentIndex] ? (
            <Image
              src={images[currentIndex]}
              alt={`${alt} - ${currentIndex + 1}`}
              fill
              className="object-contain select-none rounded-lg"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
              Không có ảnh
            </div>
          )}

          {/* Nút Previous / Next */}
          {images.length > 1 && (
            <>
              <Button
                size="icon"
                variant="ghost"
                type="button"
                className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-white/10 hover:bg-white/20 text-white hover:text-white outline-hidden cursor-pointer size-12"
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
                }}
              >
                <ChevronLeftIcon className="size-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                type="button"
                className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-white/10 hover:bg-white/20 text-white hover:text-white outline-hidden cursor-pointer size-12"
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentIndex((prev) => (prev + 1) % images.length)
                }}
              >
                <ChevronRightIcon className="size-4" />
              </Button>
            </>
          )}
        </div>

        {/* Danh sách ảnh thu nhỏ chuyển nhanh trong Dialog */}
        {images.length > 0 && (
          <div className="mt-4 flex flex-wrap justify-center gap-2 max-w-full overflow-x-auto py-1 shrink-0">
            {images.map((img, idx) => {
              const isActive = currentIndex === idx
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={cn(
                    'relative size-14 overflow-hidden rounded-md border-2 bg-muted/10 transition-all outline-hidden cursor-pointer',
                    isActive ? 'border-primary scale-105' : 'border-transparent opacity-60 hover:opacity-100',
                  )}
                >
                  <Image src={img} alt={`dialog-thumbnail-${idx + 1}`} fill className="object-cover" unoptimized />
                </button>
              )
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
