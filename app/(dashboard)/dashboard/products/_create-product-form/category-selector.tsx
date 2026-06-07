'use client'

import { Controller, useFormContext } from 'react-hook-form'

import { useCreateProductFormContext } from '@/app/(dashboard)/dashboard/products/_create-product-form'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Field, FieldLabel } from '@/components/ui/field'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import useCategories from '@/hooks/use-categories'
import { CreateProductBodyType } from '@/schemas/product.schema'

export default function CategorySelector() {
  const form = useFormContext<CreateProductBodyType>()
  const selectedCategoryId = form.watch('categoryId')

  const { parentCategoryId, setParentCategoryId } = useCreateProductFormContext()

  // Lấy danh sách danh mục cha
  const { categories: parentCategories } = useCategories()
  // Lấy danh sách danh mục con dựa trên danh mục cha đã chọn
  const { categories: childCategories } = useCategories({
    enabled: parentCategoryId !== null,
    query: {
      parentId: parentCategoryId || undefined,
    },
  })

  return (
    <Field>
      <FieldLabel>Danh mục sản phẩm (không bắt buộc)</FieldLabel>
      <div className="rounded-xl border bg-linear-to-b from-background to-muted/20 p-4">
        <div className="grid items-start gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Danh mục cha</p>
              {selectedCategoryId ? <span className="text-xs text-muted-foreground">Đã chọn 1 danh mục</span> : null}
            </div>
            <RadioGroup
              value={parentCategoryId?.toString()}
              onValueChange={(value) => {
                const parentId = value ? parseInt(value) : null
                setParentCategoryId(parentId)
                form.setValue('categoryId', parentId, { shouldValidate: true })
              }}
            >
              {parentCategories.map((category) => {
                return (
                  <label
                    key={category.id}
                    className="group flex cursor-pointer items-start gap-3 rounded-lg border bg-background p-3 text-sm shadow-xs transition-colors hover:border-primary/30 hover:bg-primary/5 has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5"
                  >
                    <RadioGroupItem
                      value={category.id.toString()}
                      aria-invalid={!!form.formState.errors.categoryId}
                      className="mt-0.5"
                    />
                    <Avatar className="size-10 rounded-lg">
                      <AvatarImage src={category.logo || undefined} alt={category.name} className="object-cover" />
                      <AvatarFallback className="rounded-lg font-semibold">
                        {category.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-0.5">
                      <span className="font-medium leading-none">{category.name}</span>
                      <p className="text-xs text-muted-foreground">{category.description || 'Chưa có mô tả'}</p>
                    </div>
                  </label>
                )
              })}
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Danh mục con</p>
              {selectedCategoryId ? <span className="text-xs text-muted-foreground">Đã chọn 1 danh mục</span> : null}
            </div>
            {parentCategoryId ? (
              childCategories.length > 0 ? (
                <Controller
                  control={form.control}
                  name="categoryId"
                  render={({ field, fieldState }) => (
                    <RadioGroup
                      value={field.value?.toString()}
                      onValueChange={(value) => {
                        field.onChange(value ? parseInt(value) : null)
                      }}
                    >
                      {childCategories.map((childCategory) => {
                        return (
                          <Field key={childCategory.id} data-invalid={fieldState.invalid}>
                            <label className="group flex cursor-pointer items-start gap-3 rounded-lg border bg-background p-3 text-sm shadow-xs transition-colors hover:border-primary/30 hover:bg-primary/5 has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5">
                              <RadioGroupItem value={childCategory.id.toString()} className="mt-0.5" />
                              <Avatar className="size-10 rounded-lg">
                                <AvatarImage
                                  src={childCategory.logo || undefined}
                                  alt={childCategory.name}
                                  className="object-cover"
                                />
                                <AvatarFallback className="rounded-lg font-semibold">
                                  {childCategory.name.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="space-y-0.5">
                                <span className="font-medium leading-none">{childCategory.name}</span>
                                <p className="text-xs text-muted-foreground">
                                  {childCategory.description || 'Chưa có mô tả'}
                                </p>
                              </div>
                            </label>
                          </Field>
                        )
                      })}
                    </RadioGroup>
                  )}
                />
              ) : (
                <div className="rounded-lg border border-dashed bg-background px-3 py-2 text-xs text-muted-foreground">
                  Các danh mục cha đã chọn chưa có danh mục con.
                </div>
              )
            ) : (
              <div className="rounded-lg border border-dashed bg-background px-3 py-2 text-xs text-muted-foreground">
                Vui lòng chọn một danh mục cha để hiển thị danh mục con.
              </div>
            )}
          </div>
        </div>
      </div>
    </Field>
  )
}
