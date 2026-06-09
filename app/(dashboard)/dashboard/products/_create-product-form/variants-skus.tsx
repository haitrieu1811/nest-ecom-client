/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import { ImageUpIcon, XIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

import { useCreateProductFormContext } from '@/app/(dashboard)/dashboard/products/_create-product-form'
import { InputNumber } from '@/components/input-number'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { CreateProductBodyType, SKUType, VariantsType } from '@/schemas/product.schema'

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

interface VariantOptionImageUploaderProps {
  optionValue: string
  visibleSkus: Pick<SKUType, 'value' | 'price' | 'stock' | 'images'>[]
  skuForm: Record<string, import('@/app/(dashboard)/dashboard/products/_create-product-form').SkuFormValue>
  skusFromForm: Pick<SKUType, 'value' | 'price' | 'stock' | 'images'>[] | undefined
  setSkuForm: React.Dispatch<
    React.SetStateAction<
      Record<string, import('@/app/(dashboard)/dashboard/products/_create-product-form').SkuFormValue>
    >
  >
  setValue: any
  form: any
}

function VariantOptionImageUploader({
  optionValue,
  visibleSkus,
  skuForm,
  skusFromForm,
  setSkuForm,
  setValue,
  form,
}: VariantOptionImageUploaderProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const matchingSkuValues = React.useMemo(() => {
    return visibleSkus.map((s) => s.value).filter((val) => val === optionValue || val.startsWith(optionValue + '-'))
  }, [visibleSkus, optionValue])

  const repSkuValue = matchingSkuValues[0]

  const previewUrl = React.useMemo(() => {
    if (!repSkuValue) return null

    const localFiles = skuForm[repSkuValue]?.images || []
    if (localFiles.length > 0) {
      return URL.createObjectURL(localFiles[0])
    }

    const serverImages = skusFromForm?.find((s) => s.value === repSkuValue)?.images || []
    if (serverImages.length > 0) {
      return serverImages[0]
    }

    return null
  }, [repSkuValue, skuForm, skusFromForm])

  React.useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setSkuForm((prev: any) => {
      const updated = { ...prev }
      matchingSkuValues.forEach((val) => {
        updated[val] = {
          ...(updated[val] || { price: undefined, stock: undefined, images: [] }),
          images: files,
        }
      })
      return updated
    })
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    setSkuForm((prev: any) => {
      const updated = { ...prev }
      matchingSkuValues.forEach((val) => {
        updated[val] = {
          ...(updated[val] || { price: undefined, stock: undefined, images: [] }),
          images: [],
        }
      })
      return updated
    })
    const currentSkus = form.getValues('skus') || []
    const updatedSkus = currentSkus.map((s: any) => {
      if (matchingSkuValues.includes(s.value)) {
        return {
          ...s,
          images: [],
        }
      }
      return s
    })
    setValue('skus', updatedSkus, { shouldValidate: true })
  }

  return (
    <div className="relative size-10 shrink-0 mt-1 mx-auto">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      {previewUrl ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="group relative size-full cursor-pointer overflow-hidden rounded-md border border-border shadow-xs hover:border-primary/50"
        >
          <Image src={previewUrl} alt={optionValue} fill className="object-cover" unoptimized />
          <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
            <button
              type="button"
              onClick={handleRemove}
              className="rounded-full bg-destructive p-0.5 text-white hover:bg-destructive/80 transition-colors shadow-xs"
            >
              <XIcon className="size-2.5" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex size-full flex-col items-center justify-center rounded-md border border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary"
        >
          <ImageUpIcon className="size-3.5 text-primary" />
        </button>
      )}
    </div>
  )
}

