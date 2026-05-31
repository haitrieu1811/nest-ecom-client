import z from 'zod'

export const BrandTranslationSchema = z
  .object({
    id: z.int().positive(),
    name: z.string('Error.BrandTranslationNameMustBeAString').max(100, 'Error.BrandTranslationNameIsTooLong'),
    description: z
      .string('Error.BrandTranslationDescriptionMustBeAString')
      .max(500, 'Error.BrandTranslationDescriptionIsTooLong')
      .optional(),
    deletedAt: z.iso.datetime().nullable(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
    brandId: z.int('Error.BrandIdMustBeAnInteger').positive('Error.BrandIdMustBePositive'),
    languageId: z.string('Error.LanguageIdMustBeAString').max(5, 'Error.LanguageIdIsTooLong'),
    createdById: z.int().positive().nullable(),
    updatedById: z.int().positive().nullable(),
  })
  .strict()

export const CreateBrandTranslationBodySchema = BrandTranslationSchema.pick({
  name: true,
  description: true,
  languageId: true,
})
  .extend({
    brandId: z.int('Error.BrandIdMustBeAnInteger').positive('Error.BrandIdMustBePositive'),
  })
  .strict()

export const CreateBrandTranslationResSchema = BrandTranslationSchema

export const UpdateBrandTranslationBodySchema = CreateBrandTranslationBodySchema

export const UpdateBrandTranslationResSchema = BrandTranslationSchema

export const BrandTranslationIdParamSchema = z
  .object({
    brandTranslationId: z.coerce
      .number()
      .int('Error.BrandTranslationIdMustBeAnInteger')
      .positive('Error.BrandTranslationIdMustBePositive'),
  })
  .strict()

export const GetBrandTranslationResSchema = BrandTranslationSchema

export type BrandTranslationType = z.infer<typeof BrandTranslationSchema>
export type CreateBrandTranslationBodyType = z.infer<typeof CreateBrandTranslationBodySchema>
export type CreateBrandTranslationResType = z.infer<typeof CreateBrandTranslationResSchema>
export type UpdateBrandTranslationBodyType = z.infer<typeof UpdateBrandTranslationBodySchema>
export type UpdateBrandTranslationResType = z.infer<typeof UpdateBrandTranslationResSchema>
export type BrandTranslationIdParamType = z.infer<typeof BrandTranslationIdParamSchema>
export type GetBrandTranslationResType = z.infer<typeof GetBrandTranslationResSchema>
