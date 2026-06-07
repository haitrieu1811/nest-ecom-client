/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import { CameraIcon, ImageUpIcon, Trash2Icon, UploadCloudIcon, XIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

import { useFormContext } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { CreateProductBodyType } from '@/schemas/product.schema'

type ProductMediaUploaderProps = {
  thumbnailFile: File | null
  setThumbnailFile: (file: File | null) => void

  imagesFiles: File[]
  setImagesFiles: (files: File[]) => void
}

export default function ProductMediaUploader({
  thumbnailFile,
  setThumbnailFile,
  imagesFiles,
  setImagesFiles,
}: ProductMediaUploaderProps) {
  const form = useFormContext<CreateProductBodyType>()
  const thumbInputRef = React.useRef<HTMLInputElement>(null)
  const imagesInputRef = React.useRef<HTMLInputElement>(null)

  const [isThumbDragActive, setIsThumbDragActive] = React.useState(false)
  const [isImagesDragActive, setIsImagesDragActive] = React.useState(false)

  // Watch form values to keep UI in sync when values are changed/deleted
  const watchedThumbnail = form.watch('thumbnail')
  const watchedImages = form.watch('images') || []

  // Memoize previews
  const thumbPreview = React.useMemo(() => {
    return thumbnailFile ? URL.createObjectURL(thumbnailFile) : null
  }, [thumbnailFile])

  const imagesPreviews = React.useMemo(() => {
    return imagesFiles.map((file) => URL.createObjectURL(file))
  }, [imagesFiles])

  // Revoke URLs on unmount/change
  React.useEffect(() => {
    return () => {
      if (thumbPreview) URL.revokeObjectURL(thumbPreview)
    }
  }, [thumbPreview])

  React.useEffect(() => {
    return () => {
      imagesPreviews.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [imagesPreviews])

  // Thumbnail events
  const handleThumbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setThumbnailFile(file)
      form.setValue('thumbnail', file.name, { shouldValidate: true })
    }
  }

  const handleThumbDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsThumbDragActive(true)
    } else if (e.type === 'dragleave') {
      setIsThumbDragActive(false)
    }
  }

  const handleThumbDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsThumbDragActive(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setThumbnailFile(file)
      form.setValue('thumbnail', file.name, { shouldValidate: true })
    }
  }

  const handleRemoveThumbnail = () => {
    setThumbnailFile(null)
    form.setValue('thumbnail', null, { shouldValidate: true })
  }

  // Images events
  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    if (selectedFiles.length > 0) {
      setImagesFiles([...imagesFiles, ...selectedFiles])
    }
  }

  const handleImagesDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsImagesDragActive(true)
    } else if (e.type === 'dragleave') {
      setIsImagesDragActive(false)
    }
  }

  const handleImagesDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsImagesDragActive(false)
    const droppedFiles = Array.from(e.dataTransfer.files || []).filter((file) => file.type.startsWith('image/'))
    if (droppedFiles.length > 0) {
      setImagesFiles([...imagesFiles, ...droppedFiles])
    }
  }

  const handleRemoveImageFile = (indexToRemove: number) => {
    setImagesFiles(imagesFiles.filter((_, index) => index !== indexToRemove))
  }

  const handleRemoveServerImage = (urlToRemove: string) => {
    const currentImages = form.getValues('images') || []
    const updatedImages = currentImages.filter((url) => url !== urlToRemove)
    form.setValue('images', updatedImages, { shouldValidate: true })
  }

  const handleClearAllImages = () => {
    setImagesFiles([])
    form.setValue('images', [], { shouldValidate: true })
  }

  // Quyết định ảnh hiển thị dựa trên file mới upload hoặc ảnh đã lưu trên form
  const activeThumbnail = thumbPreview || watchedThumbnail || null
  const isNewThumbnail = !!thumbPreview

  const allImages = React.useMemo(() => {
    const localItems = imagesFiles.map((file, idx) => ({
      url: imagesPreviews[idx],
      isLocal: true,
      index: idx,
    }))
    const serverItems = watchedImages.map((url) => ({
      url,
      isLocal: false,
      index: -1,
    }))
    return [...localItems, ...serverItems]
  }, [watchedImages, imagesFiles, imagesPreviews])

  return (
    <div className="space-y-6">
      {/* Inputs ẩn */}
      <input
        type="file"
        ref={thumbInputRef}
        onChange={handleThumbChange}
        onClick={(e) => ((e.target as any).value = null)}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={imagesInputRef}
        onChange={handleImagesChange}
        accept="image/*"
        multiple
        className="hidden"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Cột 1: Thumbnail */}
        <div className="flex flex-col space-y-3 lg:col-span-1">
          <div>
            <p className="text-sm font-semibold">Ảnh đại diện (Thumbnail)</p>
            <p className="text-xs text-muted-foreground">
              Ảnh chính hiển thị trên danh sách sản phẩm. Nên sử dụng tỷ lệ 1:1.
            </p>
          </div>

          <div
            onDragEnter={handleThumbDrag}
            onDragOver={handleThumbDrag}
            onDragLeave={handleThumbDrag}
            onDrop={handleThumbDrop}
            onClick={!activeThumbnail ? () => thumbInputRef.current?.click() : undefined}
            className={`relative flex aspect-square w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed p-4 text-center transition-all duration-300 ${
              !activeThumbnail ? 'cursor-pointer' : ''
            } ${
              isThumbDragActive
                ? 'border-primary bg-primary/5 scale-[0.98]'
                : 'border-muted-foreground/20 bg-muted/10 hover:border-primary/50 hover:bg-muted/20'
            }`}
          >
            {activeThumbnail ? (
              <div className="group relative h-full w-full overflow-hidden rounded-xl border bg-background shadow-xs">
                <Image
                  src={activeThumbnail}
                  alt="Thumbnail"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized
                />

                {/* Badge trạng thái */}
                <div className="absolute top-2 left-2">
                  {isNewThumbnail ? (
                    <span className="rounded-md bg-emerald-500/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-950 shadow-xs backdrop-blur-xs">
                      Mới
                    </span>
                  ) : (
                    <span className="rounded-md bg-sky-500/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-sky-950 shadow-xs backdrop-blur-xs">
                      Đã lưu
                    </span>
                  )}
                </div>

                {/* Hovers action */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => thumbInputRef.current?.click()}
                      className="flex size-11 items-center justify-center rounded-xl bg-white/90 text-slate-800 shadow-md transition-transform hover:scale-110 active:scale-95 hover:bg-white"
                    >
                      <CameraIcon className="size-5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveThumbnail}
                      className="flex size-11 items-center justify-center rounded-xl bg-destructive/95 text-destructive-foreground shadow-md transition-transform hover:scale-110 active:scale-95 hover:bg-destructive"
                    >
                      <Trash2Icon className="size-5" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-3 py-6">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <UploadCloudIcon className="size-8 animate-pulse" />
                </div>
                <div className="space-y-1 px-2">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Tải ảnh đại diện</p>
                  <p className="text-xs text-muted-foreground">Kéo thả hoặc nhấp vào đây</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cột 2 & 3: Images Collection */}
        <div className="flex flex-col space-y-3 lg:col-span-2">
          <div>
            <p className="text-sm font-semibold">Bộ sưu tập hình ảnh phụ (Images)</p>
            <p className="text-xs text-muted-foreground">Các hình ảnh mô tả chi tiết khía cạnh khác của sản phẩm.</p>
          </div>

          <div className="flex flex-col space-y-4 rounded-2xl border bg-muted/10 p-4">
            {/* Drag drop images zone */}
            <div
              onDragEnter={handleImagesDrag}
              onDragOver={handleImagesDrag}
              onDragLeave={handleImagesDrag}
              onDrop={handleImagesDrop}
              onClick={() => imagesInputRef.current?.click()}
              className={`flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 text-center transition-all duration-300 ${
                isImagesDragActive
                  ? 'border-primary bg-primary/5 scale-[0.99]'
                  : 'border-muted-foreground/20 bg-background hover:border-primary/50 hover:bg-muted/10'
              }`}
            >
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <UploadCloudIcon className="size-7" />
                </div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Kéo thả nhiều ảnh phụ hoặc nhấp vào đây
                </p>
                <p className="text-xs text-muted-foreground">Hỗ trợ chọn nhiều hình ảnh cùng lúc</p>
              </div>
            </div>

            {/* Images list */}
            {allImages.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4">
                {allImages.map((img, index) => (
                  <div
                    key={`${img.url}-${index}`}
                    className="group relative aspect-square overflow-hidden rounded-xl border bg-background shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
                  >
                    <Image src={img.url} alt="Sub preview" fill className="object-cover" unoptimized />
                    <div className="absolute top-1.5 left-1.5">
                      {img.isLocal ? (
                        <span className="rounded bg-emerald-500/90 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-emerald-950 shadow-xs">
                          Mới
                        </span>
                      ) : (
                        <span className="rounded bg-sky-500/90 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-sky-950 shadow-xs">
                          Đã lưu
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (img.isLocal) {
                          handleRemoveImageFile(img.index)
                        } else {
                          handleRemoveServerImage(img.url)
                        }
                      }}
                      className="absolute top-1.5 right-1.5 flex size-7.5 items-center justify-center rounded-lg bg-black/40 text-white opacity-0 transition-opacity hover:bg-destructive group-hover:opacity-100 backdrop-blur-xs"
                    >
                      <XIcon className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {allImages.length > 0 && (
              <div className="flex justify-end gap-2 border-t pt-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => imagesInputRef.current?.click()}
                  className="h-8 gap-1.5 text-xs font-semibold"
                >
                  <ImageUpIcon className="size-4" />
                  Chọn thêm ảnh
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleClearAllImages}
                  className="h-8 gap-1.5 text-xs font-semibold"
                >
                  <Trash2Icon className="size-4" />
                  Xóa tất cả
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
