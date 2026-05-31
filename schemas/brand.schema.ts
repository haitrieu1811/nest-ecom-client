import z from 'zod'

import { BrandTranslationSchema } from '@/schemas/brand-translation.schema'
import { PaginationQuerySchema } from '@/schemas/utils.schema'

export const BrandSchema = z
  .object({
    id: z.int().positive(),
    logo: z.string().nullable(),
    name: z.string().max(100, 'Error.BrandNameIsTooLong'),
    description: z.string().max(500, 'Error.BrandDescriptionIsTooLong').default(''),
    deletedAt: z.iso.datetime().nullable(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
    createdById: z.int().positive().nullable(),
    updatedById: z.int().positive().nullable(),
  })
  .strict()

export const BrandIncludeTranslationsSchema = BrandSchema.extend({
  brandTranslations: z.array(BrandTranslationSchema),
})

export const CreateBrandBodySchema = BrandSchema.pick({
  logo: true,
  name: true,
  description: true,
}).strict()

export const CreateBrandResSchema = BrandSchema

export const UpdateBrandBodySchema = CreateBrandBodySchema.strict()

export const UpdateBrandResSchema = BrandSchema

export const BrandIdParamSchema = z
  .object({
    brandId: z.coerce.number().int('Error.BrandIdMustBeAnInteger').positive('Error.BrandIdMustBePositive'),
  })
  .strict()

export const GetBrandsQuerySchema = PaginationQuerySchema

export const GetBrandsResSchema = z.object({
  data: z.array(BrandIncludeTranslationsSchema),
  totalItems: z.number().int().positive(),
})

export const GetBrandResSchema = BrandIncludeTranslationsSchema

export type BrandType = z.infer<typeof BrandSchema>
export type BrandIncludeTranslationsType = z.infer<typeof BrandIncludeTranslationsSchema>
export type CreateBrandBodyType = z.infer<typeof CreateBrandBodySchema>
export type CreateBrandResType = z.infer<typeof CreateBrandResSchema>
export type UpdateBrandBodyType = z.infer<typeof UpdateBrandBodySchema>
export type UpdateBrandResType = z.infer<typeof UpdateBrandResSchema>
export type BrandIdParamType = z.infer<typeof BrandIdParamSchema>
export type GetBrandsQueryType = z.infer<typeof GetBrandsQuerySchema>
export type GetBrandsResType = z.infer<typeof GetBrandsResSchema>
export type GetBrandResType = z.infer<typeof GetBrandResSchema>
