'use client'

import { CameraIcon, ImageUpIcon, Trash2Icon, XIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

type InputImagesProps = {
  files: File[]
  defaultImages?: string[]
  maxFiles?: number
  onChange?: (files: File[]) => void
  onCancel?: () => void
  onRemoveDefault?: (url: string) => void
  onRemoveAllDefault?: () => void
  title?: string
  description?: string
}

export default function InputImages({
  files,
  defaultImages = [],
  maxFiles,
  onChange,
  onCancel,
  onRemoveDefault,
  onRemoveAllDefault,
  title = 'Ảnh sản phẩm',
  description = 'PNG, JPG hoặc WEBP. Có thể chọn nhiều ảnh cho cùng một sản phẩm.',
}: InputImagesProps) {
  const inputImagesRef = React.useRef<HTMLInputElement>(null)

  const localPreviewUrls = React.useMemo(() => {
    return files.map((file) => URL.createObjectURL(file))
  }, [files])

  React.useEffect(() => {
    return () => {
      localPreviewUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [localPreviewUrls])

  const previewItems = React.useMemo(() => {
    const localItems = files.map((file, index) => ({
      url: localPreviewUrls[index],
      isLocal: true,
      fileIndex: index,
    }))
    const defaultItems = defaultImages.map((url) => ({
      url,
      isLocal: false,
      fileIndex: -1,
    }))
    return [...localItems, ...defaultItems]
  }, [defaultImages, files, localPreviewUrls])

  const handleChangeImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    if (!selectedFiles.length) {
      return
    }

    const mergedFiles = [...files, ...selectedFiles]
    if (typeof maxFiles === 'number') {
      onChange?.(mergedFiles.slice(0, maxFiles))
      return
    }

    onChange?.(mergedFiles)
  }

  const handleRemoveFile = (fileIndex: number) => {
    onChange?.(files.filter((_, index) => index !== fileIndex))
  }

  const handleRemoveItem = (item: (typeof previewItems)[0]) => {
    if (item.isLocal) {
      handleRemoveFile(item.fileIndex)
    } else {
      onRemoveDefault?.(item.url)
    }
  }

  const handleCancelAll = () => {
    onCancel?.()
    onRemoveAllDefault?.()
  }

  const totalImagesCount = previewItems.length

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-xs transition-all duration-300 hover:shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="size-20 rounded-lg ring-2 ring-primary/10 shadow-md">
              <AvatarImage src={previewItems[0]?.url} className="rounded-lg object-cover" />
              <AvatarFallback className="rounded-lg font-bold bg-primary/10 text-primary">IM</AvatarFallback>
            </Avatar>
            <div className="absolute -right-1 -bottom-1 inline-flex size-7 items-center justify-center rounded-full border bg-primary text-primary-foreground shadow-md">
              <CameraIcon className="size-3.5" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-base font-bold text-slate-800 dark:text-slate-200">{title}</p>
              {totalImagesCount > 0 && (
                <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary">
                  {totalImagesCount} ảnh {maxFiles ? `/ Tối đa ${maxFiles}` : ''}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground max-w-md leading-relaxed">{description}</p>
          </div>
        </div>
      </div>

      <input
        hidden
        ref={inputImagesRef}
        type="file"
        accept="image/*"
        multiple
        id="images"
        onChange={handleChangeImages}
        onClick={(e) => {
          const input = e.currentTarget
          input.value = ''
        }}
      />

      {/* Grid Previews */}
      {previewItems.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-5">
          {previewItems.map((item, index) => {
            return (
              <div
                key={`${item.url}-${index}`}
                className="group relative aspect-square overflow-hidden rounded-xl border bg-muted shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
              >
                <Image src={item.url} alt={`preview-${index + 1}`} fill className="object-cover" unoptimized />
                <div className="absolute top-1.5 left-1.5">
                  {item.isLocal ? (
                    <span className="rounded bg-emerald-500/90 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-emerald-950 shadow-xs">
                      Mới
                    </span>
                  ) : (
                    <span className="rounded bg-sky-500/90 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-sky-950 shadow-xs">
                      Đã lưu
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveItem(item)
                  }}
                  className="absolute top-1.5 right-1.5 flex size-6.5 items-center justify-center rounded-lg bg-black/40 text-white opacity-0 transition-opacity hover:bg-destructive group-hover:opacity-100 backdrop-blur-xs shadow-xs"
                >
                  <XIcon className="size-3.5" />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputImagesRef.current?.click()}
          className="h-9 gap-1.5 text-xs font-semibold"
        >
          <ImageUpIcon className="size-4" />
          {files.length > 0 || defaultImages.length > 0 ? 'Thêm ảnh khác' : 'Chọn nhiều ảnh'}
        </Button>
        {(files.length > 0 || defaultImages.length > 0) && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleCancelAll}
            className="h-9 gap-1.5 text-xs font-semibold"
          >
            <Trash2Icon className="size-4" />
            Xóa tất cả
          </Button>
        )}
      </div>
    </div>
  )
}
