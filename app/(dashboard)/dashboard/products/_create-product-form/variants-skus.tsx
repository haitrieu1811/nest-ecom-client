'use client'

import React from 'react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'

import InputImages from '@/components/input-images'
import { InputNumber } from '@/components/input-number'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { CreateProductBodyType, SKUType, VariantsType } from '@/schemas/product.schema'
import { useCreateProductFormContext } from '@/app/(dashboard)/dashboard/products/_create-product-form'

const generateSKUs = (variants: VariantsType): Pick<SKUType, 'value' | 'price' | 'stock' | 'images'>[] => {
  const normalizedVariants = variants
    .map((variant) => ({
      value: variant.value.trim(),
      options: variant.options.map((option) => option.trim()).filter(Boolean),
    }))
    .filter((variant) => variant.value && variant.options.length > 0)

  if (normalizedVariants.length === 0) return []

  const combine = (arrays: string[][]): string[][] => {
    return arrays.reduce<string[][]>(
      (acc, options) => acc.flatMap((combo) => options.map((option) => [...combo, option])),
      [[]],
    )
  }

  return combine(normalizedVariants.map((v) => v.options)).map((combo) => ({
    value: combo.join('-'),
    price: 0,
    stock: 100,
    images: [],
  }))
}

export default function VariantsSkus() {
  const { skuForm, setSkuForm } = useCreateProductFormContext()
  const [expandedSkuImages, setExpandedSkuImages] = React.useState<Record<string, boolean>>({})

  const form = useFormContext<CreateProductBodyType>()
  const { control, register, setValue, formState } = form
  const { errors } = formState
  const variantsFieldArray = useFieldArray({
    control,
    name: 'variants',
  })

  const variants = useWatch({ control, name: 'variants' }) as VariantsType | undefined
  const skusFromForm = useWatch({ control, name: 'skus' })

  const visibleSkus = React.useMemo(() => generateSKUs((variants ?? []) as VariantsType), [variants])

  const syncedSkus = React.useMemo<Pick<SKUType, 'value' | 'price' | 'stock' | 'images'>[]>(
    () =>
      visibleSkus.map((sku) => {
        const formValue = skuForm[sku.value]
        const existingSku = skusFromForm?.find((s) => s.value === sku.value)

        return {
          value: sku.value,
          price: formValue?.price !== undefined ? formValue.price : sku.price,
          stock: formValue?.stock !== undefined ? formValue.stock : sku.stock,
          images: existingSku?.images || sku.images,
        }
      }),
    [skuForm, visibleSkus, skusFromForm],
  )

  React.useEffect(() => {
    setValue('skus', syncedSkus)
  }, [setValue, syncedSkus])

  const handleAddOption = (variantIndex: number) => {
    const currentOptions = variants?.[variantIndex]?.options ?? []
    setValue(`variants.${variantIndex}.options`, [...currentOptions, ''])
  }

  const handleRemoveOption = (variantIndex: number, optionIndex: number) => {
    const currentOptions = variants?.[variantIndex]?.options ?? []
    setValue(
      `variants.${variantIndex}.options`,
      currentOptions.filter((_, index) => index !== optionIndex),
    )
  }

  const handleAddVariant = () => {
    variantsFieldArray.append({
      value: '',
      options: [''],
    })
  }

  const handleRemoveVariant = (index: number) => {
    variantsFieldArray.remove(index)
  }

  const updateSkuField = (sku: string, field: 'price' | 'stock', value: number | undefined) => {
    setSkuForm((prev) => ({
      ...prev,
      [sku]: {
        ...(prev[sku] || { price: undefined, stock: undefined, images: [] }),
        [field]: value,
      },
    }))
  }

  const updateSkuImages = (sku: string, images: File[]) => {
    setSkuForm((prev) => ({
      ...prev,
      [sku]: {
        ...(prev[sku] || { price: undefined, stock: undefined, images: [] }),
        images,
      },
    }))
  }

  const handleRemoveSkuServerImage = (skuValue: string, urlToRemove: string) => {
    const currentSkus = form.getValues('skus') || []
    const updatedSkus = currentSkus.map((s) => {
      if (s.value === skuValue) {
        return {
          ...s,
          images: s.images.filter((url) => url !== urlToRemove),
        }
      }
      return s
    })
    setValue('skus', updatedSkus, { shouldValidate: true })
  }

  const handleClearAllSkuServerImages = (skuValue: string) => {
    const currentSkus = form.getValues('skus') || []
    const updatedSkus = currentSkus.map((s) => {
      if (s.value === skuValue) {
        return {
          ...s,
          images: [],
        }
      }
      return s
    })
    setValue('skus', updatedSkus, { shouldValidate: true })
  }

  const toggleSkuImages = (sku: string) => {
    setExpandedSkuImages((prev) => ({
      ...prev,
      [sku]: !prev[sku],
    }))
  }

  return (
    <div className="space-y-6 rounded-2xl border bg-linear-to-b from-background to-muted/20 p-5 shadow-sm">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-base font-semibold">Phân loại hàng & SKU</p>
          <p className="text-sm text-muted-foreground">
            Toàn bộ cấu hình phân loại hàng và SKU nằm chung một khu vực bên dưới.
          </p>
        </div>
        <div className="rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground">
          {visibleSkus.length > 0 ? `${visibleSkus.length} SKU đang được sinh` : 'Chưa có SKU nào'}
        </div>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Field>
          <FieldLabel>Phân loại hàng</FieldLabel>
          <FieldDescription>Nhập tên phân loại hàng và các tùy chọn. Thêm tùy chọn bằng nút bên dưới.</FieldDescription>
          <div className="rounded-xl border bg-background p-4 shadow-xs">
            <div className="mb-4">
              <Button type="button" variant="outline" size="sm" onClick={handleAddVariant}>
                Thêm phân loại hàng
              </Button>
            </div>
            <div className="space-y-3">
              {variantsFieldArray.fields.length === 0 && (
                <div className="rounded-lg border border-dashed bg-background p-4 text-sm text-muted-foreground">
                  Chưa có phân loại hàng nào. Nhấn &quot;Thêm phân loại hàng&quot; để bắt đầu.
                </div>
              )}
              {variantsFieldArray.fields.map((field, index) => {
                const currentOptions = variants?.[index]?.options ?? field.options
                return (
                  <div key={field.id} className="rounded-lg border bg-muted/30 p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <p className="text-sm font-semibold">Phân loại hàng {index + 1}</p>
                        <p className="text-xs text-muted-foreground">Định nghĩa nhóm thuộc tính cho SKU.</p>
                      </div>
                      <Button type="button" variant="outline" size="sm" onClick={() => handleRemoveVariant(index)}>
                        Xóa
                      </Button>
                    </div>
                    <div className="grid gap-4">
                      <Field data-invalid={!!errors?.variants?.[index]?.value}>
                        <FieldLabel htmlFor={`variant-name-${field.id}`}>Tên phân loại hàng</FieldLabel>
                        <Input
                          id={`variant-name-${field.id}`}
                          placeholder="Ví dụ: Màu sắc"
                          aria-invalid={!!errors?.variants?.[index]?.value}
                          {...register(`variants.${index}.value` as const, {
                            required: 'Tên phân loại hàng là bắt buộc',
                          })}
                        />
                        {errors?.variants?.[index]?.value?.message ? (
                          <p className="text-sm text-destructive">{errors.variants[index].value?.message}</p>
                        ) : null}
                      </Field>
                      <Field>
                        <FieldLabel>Các tùy chọn</FieldLabel>
                        <div className="space-y-2">
                          {currentOptions.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex gap-2">
                              <Field data-invalid={!!errors?.variants?.[index]?.options?.[optionIndex]}>
                                <Input
                                  placeholder={`Tùy chọn ${optionIndex + 1}`}
                                  aria-invalid={!!errors?.variants?.[index]?.options?.[optionIndex]}
                                  {...register(`variants.${index}.options.${optionIndex}` as const, {
                                    required: 'Tùy chọn là bắt buộc',
                                  })}
                                />
                                {errors?.variants?.[index]?.options?.[optionIndex]?.message ? (
                                  <p className="text-sm text-destructive">
                                    {errors.variants[index].options?.[optionIndex]?.message}
                                  </p>
                                ) : null}
                              </Field>
                              {currentOptions.length > 1 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRemoveOption(index, optionIndex)}
                                >
                                  Xóa
                                </Button>
                              )}
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddOption(index)}
                            className="w-full"
                          >
                            + Thêm option
                          </Button>
                        </div>
                      </Field>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </Field>

        <Field>
          <FieldLabel>Danh sách SKU sinh từ variants</FieldLabel>
          <FieldDescription>Mỗi SKU có thể nhập giá, stock và thêm nhiều hình ảnh riêng.</FieldDescription>
          <div className="rounded-xl border bg-background p-4 shadow-xs">
            {visibleSkus.length > 0 ? (
              <div className="space-y-3">
                <div className="grid gap-3 rounded-lg bg-muted/30 p-3 text-xs text-muted-foreground sm:grid-cols-[2fr_1fr_1fr_auto]">
                  <div className="font-medium">SKU</div>
                  <div className="font-medium">Giá</div>
                  <div className="font-medium">Stock</div>
                  <div className="text-right font-medium">Ảnh</div>
                </div>

                {visibleSkus.map((sku) => {
                  const imageCount = skuForm[sku.value]?.images?.length ?? 0
                  const isExpanded = !!expandedSkuImages[sku.value]

                  return (
                    <div key={sku.value} className="rounded-lg bg-muted/20">
                      <div className="grid gap-3 p-3 sm:grid-cols-[2fr_1fr_1fr_auto] sm:items-center">
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{sku.value}</p>
                          <p className="text-xs text-muted-foreground">SKU tự sinh từ variant</p>
                        </div>
                        <Field className="min-w-0">
                          <FieldLabel htmlFor={`sku-price-${sku.value}`} className="text-xs">
                            Giá
                          </FieldLabel>
                          <InputNumber
                            id={`sku-price-${sku.value}`}
                            placeholder="28.990.000"
                            value={skuForm[sku.value]?.price}
                            onChange={(value) => updateSkuField(sku.value, 'price', value)}
                          />
                        </Field>
                        <Field className="min-w-0">
                          <FieldLabel htmlFor={`sku-stock-${sku.value}`} className="text-xs">
                            Stock
                          </FieldLabel>
                          <InputNumber
                            id={`sku-stock-${sku.value}`}
                            placeholder="120"
                            value={skuForm[sku.value]?.stock}
                            onChange={(value) => updateSkuField(sku.value, 'stock', value)}
                          />
                        </Field>
                        <div className="flex flex-col items-end gap-2">
                          <span className="text-xs text-muted-foreground">{imageCount} ảnh</span>
                          <Button type="button" variant="outline" size="sm" onClick={() => toggleSkuImages(sku.value)}>
                            {isExpanded ? 'Ẩn ảnh' : 'Chỉnh ảnh'}
                          </Button>
                        </div>
                      </div>

                      {isExpanded ? (
                        <div className="border-t border-slate-200 bg-background p-3">
                          <Field>
                            <InputImages
                              files={skuForm[sku.value]?.images || []}
                              defaultImages={
                                skusFromForm?.find((s) => s.value === sku.value)?.images || []
                              }
                              onChange={(files) => updateSkuImages(sku.value, files)}
                              onCancel={() => updateSkuImages(sku.value, [])}
                              onRemoveDefault={(url) => handleRemoveSkuServerImage(sku.value, url)}
                              onRemoveAllDefault={() => handleClearAllSkuServerImages(sku.value)}
                              title="Hình ảnh SKU"
                              description="Các hình ảnh riêng biệt mô tả chi tiết của SKU này."
                            />
                          </Field>
                        </div>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed bg-background p-4 text-sm text-muted-foreground">
                Chưa có SKU. Vui lòng nhập tên variant và options.
              </div>
            )}
          </div>
        </Field>
      </div>
    </div>
  )
}
