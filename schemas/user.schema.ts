import z from 'zod'

import { PHONE_NUMBER_REGEX } from '@/constants/regex'
import { USER_STATUS } from '@/constants/auth.constant'
import { RoleIncludePermissions, RoleSchema } from '@/schemas/role.schema'
import { PaginationQuerySchema, PaginationResSchema } from '@/schemas/utils.schema'

export const emailSchema = z.email('Error.EmailIsInvalid')

export const UserSchema = z
  .object({
    id: z.int().positive(),
    email: emailSchema,
    password: z.string('Error.PasswordMustBeAString').min(12, 'Error.PasswordIsTooShort').max(32, 'PasswordIsTooLong'),
    name: z.string('Error.UserNameMustBeAString').max(100, 'Error.UserNameIsTooLong').nullable(),
    phoneNumber: z
      .string('Error.PhoneNumberMustBeAString')
      .max(11, 'Error.PhoneNumberIsTooLong')
      .regex(PHONE_NUMBER_REGEX, 'Error.PhoneNumberIsInvalid')
      .nullable(),
    avatar: z.string('Error.AvatarMustBeAString').nullable(),
    totpSecret: z.string().nullable(),
    status: z.enum([USER_STATUS.ACTIVE, USER_STATUS.BLOCKED], 'Error.UserStatusIsInvalid'),
    roleId: z.number('Error.RoleIdMustBeANumber').int('Error.RoleIdMustBeAInt').positive('Error.RoleIdMustBePositive'),
    createdById: z.int().positive().nullable(),
    updatedById: z.int().positive().nullable(),
    deletedAt: z.iso.datetime().nullable(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  })
  .strict()

export const UserIncludeRoleSchema = UserSchema.extend({
  role: RoleSchema,
})

export const UserIncludeRolePermissionsSchema = UserSchema.omit({
  password: true,
  totpSecret: true,
}).extend({
  role: RoleIncludePermissions,
})

export const CreateUserBodySchema = UserSchema.pick({
  email: true,
  password: true,
  name: true,
  avatar: true,
  status: true,
  roleId: true,
  phoneNumber: true,
}).strict()

export const CreateUserResSchema = UserSchema.omit({
  password: true,
  totpSecret: true,
})

export const UpdateUserBodySchema = CreateUserBodySchema

export const UpdateUserResSchema = UserIncludeRolePermissionsSchema

export const GetListUsersQuerySchema = PaginationQuerySchema.extend({
  email: z.string('Error.InvalidEmail').optional(),
})

export const GetListUsersResSchema = z.object({
  data: z.array(
    UserIncludeRoleSchema.omit({
      password: true,
      totpSecret: true,
    }),
  ),
  pagination: PaginationResSchema,
})

export const GetUserDetailResSchema = UserIncludeRolePermissionsSchema

export const SellerSchema = UserSchema.pick({
  id: true,
  name: true,
  createdAt: true,
  updatedAt: true,
  avatar: true,
})

export const GetListSellersResSchema = z.object({
  data: z.array(SellerSchema),
  pagination: PaginationResSchema,
})

export const GetSellerDetailResSchema = SellerSchema

export const UserIdParamSchema = z
  .object({
    userId: z.coerce.number().int('Error.UserIdMustBeAnInt').positive('Error.UserIdMustBePositive'),
  })
  .strict()

export type UserType = z.infer<typeof UserSchema>
export type UserIncludeRoleType = z.infer<typeof UserIncludeRoleSchema>
export type UserIncludeRolePermissionsType = z.infer<typeof UserIncludeRolePermissionsSchema>

export type CreateUserBodyType = z.infer<typeof CreateUserBodySchema>
export type CreateUserResType = z.infer<typeof CreateUserResSchema>
export type UpdateUserBodyType = z.infer<typeof UpdateUserBodySchema>
export type UpdateUserResType = z.infer<typeof UpdateUserResSchema>
export type GetListUsersQueryType = z.infer<typeof GetListUsersQuerySchema>
export type GetListUsersResType = z.infer<typeof GetListUsersResSchema>
export type SellerType = z.infer<typeof SellerSchema>
export type GetListSellersResType = z.infer<typeof GetListSellersResSchema>
export type GetUserDetailResType = z.infer<typeof GetUserDetailResSchema>
export type GetSellerDetailResType = z.infer<typeof GetSellerDetailResSchema>
export type UserIdParamType = z.infer<typeof UserIdParamSchema>
