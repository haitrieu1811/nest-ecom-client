/* eslint-disable @typescript-eslint/no-explicit-any */

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
}

export default function InputAvatar({ file, profile, defaultAvatar, onChange, onCancel }: InputAvatarProps) {
  const inputAvatarRef = React.useRef<HTMLInputElement>(null)

  const avatarPreview = file ? URL.createObjectURL(file) : null

  const handleChangeAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    onChange?.(file)
  }

  return (
    <div className="space-y-4">
      <Avatar className="size-20">
        <AvatarImage src={avatarPreview || profile?.avatar || defaultAvatar || undefined} />
        <AvatarFallback>{profile?.email.slice(0, 2).toUpperCase() || 'UN'}</AvatarFallback>
      </Avatar>
      <input
        hidden
        ref={inputAvatarRef}
        type="file"
        accept="image/*"
        id="avatar"
        onChange={handleChangeAvatar}
        onClick={(e) => ((e.target as any).value = null)}
      />
      <div className="flex space-x-2">
        <Button type="button" variant="outline" onClick={() => inputAvatarRef.current?.click()}>
          Chọn ảnh đại diện
        </Button>
        {file && (
          <Button type="button" variant="destructive" onClick={onCancel}>
            Hủy bỏ
          </Button>
        )}
      </div>
    </div>
  )
}
