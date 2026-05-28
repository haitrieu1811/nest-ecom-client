import z from 'zod'

import { PermissionSchema } from '@/schemas/permission.schema'

export const RoleSchema = z
  .object({
    id: z.number().int().positive(),
    name: z.string('Error.RoleNameIsRequired').min(1, 'Error.RoleNameIsRequired').max(50, 'Error.RoleNameIsTooLong'),
    description: z.string().max(200, 'Error.RoleDescriptionIsTooLong').optional(),
    isActive: z.boolean().optional(),
    deletedAt: z.iso.datetime().nullable(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
    createdById: z.number().int().positive().nullable(),
    updatedById: z.number().int().positive().nullable(),
  })
  .strict()

export const RoleIncludeCountSchema = RoleSchema.extend({
  _count: z.object({
    users: z.number(),
  }),
})

export const PermissionInRoleSchema = PermissionSchema.pick({
  id: true,
  module: true,
  path: true,
  method: true,
  name: true,
  description: true,
})

export const RoleIncludePermissions = RoleSchema.extend({
  permissions: z.array(PermissionInRoleSchema),
})

export const CreateRoleBodySchema = RoleSchema.pick({
  name: true,
  description: true,
  isActive: true,
})
  .extend({
    permissionIds: z.array(
      z
        .number('Error.PermissionIdIsInvalid')
        .int('Error.PermissionIdIsInvalid')
        .positive('Error.PermissionIdIsInvalid'),
    ),
  })
  .strict()

export const CreateRoleResSchema = RoleSchema

export const GetRolesResSchema = z.object({
  data: z.array(RoleIncludeCountSchema),
  totalRows: z.number(),
})

export const GetRoleResSchema = RoleIncludePermissions

export const UpdateRoleBodySchema = CreateRoleBodySchema

export const UpdateRoleResSchema = RoleIncludePermissions

export const RoleIdParamSchema = z
  .object({
    roleId: z.coerce.number().int().positive(),
  })
  .strict()

export type RoleType = z.infer<typeof RoleSchema>
export type RoleIncludeCountType = z.infer<typeof RoleIncludeCountSchema>
export type PermissionInRoleType = z.infer<typeof PermissionInRoleSchema>
export type RoleIncludePermissionsType = z.infer<typeof RoleIncludePermissions>

export type CreateRoleBodyType = z.infer<typeof CreateRoleBodySchema>
export type CreateRoleResType = z.infer<typeof CreateRoleResSchema>
export type GetRolesResType = z.infer<typeof GetRolesResSchema>
export type GetRoleResType = z.infer<typeof GetRoleResSchema>
export type UpdateRoleBodyType = z.infer<typeof UpdateRoleBodySchema>
export type UpdateRoleResType = z.infer<typeof UpdateRoleResSchema>
export type RoleIdParamType = z.infer<typeof RoleIdParamSchema>
