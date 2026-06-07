/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import { CameraIcon, ImageUpIcon, Trash2Icon, UploadCloudIcon } from 'lucide-react'
import React from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ProfileType } from '@/schemas/profile.schema'

type InputAvatarProps = {
  file: File | null
  profile?: ProfileType | null
  defaultAvatar?: string | null
  onChange?: (file: File | null) => void
  onCancel?: () => void
  onRemoveDefault?: () => void
  title?: string
  description?: string
}

export default function InputAvatar({
  file,
  profile,
  defaultAvatar,
  onChange,
  onCancel,
  onRemoveDefault,
  title = 'Ảnh đại diện',
  description = 'PNG, JPG hoặc WEBP. Nên dùng ảnh vuông để hiển thị đẹp hơn.',
}: InputAvatarProps) {
  const inputAvatarRef = React.useRef<HTMLInputElement>(null)

  const avatarPreview = file ? URL.createObjectURL(file) : null

  React.useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview)
      }
    }
  }, [avatarPreview])

  const handleChangeAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      onChange?.(selectedFile)
    }
  }

  const handleRemove = () => {
    if (file) {
      onCancel?.()
    } else {
      onRemoveDefault?.()
      onCancel?.()
    }
  }

  const activeAvatar = avatarPreview || (defaultAvatar !== undefined ? defaultAvatar : profile?.avatar) || null
  const isNewAvatar = !!avatarPreview

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-xs transition-all duration-300 hover:shadow-sm">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="relative group">
          <Avatar className="size-24 ring-4 ring-primary/10 shadow-md transition-all duration-300 group-hover:ring-primary/20">
            <AvatarImage src={activeAvatar || undefined} className="object-cover" />
            <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
              {profile?.email.slice(0, 2).toUpperCase() || 'UN'}
            </AvatarFallback>
          </Avatar>

          {activeAvatar && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 backdrop-blur-xs">
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => inputAvatarRef.current?.click()}
                  className="flex size-8 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-md transition-transform hover:scale-110 hover:bg-white"
                >
                  <CameraIcon className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="flex size-8 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-md transition-transform hover:scale-110"
                >
                  <Trash2Icon className="size-4" />
                </button>
              </div>
            </div>
          )}

          {!activeAvatar && (
            <div
              onClick={() => inputAvatarRef.current?.click()}
              className="absolute -right-1 -bottom-1 flex size-8 cursor-pointer items-center justify-center rounded-full border bg-primary text-primary-foreground shadow-md transition-transform hover:scale-110 active:scale-95"
            >
              <UploadCloudIcon className="size-4" />
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <p className="text-base font-bold text-slate-800 dark:text-slate-200">{title}</p>
            {activeAvatar && (
              <span
                className={`rounded-md px-1.5 py-0.5 text-[9px] font-semibold uppercase ${
                  isNewAvatar ? 'bg-emerald-500/90 text-emerald-950' : 'bg-sky-500/90 text-sky-950'
                }`}
              >
                {isNewAvatar ? 'Mới' : 'Đã lưu'}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground max-w-md leading-relaxed">{description}</p>
        </div>
      </div>

      <input
        hidden
        ref={inputAvatarRef}
        type="file"
        accept="image/*"
        id="avatar"
        onChange={handleChangeAvatar}
        onClick={(e) => ((e.target as any).value = null)}
      />

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputAvatarRef.current?.click()}
          className="h-9 gap-1.5 text-xs font-semibold"
        >
          <ImageUpIcon className="size-4" />
          {activeAvatar ? 'Đổi ảnh đại diện' : 'Chọn ảnh đại diện'}
        </Button>
        {activeAvatar && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleRemove}
            className="h-9 gap-1.5 text-xs font-semibold"
          >
            <Trash2Icon className="size-4" />
            Xóa ảnh
          </Button>
        )}
      </div>
    </div>
  )
}
