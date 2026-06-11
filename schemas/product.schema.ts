import z from 'zod'

import { ORDER_BY, SORT_BY } from '@/constants/utils.constant'
import { BrandIncludeTranslationsSchema } from '@/schemas/brand.schema'
import { CategoryIncludeTranslationsSchema } from '@/schemas/category.schema'
import { ProductTranslationSchema } from '@/schemas/product-translation.schema'
import { PaginationQuerySchema, PaginationResSchema } from '@/schemas/utils.schema'
import { UserSchema } from '@/schemas/user.schema'

export const SKUSchema = z.object({
  id: z.int().positive(),
  value: z.string('Error.SKUValueMustBeAString').max(500, 'Error.SKUValueIsTooLong').trim(),
  price: z.int('Error.SKUPriceMustBeAnInteger').nonnegative('Error.SKUPriceMustBeNonNegative'),
  stock: z.int('Error.SKUStockMustBeAnInteger').nonnegative('Error.SKUStockMustBeNonNegative'),
  images: z.array(z.string('Error.SKUImageMustBeAString')),
  deletedAt: z.iso.datetime().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  createdById: z.int().positive().nullable(),
  updatedById: z.int().positive().nullable(),
  productId: z.int().positive(),
})

export const UpsertSKUBodySchema = SKUSchema.pick({
  value: true,
  price: true,
  stock: true,
  images: true,
}).strict()

export const VariantSchema = z.object({
  value: z.string('Error.ProductVariantValueMustBeAString').min(1, 'Error.ProductVariantValueIsRequired').trim(),
  options: z.array(
    z.string('Error.ProductVariantOptionMustBeAString').min(1, 'Error.ProductVariantOptionIsRequired').trim(),
  ),
})

export const VariantsSchema = z
  .array(VariantSchema, 'Error.ProductVariantsMustBeAnArrayOfVariants')
  .superRefine((variants, ctx) => {
    for (let i = 0; i < variants.length; i++) {
      const variant = variants[i]
      const isExistingVariant =
        variants.findIndex((v) => v.value.toLowerCase().trim() === variant.value.toLowerCase().trim()) !== i
      if (isExistingVariant) {
        return ctx.addIssue({
          code: 'custom',
          message: `Error.ProductVariantValueMustBeUnique: ${variant.value}`,
          path: ['variants'],
        })
      }
      const isDifferentOption = variant.options.some((option, index) => {
        const isExistingOption =
          variant.options.findIndex((o) => o.toLowerCase().trim() === option.toLowerCase().trim()) !== index
        return isExistingOption
      })
      if (isDifferentOption) {
        return ctx.addIssue({
          code: 'custom',
          message: `Error.ProductVariantOptionsMustBeUnique: ${variant.value}`,
          path: ['variants'],
        })
      }
    }
  })

