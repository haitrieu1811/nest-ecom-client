'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import categoryApi from '@/apis/category.api'
import { Button } from '@/components/ui/button'
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { handleErrorFromAPI } from '@/lib/utils'
import { useAppContext } from '@/providers/app.provider'
import {
  CategoryTranslationType,
  CreateCategoryTranslationBodySchema,
  CreateCategoryTranslationBodyType,
  CreateCategoryTranslationResType,
  UpdateCategoryTranslationResType,
} from '@/schemas/category-translation.schema'

type CreateCategoryTranslationFormProps = {
  categoryId: number
  categoryTranslationData?: CategoryTranslationType | null
  onCreateSuccess?: (payload: CreateCategoryTranslationResType) => void
  onUpdateSuccess?: (payload: UpdateCategoryTranslationResType) => void
}

export default function CreateCategoryTranslationForm({
  categoryId,
  categoryTranslationData,
  onCreateSuccess,
  onUpdateSuccess,
}: CreateCategoryTranslationFormProps) {
  const { languages } = useAppContext()

  const form = useForm<CreateCategoryTranslationBodyType>({
    resolver: zodResolver(CreateCategoryTranslationBodySchema),
    defaultValues: {
      name: '',
      description: '',
      languageId: categoryTranslationData?.languageId,
      categoryId,
    },
  })

  React.useEffect(() => {
    if (!categoryTranslationData) return
    form.reset({
      name: categoryTranslationData.name,
      description: categoryTranslationData.description,
      languageId: categoryTranslationData.languageId,
      categoryId,
    })
  }, [categoryTranslationData, categoryId, form])

  const createCategoryTranslationMutation = useMutation({
    mutationKey: ['create-category-translation'],
    mutationFn: categoryApi.createTranslation,
    onSuccess: (data) => {
      form.reset()
      toast.success('Tạo bản dịch danh mục thành công!')
      onCreateSuccess?.(data.payload)
    },
    onError: (error) => {
      handleErrorFromAPI({
        error,
        setError: form.setError,
      })
    },
  })

  const updateCategoryTranslationMutation = useMutation({
    mutationKey: ['update-category-translation'],
    mutationFn: categoryApi.updateTranslation,
    onSuccess: (data) => {
      form.reset()
      toast.success('Cập nhật bản dịch danh mục thành công!')
      onUpdateSuccess?.(data.payload)
    },
    onError: (error) => {
      handleErrorFromAPI({
        error,
        setError: form.setError,
      })
    },
  })

  const isPending = createCategoryTranslationMutation.isPending || updateCategoryTranslationMutation.isPending

  const onSubmit = form.handleSubmit((data) => {
    if (categoryTranslationData) {
      updateCategoryTranslationMutation.mutate({
        body: data,
        translationId: categoryTranslationData.id,
      })
      return
    }
    createCategoryTranslationMutation.mutate(data)
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
            {categoryTranslationData ? 'Cập nhật bản dịch' : 'Thêm bản dịch'}
          </Button>
        </div>
      </FieldGroup>
    </form>
  )
}
