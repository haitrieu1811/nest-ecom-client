/* eslint-disable react-hooks/incompatible-library */
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import brandApi from '@/apis/brand.api'
import InputAvatar from '@/components/input-avatar'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import useUploadImages from '@/hooks/use-upload-images'
import { handleErrorFromAPI } from '@/lib/utils'
import {
  BrandIncludeTranslationsType,
  CreateBrandBodySchema,
  CreateBrandBodyType,
  CreateBrandResType,
  UpdateBrandResType,
} from '@/schemas/brand.schema'

type CreateBrandFormProps = {
  brandData?: BrandIncludeTranslationsType | null
  onCreateSuccess?: (payload: CreateBrandResType) => void
  onUpdateSuccess?: (payload: UpdateBrandResType) => void
}

export default function CreateBrandForm({ brandData, onCreateSuccess, onUpdateSuccess }: CreateBrandFormProps) {
  const [file, setFile] = React.useState<File | null>(null)

  const form = useForm<CreateBrandBodyType>({
    resolver: zodResolver(CreateBrandBodySchema),
    defaultValues: {
      name: '',
      description: '',
      logo: null,
    },
  })

  React.useEffect(() => {
    if (!brandData) return
    form.reset({
      name: brandData.name,
      description: brandData.description || '',
      logo: brandData.logo,
    })
  }, [brandData, form])

  const { uploadImagesMutation } = useUploadImages()

  const createBrandMutation = useMutation({
    mutationKey: ['create-brand'],
    mutationFn: brandApi.create,
    onSuccess: (data) => {
      toast.success('Tạo thương hiệu thành công')
      form.reset()
      setFile(null)
      onCreateSuccess?.(data.payload)
    },
    onError: (error) => {
      handleErrorFromAPI({
        error,
        setError: form.setError,
      })
    },
  })

  const updateBrandMutation = useMutation({
    mutationKey: ['update-brand'],
    mutationFn: brandApi.update,
    onSuccess: (data) => {
      toast.success('Cập nhật thương hiệu thành công')
      form.reset()
      setFile(null)
      onUpdateSuccess?.(data.payload)
    },
    onError: (error) => {
      handleErrorFromAPI({
        error,
        setError: form.setError,
      })
    },
  })

  const isPending = createBrandMutation.isPending || updateBrandMutation.isPending || uploadImagesMutation.isPending

  const onSubmit = form.handleSubmit(async (data) => {
    let logo = data.logo
    if (file) {
      const formData = new FormData()
      formData.append('files', file)
      const res = await uploadImagesMutation.mutateAsync(formData)
      logo = res.payload.data[0].url
    }
    const body = { ...data, logo }
    if (brandData) {
      return updateBrandMutation.mutate({ body, brandId: brandData.id })
    }
    createBrandMutation.mutate(body)
  })

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <InputAvatar
        file={file}
        defaultAvatar={form.watch('logo')}
        onChange={setFile}
        onCancel={() => setFile(null)}
        onRemoveDefault={() => form.setValue('logo', null, { shouldValidate: true })}
        title="Logo thương hiệu"
        description="PNG, JPG hoặc WEBP. Logo hiển thị chính thức của thương hiệu."
      />
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-input-name">Tên</FieldLabel>
              <Input
                {...field}
                id="form-rhf-input-name"
                aria-invalid={fieldState.invalid}
                placeholder="Nhập tên thương hiệu"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-textarea-description">Mô tả (không bắt buộc)</FieldLabel>
              <Textarea
                {...field}
                id="form-rhf-textarea-description"
                aria-invalid={fieldState.invalid}
                placeholder="Nhập mô tả thương hiệu (tùy chọn)"
                className="min-h-30"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <div className="flex justify-end">
        <Button disabled={isPending} type="submit">
          {isPending && <Spinner />}
          {brandData ? 'Cập nhật thương hiệu' : 'Tạo thương hiệu'}
        </Button>
      </div>
    </form>
  )
}
