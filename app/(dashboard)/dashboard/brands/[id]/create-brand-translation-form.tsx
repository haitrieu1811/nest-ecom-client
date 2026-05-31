'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import brandApi from '@/apis/brand.api'
import { Button } from '@/components/ui/button'
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { handleErrorFromAPI } from '@/lib/utils'
import { useAppContext } from '@/providers/app.provider'
import {
  BrandTranslationType,
  CreateBrandTranslationBodySchema,
  CreateBrandTranslationBodyType,
  CreateBrandTranslationResType,
  UpdateBrandTranslationResType,
} from '@/schemas/brand-translation.schema'

type CreateBrandTranslationFormProps = {
  brandId: number
  brandTranslationData?: BrandTranslationType | null
  onCreateSuccess?: (payload: CreateBrandTranslationResType) => void
  onUpdateSuccess?: (payload: UpdateBrandTranslationResType) => void
}

export default function CreateBrandTranslationForm({
  brandId,
  brandTranslationData,
  onCreateSuccess,
  onUpdateSuccess,
}: CreateBrandTranslationFormProps) {
  const { languages } = useAppContext()

  const form = useForm<CreateBrandTranslationBodyType>({
    resolver: zodResolver(CreateBrandTranslationBodySchema),
    defaultValues: {
      name: '',
      description: '',
      languageId: brandTranslationData?.languageId,
      brandId,
    },
  })

  React.useEffect(() => {
    if (!brandTranslationData) return
    form.reset({
      name: brandTranslationData.name,
      description: brandTranslationData.description,
      languageId: brandTranslationData.languageId,
      brandId,
    })
  }, [brandTranslationData, brandId, form])

  const createBrandTranslationMutation = useMutation({
    mutationKey: ['create-brand-translation'],
    mutationFn: brandApi.createTranslation,
    onSuccess: (data) => {
      form.reset()
      toast.success('Tạo bản dịch thương hiệu thành công!')
      onCreateSuccess?.(data.payload)
    },
    onError: (error) => {
      handleErrorFromAPI({
        error,
        setError: form.setError,
      })
    },
  })

  const updateBrandTranslationMutation = useMutation({
    mutationKey: ['update-brand-translation'],
    mutationFn: brandApi.updateTranslation,
    onSuccess: (data) => {
      form.reset()
      toast.success('Cập nhật bản dịch thương hiệu thành công!')
      onUpdateSuccess?.(data.payload)
    },
    onError: (error) => {
      handleErrorFromAPI({
        error,
        setError: form.setError,
      })
    },
  })

  const isPending = createBrandTranslationMutation.isPending || updateBrandTranslationMutation.isPending

  const onSubmit = form.handleSubmit((data) => {
    if (brandTranslationData) {
      updateBrandTranslationMutation.mutate({
        body: data,
        translationId: brandTranslationData.id,
      })
      return
    }

    createBrandTranslationMutation.mutate(data)
  })

  return (
    <form onSubmit={onSubmit}>
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Tên</FieldLabel>
              <Input {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder="Nhập tên..." />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Mô tả</FieldLabel>
              <Textarea
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Nhập mô tả..."
                className="min-h-30"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="languageId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field orientation="responsive" data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldLabel htmlFor={field.name}>Ngôn ngữ</FieldLabel>
                <FieldDescription>Chọn ngôn ngữ cho bản dịch này.</FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </FieldContent>
              <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id={field.name} aria-invalid={fieldState.invalid} className="min-w-30">
                  <SelectValue placeholder="Chọn ngôn ngữ" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  {languages.map((language) => (
                    <SelectItem key={language.id} value={language.id}>
                      {language.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}
        />
        <div className="flex justify-end">
          <Button disabled={isPending} type="submit">
            {isPending && <Spinner />}
            {brandTranslationData ? 'Cập nhật bản dịch' : 'Thêm bản dịch'}
          </Button>
        </div>
      </FieldGroup>
    </form>
  )
}
