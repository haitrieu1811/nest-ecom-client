'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

import PATH from '@/constants/path'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { manageProductApi } from '@/apis/product.api'
import ProductCategorySelector from '@/app/(dashboard)/dashboard/products/_create-product-form/category-selector'
import ProductMediaUploader from '@/app/(dashboard)/dashboard/products/_create-product-form/product-media-uploader'
import PublishDate from '@/app/(dashboard)/dashboard/products/_create-product-form/publish-date'
import VariantsSkus from '@/app/(dashboard)/dashboard/products/_create-product-form/variants-skus'
import { InputNumber } from '@/components/input-number'
import RichTextEditor from '@/components/rich-text-editor'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Spinner } from '@/components/ui/spinner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useBrands from '@/hooks/use-brands'
import useUploadImages from '@/hooks/use-upload-images'
import { handleErrorFromAPI } from '@/lib/utils'
import {
  CreateProductBodySchema,
  CreateProductBodyType,
  CreateProductResType,
  ProductDetailType,
  UpdateProductResType,
} from '@/schemas/product.schema'

export type SkuFormValue = {
  price: number | undefined
  stock: number | undefined
  images: File[]
}

type CreateProductFormContext = {
  parentCategoryId: number | null
  setParentCategoryId: React.Dispatch<React.SetStateAction<number | null>>
  skuForm: Record<string, SkuFormValue>
  setSkuForm: React.Dispatch<React.SetStateAction<Record<string, SkuFormValue>>>
}

const initialCreateProductFormContext: CreateProductFormContext = {
  parentCategoryId: null,
  setParentCategoryId: () => {},
  skuForm: {},
  setSkuForm: () => {},
}

const CreateProductFormContext = React.createContext<CreateProductFormContext>(initialCreateProductFormContext)

type CreateProductFormProps = {
  productData?: ProductDetailType | null
  onCreateSuccess?: (payload: CreateProductResType) => void
  onUpdateSuccess?: (payload: UpdateProductResType) => void
}

export const useCreateProductFormContext = () => React.useContext(CreateProductFormContext)