export const ProductSchema = z
  .object({
    id: z.int().positive(),
    name: z
      .string('Error.ProductNameMustBeAString')
      .min(1, 'Error.ProductNameIsRequired')
      .max(500, 'Error.ProductNameIsTooLong'),
    description: z.string('Error.ProductDescriptionMustBeAString').min(1, 'Error.ProductDescriptionIsRequired'),
    basePrice: z
      .number('Error.ProductBasePriceMustBeANumber')
      .int('Error.ProductBasePriceMustBeAnInteger')
      .nonnegative('Error.ProductBasePriceMustBeNonNegative'),
    virtualPrice: z
      .number('Error.ProductVirtualPriceMustBeANumber')
      .int('Error.ProductVirtualPriceMustBeAnInteger')
      .nonnegative('Error.ProductVirtualPriceMustBeNonNegative'),
    thumbnail: z.string('Error.ProductThumbnailMustBeAStringOrNull').nullable(),
    images: z.array(z.string('Error.ProductImageMustBeAString')),
    variants: VariantsSchema,
    deletedAt: z.iso.datetime().nullable(),
    publishedAt: z.iso
      .datetime({
        offset: true,
        error: 'Error.ProductPublishedAtMustBeAValidDate',
      })
      .nullable(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
    brandId: z.int('Error.BrandIdMustBeANumber').positive('Error.BrandIdMustBePositive').nullable(),
    categoryId: z.int('Error.CategoryIdMustBeANumber').positive('Error.CategoryIdMustBePositive').nullable(),
    createdById: z.int().positive().nullable(),
    updatedById: z.int().positive().nullable(),
  })
  .strict()

export const ProductIncludeTranslationsSchema = ProductSchema.extend({
  productTranslations: z.array(ProductTranslationSchema),
})

export const ProductDetailSchema = ProductIncludeTranslationsSchema.extend({
  category: CategoryIncludeTranslationsSchema.nullable(),
  brand: BrandIncludeTranslationsSchema.nullable(),
  skus: z.array(SKUSchema),
  createdBy: UserSchema.omit({
    password: true,
    totpSecret: true,
  }),
})

export const CreateProductBodySchema = ProductSchema.pick({
  name: true,
  description: true,
  basePrice: true,
  virtualPrice: true,
  thumbnail: true,
  images: true,
  variants: true,
  publishedAt: true,
  brandId: true,
  categoryId: true,
})
  .extend({
    skus: z.array(UpsertSKUBodySchema, 'Error.ProductSKUsMustBeAnArrayOfSKUs'),
  })
  .strict()

export const CreateProductResSchema = ProductDetailSchema

export const UpdateProductBodySchema = CreateProductBodySchema.strict()

export const UpdateProductResSchema = ProductSchema

export const ProductIdParamSchema = z
  .object({
    productId: z.coerce
      .number('Error.ProductIdMustBeANumber')
      .int('Error.ProductIdMustBeAnInteger')
      .positive('Error.ProductIdMustBePositive'),
  })
  .strict()

// Query params dành cho client
export const GetProductsQuerySchema = PaginationQuerySchema.extend({
  brandId: z.coerce
    .number('Error.BrandIdMustBeAnInteger')
    .int('Error.BrandIdMustBeAnInteger')
    .positive('Error.BrandIdMustBePositive')
    .optional(),
  categoryId: z.coerce
    .number('Error.CategoryIdMustBeANumber')
    .int('Error.CategoryIdMustBeAnInteger')
    .positive('Error.CategoryIdMustBePositive')
    .optional(),
  name: z.string('Error.NameMustBeAString').trim().optional(),
  minPrice: z.coerce
    .number('Error.MinPriceMustBeANumber')
    .int('Error.MinPriceMustBeAnInteger')
    .nonnegative('Error.MinPriceMustBeNonNegative')
    .optional(),
  maxPrice: z.coerce
    .number('Error.MaxPriceMustBeANumber')
    .int('Error.MaxPriceMustBeAnInteger')
    .nonnegative('Error.MaxPriceMustBeNonNegative')
    .optional(),
  createdById: z.coerce
    .number('Error.CreatedByIdMustBeANumber')
    .int('Error.CreatedByIdMustBeAnInteger')
    .positive('Error.CreatedByIdMustBePositive')
    .optional(),
  sortBy: z
    .enum([SORT_BY.NAME, SORT_BY.BASE_PRICE, SORT_BY.CREATED_AT], 'Error.SortByMustBeNameOrBasePriceOrCreatedAt')
    .optional(),
  orderBy: z.enum([ORDER_BY.ASC, ORDER_BY.DESC], 'Error.OrderByMustBeAscOrDesc').optional(),
})

// Query params dành cho admin, manage, seller
export const GetManageProductsQuerySchema = GetProductsQuerySchema.extend({
  isPublic: z.preprocess((value) => value === 'true', z.boolean('Error.IsPublicMustBeABoolean')).optional(),
  createdById: z.coerce
    .number('Error.CreatedByIdMustBeANumber')
    .int('Error.CreatedByIdMustBeAnInteger')
    .positive('Error.CreatedByIdMustBePositive'),
})

export const GetProductsResSchema = z.object({
  data: z.array(ProductIncludeTranslationsSchema),
  pagination: PaginationResSchema,
})

export const GetProductResSchema = ProductDetailSchema

export type VariantType = z.infer<typeof VariantSchema>
export type VariantsType = z.infer<typeof VariantsSchema>
export type SKUType = z.infer<typeof SKUSchema>
export type UpsertSKUBodyType = z.infer<typeof UpsertSKUBodySchema>
export type ProductType = z.infer<typeof ProductSchema>
export type ProductIncludeTranslationsType = z.infer<typeof ProductIncludeTranslationsSchema>
export type ProductDetailType = z.infer<typeof ProductDetailSchema>
export type CreateProductBodyType = z.infer<typeof CreateProductBodySchema>
export type CreateProductResType = z.infer<typeof CreateProductResSchema>
export type UpdateProductBodyType = z.infer<typeof UpdateProductBodySchema>
export type UpdateProductResType = z.infer<typeof UpdateProductResSchema>
export type ProductIdParamType = z.infer<typeof ProductIdParamSchema>
export type GetProductsQueryType = z.infer<typeof GetProductsQuerySchema>
export type GetManageProductsQueryType = z.infer<typeof GetManageProductsQuerySchema>
export type GetProductsResType = z.infer<typeof GetProductsResSchema>
export type GetProductResType = z.infer<typeof GetProductResSchema>
