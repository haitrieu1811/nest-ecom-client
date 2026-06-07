/* eslint-disable react-hooks/incompatible-library */

'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import categoryApi from '@/apis/category.api'
import InputAvatar from '@/components/input-avatar'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import useUploadImages from '@/hooks/use-upload-images'
import { handleErrorFromAPI } from '@/lib/utils'
import {
  CategoryIncludeTranslationsType,
  CreateCategoryBodySchema,
  CreateCategoryBodyType,
  CreateCategoryResType,
  UpdateCategoryResType,
} from '@/schemas/category.schema'

type CreateCategoryFormProps = {
  categoryData?: CategoryIncludeTranslationsType | null
  createWithParentId?: number | null // Nếu có thì sẽ tạo danh mục con của parentId này, ngược lại sẽ tạo danh mục gốc
  onCreateSuccess?: (payload: CreateCategoryResType) => void
  onUpdateSuccess?: (payload: UpdateCategoryResType) => void
}

export default function CreateCategoryForm({
  categoryData,
  createWithParentId = null,
  onCreateSuccess,
  onUpdateSuccess,
}: CreateCategoryFormProps) {
  const [file, setFile] = React.useState<File | null>(null)

  const form = useForm<CreateCategoryBodyType>({
    resolver: zodResolver(CreateCategoryBodySchema),
    defaultValues: {
      name: '',
      description: '',
      logo: null,
      parentId: createWithParentId,
    },
  })

  // Nếu có categoryData thì điền vào form để cập nhật, ngược lại để trống để tạo mới
  React.useEffect(() => {
    if (!categoryData) return
    form.reset({
      name: categoryData.name,
      description: categoryData.description || '',
      logo: categoryData.logo,
      parentId: categoryData.parentId,
    })
  }, [categoryData, form])

  const { uploadImagesMutation } = useUploadImages()

  const createCategoryMutation = useMutation({
    mutationKey: ['create-category'],
    mutationFn: categoryApi.create,
    onSuccess: (data) => {
      toast.success('Tạo danh mục thành công')
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

  const updateCategoryMutation = useMutation({
    mutationKey: ['update-category'],
    mutationFn: categoryApi.update,
    onSuccess: (data) => {
      toast.success('Cập nhật danh mục thành công')
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

  const isPending =
    createCategoryMutation.isPending || updateCategoryMutation.isPending || uploadImagesMutation.isPending

  const onSubmit = form.handleSubmit(async (data) => {
    let logo = data.logo
    if (file) {
      const formData = new FormData()
      formData.append('files', file)
      const res = await uploadImagesMutation.mutateAsync(formData)
      logo = res.payload.data[0].url
    }
    const body = { ...data, logo }
    if (categoryData) {
      return updateCategoryMutation.mutate({ body, categoryId: categoryData.id })
    }
    createCategoryMutation.mutate(body)
  })

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <InputAvatar
        file={file}
        defaultAvatar={form.watch('logo')}
        onChange={setFile}
        onCancel={() => setFile(null)}
        onRemoveDefault={() => form.setValue('logo', null, { shouldValidate: true })}
        title="Logo danh mục"
        description="PNG, JPG hoặc WEBP. Logo hiển thị của danh mục sản phẩm."
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
                placeholder="Nhập tên danh mục"
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
                placeholder="Nhập mô tả danh mục (tùy chọn)"
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
          {categoryData ? 'Cập nhật danh mục' : 'Tạo danh mục'}
        </Button>
      </div>
    </form>
  )
}
