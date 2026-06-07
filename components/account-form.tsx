/* eslint-disable react-hooks/incompatible-library */

'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import profileApi from '@/apis/profile.api'
import InputAvatar from '@/components/input-avatar'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import useUploadImages from '@/hooks/use-upload-images'
import { useAppStore } from '@/providers/app.provider'
import { UpdateProfileBodySchema, UpdateProfileBodyType } from '@/schemas/profile.schema'

export default function AccountForm() {
  const { setProfile } = useAppStore()

  const [avatarFile, setAvatarFile] = React.useState<File | null>(null)

  const { uploadImagesMutation } = useUploadImages()

  const getProfileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: () => profileApi.getProfile(),
  })

  const profile = getProfileQuery.data?.payload

  const form = useForm<UpdateProfileBodyType>({
    resolver: zodResolver(UpdateProfileBodySchema),
    defaultValues: {
      name: profile?.name || null,
      phoneNumber: profile?.phoneNumber || null,
      avatar: profile?.avatar || null,
    },
  })

  React.useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name,
        phoneNumber: profile.phoneNumber,
        avatar: profile.avatar,
      })
    }
  }, [profile, form])

  const updateProfileMutation = useMutation({
    mutationKey: ['update-profile'],
    mutationFn: profileApi.updateProfile,
    onSuccess: (data) => {
      getProfileQuery.refetch()
      toast.success('Cập nhật hồ sơ thành công')
      setProfile(data.payload)
      setAvatarFile(null)
    },
  })

  const isPending = uploadImagesMutation.isPending || updateProfileMutation.isPending

  const onSubmit = form.handleSubmit(async (data) => {
    let avatarUrl = data.avatar
    if (avatarFile) {
      const formData = new FormData()
      formData.append('files', avatarFile)
      const res = await uploadImagesMutation.mutateAsync(formData)
      avatarUrl = res.payload.data[0].url
    }
    updateProfileMutation.mutate({ ...data, avatar: avatarUrl })
  })

  return (
    <form className="space-y-7" onSubmit={onSubmit}>
      <InputAvatar
        file={avatarFile}
        profile={profile}
        defaultAvatar={form.watch('avatar')}
        onChange={(file) => setAvatarFile(file)}
        onCancel={() => setAvatarFile(null)}
        onRemoveDefault={() => form.setValue('avatar', null, { shouldValidate: true })}
        title="Ảnh cá nhân"
        description="Ảnh đại diện tài khoản cá nhân của bạn."
      />
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="fullname">Họ và tên</FieldLabel>
              <Input
                {...field}
                id="fullname"
                value={field.value ? field.value : ''}
                aria-invalid={fieldState.invalid}
                placeholder="shadcn"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="phoneNumber"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="phoneNumber">Số điện thoại</FieldLabel>
              <Input
                {...field}
                id="phoneNumber"
                value={field.value ? field.value : ''}
                aria-invalid={fieldState.invalid}
                placeholder="0123456789"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <Button disabled={isPending} type="submit">
        {isPending && <Spinner />}
        Cập nhật
      </Button>
    </form>
  )
}
