import z from 'zod'

export const MessageResSchema = z.object({
  message: z.string(),
})

export const PaginationResSchema = z.object({
  page: z.number().positive(),
  limit: z.number(),
  totalPages: z.number(),
  totalRows: z.number(),
})

export const EmptyBodySchema = z.object({}).strict()

export const PaginationQuerySchema = z.object({
  page: z.coerce.number('Error.PageIsInvalid').int('Error.PageIsInvalid').positive('Error.PageIsInvalid').optional(),
  limit: z.coerce
    .number('Error.LimitIsInvalid')
    .int('Error.LimitIsInvalid')
    .positive('Error.LimitIsInvalid')
    .optional(),
})

export type MessageResType = z.infer<typeof MessageResSchema>
export type PaginationResType = z.infer<typeof PaginationResSchema>
export type EmptyBodyType = z.infer<typeof EmptyBodySchema>
export type PaginationQueryType = z.infer<typeof PaginationQuerySchema>