export default function VariantsSkus() {
  const { skuForm, setSkuForm } = useCreateProductFormContext()
  const [bulkPrice, setBulkPrice] = React.useState<number | undefined>(undefined)
  const [bulkStock, setBulkStock] = React.useState<number | undefined>(undefined)

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

  const normalizedVariants = React.useMemo(() => {
    return (variants ?? [])
      .map((variant) => ({
        value: variant.value.trim(),
        options: variant.options.map((option) => option.trim()).filter(Boolean),
      }))
      .filter((variant) => variant.value && variant.options.length > 0)
  }, [variants])

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

  const handleApplyBulk = () => {
    if (bulkPrice === undefined && bulkStock === undefined) {
      toast.warning('Vui lòng nhập giá hoặc số lượng để áp dụng')
      return
    }

    setSkuForm((prev) => {
      const updated = { ...prev }
      visibleSkus.forEach((sku) => {
        updated[sku.value] = {
          ...(updated[sku.value] || { price: undefined, stock: undefined, images: [] }),
          ...(bulkPrice !== undefined ? { price: bulkPrice } : {}),
          ...(bulkStock !== undefined ? { stock: bulkStock } : {}),
        }
      })
      return updated
    })
    toast.success('Đã áp dụng giá trị cho tất cả SKU thành công')
  }

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
      <div className="space-y-6">
        <Field>
          <FieldLabel>Phân loại hàng</FieldLabel>
          <FieldDescription>Nhập tên phân loại hàng và các tùy chọn. Thêm tùy chọn bằng nút bên dưới.</FieldDescription>
          <div className="rounded-xl border bg-background p-4 shadow-xs">
            <div className="mb-4">
              <Button type="button" variant="outline" size="sm" onClick={handleAddVariant}>
                Thêm phân loại hàng
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
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
                {/* Panel điền nhanh tất cả SKU */}
                <div className="mb-4 rounded-xl border border-primary/20 bg-primary/5 p-3.5 space-y-2">
                  <p className="text-xs font-bold text-primary">Điền nhanh cho tất cả SKU</p>
                  <div className="flex flex-wrap items-end gap-3">
                    <div className="flex-1 min-w-[120px]">
                      <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                        Giá áp dụng chung
                      </label>
                      <InputNumber placeholder="Nhập giá..." value={bulkPrice} onChange={setBulkPrice} />
                    </div>
                    <div className="flex-1 min-w-[100px]">
                      <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                        Stock áp dụng chung
                      </label>
                      <InputNumber placeholder="Nhập số lượng..." value={bulkStock} onChange={setBulkStock} />
                    </div>
                    <Button type="button" size="sm" onClick={handleApplyBulk} className="shrink-0">
                      Áp dụng chung
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-border bg-card">
                  <table className="w-full border-collapse text-left text-sm text-foreground table-fixed">
                    <thead>
                      <tr className="border-b bg-muted/40 font-medium text-muted-foreground text-xs">
                        {normalizedVariants.map((v, idx) => (
                          <th
                            key={v.value}
                            className={`p-3 border-r border-border font-semibold text-slate-700 dark:text-slate-300 ${idx === 0 ? 'w-[90px] text-center' : 'w-[150px]'}`}
                          >
                            {v.value}
                          </th>
                        ))}
                        <th className="p-3 border-r border-border font-semibold text-slate-700 dark:text-slate-300 w-[220px]">
                          <span className="text-destructive mr-0.5">*</span>Giá
                        </th>
                        <th className="p-3 border-r border-border font-semibold text-slate-700 dark:text-slate-300 w-[180px]">
                          <span className="text-destructive mr-0.5">*</span>Kho hàng
                        </th>
                        <th className="p-3 font-semibold text-slate-700 dark:text-slate-300 w-[260px]">
                          SKU phân loại
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {visibleSkus.map((sku, r) => {
                        return (
                          <tr key={sku.value} className="hover:bg-muted/10 transition-colors">
                            {normalizedVariants.map((variant, colIndex) => {
                              // Calculate rowspan
                              let rowspan = 1
                              for (let j = colIndex + 1; j < normalizedVariants.length; j++) {
                                rowspan *= normalizedVariants[j].options.length
                              }

                              // Determine if this cell should be rendered
                              if (r % rowspan !== 0) return null

                              // Find option value
                              const optionIndex = Math.floor(r / rowspan) % variant.options.length
                              const optionValue = variant.options[optionIndex]

                              return (
                                <td
                                  key={variant.value}
                                  rowSpan={rowspan}
                                  className="p-3 border-r border-border align-middle text-center"
                                >
                                  <div className="flex flex-col items-center justify-center gap-1">
                                    <span className="font-medium text-xs text-slate-800 dark:text-slate-200">
                                      {optionValue}
                                    </span>
                                    {/* Render image uploader ONLY on the first variant column */}
                                    {colIndex === 0 && (
                                      <VariantOptionImageUploader
                                        optionValue={optionValue}
                                        visibleSkus={visibleSkus}
                                        skuForm={skuForm}
                                        skusFromForm={skusFromForm}
                                        setSkuForm={setSkuForm}
                                        setValue={setValue}
                                        form={form}
                                      />
                                    )}
                                  </div>
                                </td>
                              )
                            })}

                            {/* Giá Input */}
                            <td className="p-3 border-r border-border align-middle">
                              <div className="relative flex items-center">
                                <span className="absolute left-2.5 text-xs text-muted-foreground font-semibold">đ</span>
                                <InputNumber
                                  id={`sku-price-${sku.value}`}
                                  placeholder="Nhập giá"
                                  className="pl-6 h-9 text-xs"
                                  value={skuForm[sku.value]?.price}
                                  onChange={(value) => updateSkuField(sku.value, 'price', value)}
                                />
                              </div>
                            </td>

                            {/* Stock Input */}
                            <td className="p-3 border-r border-border align-middle">
                              <InputNumber
                                id={`sku-stock-${sku.value}`}
                                placeholder="Nhập số lượng"
                                className="h-9 text-xs"
                                value={skuForm[sku.value]?.stock}
                                onChange={(value) => updateSkuField(sku.value, 'stock', value)}
                              />
                            </td>

                            {/* SKU Input */}
                            <td className="p-3 align-middle">
                              <Input
                                disabled
                                value={sku.value}
                                className="h-9 text-xs bg-muted/30 text-muted-foreground border-dashed"
                              />
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
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