export default function CreateProductForm({ productData, onCreateSuccess, onUpdateSuccess }: CreateProductFormProps) {
  const router = useRouter()

  const [parentCategoryId, setParentCategoryId] = React.useState<number | null>(
    initialCreateProductFormContext.parentCategoryId,
  )
  const [thumbnailFile, setThumbnailFile] = React.useState<File | null>(null)
  const [imagesFiles, setImagesFiles] = React.useState<File[]>([])
  const [skuForm, setSkuForm] = React.useState<Record<string, SkuFormValue>>({})

  const form = useForm<CreateProductBodyType>({
    resolver: zodResolver(CreateProductBodySchema),
    defaultValues: {
      name: '',
      description: '',
      basePrice: 0,
      virtualPrice: 0,
      thumbnail: null,
      images: [],
      variants: [],
      publishedAt: null,
      brandId: null,
      categoryId: null,
      skus: [],
    },
  })

  // Cập nhật form khi có productData
  React.useEffect(() => {
    if (!productData) return
    form.reset({
      name: productData.name,
      description: productData.description,
      basePrice: productData.basePrice,
      virtualPrice: productData.virtualPrice,
      thumbnail: productData.thumbnail,
      images: productData.images,
      variants: productData.variants,
      publishedAt: productData.publishedAt,
      brandId: productData.brandId,
      categoryId: productData.categoryId,
      skus: productData.skus.map((sku) => ({
        value: sku.value,
        price: sku.price,
        stock: sku.stock,
        images: sku.images,
      })),
    })

    const initialSkuForm: Record<string, SkuFormValue> = {}
    productData.skus.forEach((sku) => {
      if (sku.value) {
        initialSkuForm[sku.value] = {
          price: sku.price !== undefined && sku.price !== null ? Number(sku.price) : undefined,
          stock: sku.stock !== undefined && sku.stock !== null ? Number(sku.stock) : undefined,
          images: [],
        }
      }
    })
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSkuForm(initialSkuForm)

    if (productData.category) {
      if (productData.category.parentId) {
        setParentCategoryId(productData.category.parentId)
      } else {
        setParentCategoryId(productData.categoryId)
      }
    } else {
      setParentCategoryId(null)
    }
  }, [productData, form, setParentCategoryId])

  const createProductMutation = useMutation({
    mutationKey: ['create-product'],
    mutationFn: manageProductApi.create,
    onSuccess: (data) => {
      form.reset()
      setSkuForm({})
      toast.success('Thêm sản phẩm thành công')
      onCreateSuccess?.(data.payload)
    },
    onError: (error) => {
      handleErrorFromAPI({
        error,
        setError: form.setError,
      })
    },
  })

  const updateProductMutation = useMutation({
    mutationKey: ['update-product'],
    mutationFn: manageProductApi.update,
    onSuccess: (data) => {
      toast.success('Cập nhật sản phẩm thành công')
      setThumbnailFile(null)
      setImagesFiles([])
      router.refresh()
      onUpdateSuccess?.(data.payload)
    },
    onError: (error) => {
      handleErrorFromAPI({
        error,
        setError: form.setError,
      })
    },
  })

  const { brands } = useBrands()
  const { uploadImagesMutation } = useUploadImages()

  const isPending = createProductMutation.isPending || uploadImagesMutation.isPending || updateProductMutation.isPending

  const onSubmit = form.handleSubmit(
    async (data) => {
      let thumbnail = data.thumbnail
      let images = data.images
      // Nếu có thumbnailFile thì upload lên và set thumbnail cho form
      if (thumbnailFile) {
        const formData = new FormData()
        formData.append('files', thumbnailFile)
        const res = await uploadImagesMutation.mutateAsync(formData)
        thumbnail = res.payload.data[0].url
      }
      // Nếu có imagesFiles thì upload lên và set images cho form
      if (imagesFiles.length > 0) {
        const formData = new FormData()
        imagesFiles.forEach((file) => formData.append('files', file))
        const res = await uploadImagesMutation.mutateAsync(formData)
        images = data.images.concat(res.payload.data.map((image) => image.url))
      }

      const uploadedSkus = await Promise.all(
        data.skus.map(async (sku) => {
          const skuFiles = skuForm[sku.value]?.images || []
          let skuImages = sku.images || []
          if (skuFiles.length > 0) {
            const formData = new FormData()
            skuFiles.forEach((file) => formData.append('files', file))
            const res = await uploadImagesMutation.mutateAsync(formData)
            skuImages = skuImages.concat(res.payload.data.map((image) => image.url))
          }
          return {
            value: sku.value,
            price: sku.price,
            stock: sku.stock,
            images: skuImages,
          }
        }),
      )

      const body = {
        ...data,
        thumbnail,
        images,
        skus: uploadedSkus,
      }
      if (!productData) {
        return createProductMutation.mutate(body)
      }
      updateProductMutation.mutate({ productId: productData.id, body })
    },
    (error) => {
      console.log(error)
    },
  )

  return (
    <FormProvider {...form}>
      <CreateProductFormContext value={{ parentCategoryId, setParentCategoryId, skuForm, setSkuForm }}>
        <form className="space-y-6" onSubmit={onSubmit}>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{productData ? productData.name : 'Thêm sản phẩm mới'}</CardTitle>
              <CardDescription>{productData ? productData.category?.name : 'Danh mục sản phẩm'}</CardDescription>
              <CardAction className="space-x-2">
                {productData && (
                  <Button asChild variant="outline" size="sm">
                    <Link
                      href={PATH.PRODUCT_DETAIL(productData.name, productData.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Xem ở cửa hàng
                    </Link>
                  </Button>
                )}
                <Button disabled={isPending} type="submit" size="sm">
                  {isPending && <Spinner />}
                  {productData ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="basic-info">
                <TabsList variant="line">
                  <TabsTrigger value="basic-info">Thông tin cơ bản</TabsTrigger>
                  <TabsTrigger value="images">Hình ảnh</TabsTrigger>
                  <TabsTrigger value="brand-category">Thương hiệu và danh mục</TabsTrigger>
                  <TabsTrigger value="variants-skus">Phân loại hàng</TabsTrigger>
                </TabsList>
                <TabsContent value="basic-info" className="mt-4 data-[state=inactive]:hidden" forceMount>
                  <div className="grid gap-6 xl:grid-cols-2">
                    <FieldGroup>
                      <Controller
                        name="name"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>Tên sản phẩm</FieldLabel>
                            <Input
                              {...field}
                              id={field.name}
                              aria-invalid={fieldState.invalid}
                              placeholder="Ví dụ: iPhone 16 Pro Max"
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Controller
                          name="basePrice"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor={field.name}>Giá thật</FieldLabel>
                              <InputNumber
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                                placeholder="29.990.000"
                                value={field.value}
                                onChange={field.onChange}
                              />
                              <FieldDescription>
                                Giá thật là giá cơ bản của sản phẩm, khách hàng sẽ thanh toán theo giá này.
                              </FieldDescription>
                              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                          )}
                        />
                        <Controller
                          name="virtualPrice"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor={field.name}>Giá ảo</FieldLabel>
                              <InputNumber
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                                placeholder="32.990.000"
                                value={field.value}
                                onChange={field.onChange}
                              />
                              <FieldDescription>
                                Giá ảo sẽ là giá hiển thị bị gạch ngang khi có chương trình khuyến mãi hoặc giảm giá.
                              </FieldDescription>
                              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                          )}
                        />
                      </div>
                      <Controller
                        name="description"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>Mô tả</FieldLabel>
                            <RichTextEditor
                              value={field.value || ''}
                              onChange={(html) => field.onChange(html)}
                              placeholder="Nhập mô tả ngắn về sản phẩm"
                              className="min-h-30"
                            />
                            <FieldDescription>
                              Nhập mô tả ngắn về sản phẩm để người dùng có thể hiểu rõ hơn về sản phẩm.
                            </FieldDescription>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />
                    </FieldGroup>
                    <PublishDate />
                  </div>
                </TabsContent>
                <TabsContent value="images" className="mt-4 data-[state=inactive]:hidden" forceMount>
                  <FieldGroup>
                    <ProductMediaUploader
                      thumbnailFile={thumbnailFile}
                      setThumbnailFile={setThumbnailFile}
                      imagesFiles={imagesFiles}
                      setImagesFiles={setImagesFiles}
                    />
                  </FieldGroup>
                </TabsContent>
                <TabsContent value="brand-category" className="mt-4 data-[state=inactive]:hidden" forceMount>
                  <Controller
                    control={form.control}
                    name="brandId"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Thương hiệu (không bắt buộc)</FieldLabel>
                        <div className="rounded-xl border bg-linear-to-b from-background to-muted/20 p-4">
                          <RadioGroup
                            value={field.value?.toString()}
                            onValueChange={(value) => {
                              field.onChange(value ? parseInt(value, 10) : null)
                            }}
                            className="grid gap-3"
                          >
                            {brands.map((brand) => (
                              <label
                                key={brand.id}
                                className="group flex cursor-pointer items-start gap-3 rounded-lg border bg-background p-3 text-sm shadow-xs transition-colors hover:border-primary/30 hover:bg-primary/5 has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5"
                              >
                                <RadioGroupItem
                                  aria-invalid={fieldState.invalid}
                                  value={brand.id.toString()}
                                  className="mt-0.5"
                                />
                                <Avatar className="size-10 rounded-lg">
                                  <AvatarImage
                                    src={brand.logo || undefined}
                                    alt={brand.name}
                                    className="object-cover"
                                  />
                                  <AvatarFallback className="rounded-lg font-semibold">
                                    {brand.name.slice(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="space-y-0.5">
                                  <span className="font-medium leading-none">{brand.name}</span>
                                  <p className="text-xs text-muted-foreground">
                                    {brand.description || 'Chưa có mô tả'}
                                  </p>
                                </div>
                              </label>
                            ))}
                          </RadioGroup>
                        </div>
                      </Field>
                    )}
                  />
                  <ProductCategorySelector />
                </TabsContent>
                <TabsContent value="variants-skus" className="mt-4 data-[state=inactive]:hidden" forceMount>
                  <VariantsSkus />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </form>
      </CreateProductFormContext>
    </FormProvider>
  )
}
