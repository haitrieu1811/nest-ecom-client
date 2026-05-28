/* eslint-disable react-hooks/incompatible-library */

'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import roleApi from '@/apis/role.api'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import useAllPermissions from '@/hooks/use-all-permissions'
import { groupPermissionsByModuleArray, handleErrorFromAPI } from '@/lib/utils'
import {
  CreateRoleBodySchema,
  CreateRoleBodyType,
  CreateRoleResType,
  RoleIncludePermissionsType,
  UpdateRoleResType,
} from '@/schemas/role.schema'

type CreateRoleFormProps = {
  roleData?: RoleIncludePermissionsType
  onCreateSuccess?: (payload: CreateRoleResType) => void
  onUpdateSuccess?: (payload: UpdateRoleResType) => void
}

export default function CreateRoleForm({ roleData, onCreateSuccess, onUpdateSuccess }: CreateRoleFormProps) {
  const form = useForm<CreateRoleBodyType>({
    resolver: zodResolver(CreateRoleBodySchema),
    defaultValues: {
      name: '',
      description: '',
      isActive: true,
      permissionIds: [],
    },
  })

  const { permissions } = useAllPermissions()

  const groupedPermissions = groupPermissionsByModuleArray(permissions).sort((a, b) => a.module.localeCompare(b.module))
  const permissionIds = form.watch('permissionIds')

  // Nếu có roleData thì reset form với data đó (trường hợp edit role)
  React.useEffect(() => {
    if (!roleData) return
    form.reset({
      name: roleData.name,
      description: roleData.description,
      isActive: roleData.isActive,
      permissionIds: roleData.permissions.map((permission) => permission.id),
    })
  }, [roleData, form])

  const createRoleMutation = useMutation({
    mutationKey: ['create-role'],
    mutationFn: roleApi.create,
    onSuccess: (data) => {
      toast.success('Tạo role thành công')
      form.reset()
      onCreateSuccess?.(data.payload)
    },
    onError: (error) => {
      handleErrorFromAPI({
        error,
        setError: form.setError,
      })
    },
  })

  const updateRoleMutation = useMutation({
    mutationKey: ['update-role'],
    mutationFn: roleApi.update,
    onSuccess: (data) => {
      toast.success('Cập nhật role thành công')
      form.reset()
      onUpdateSuccess?.(data.payload)
    },
    onError: (error) => {
      handleErrorFromAPI({
        error,
        setError: form.setError,
      })
    },
  })

  const isPending = createRoleMutation.isPending || updateRoleMutation.isPending

  const handleTogglePermission = (permissionId: number) => {
    if (permissionIds.includes(permissionId)) {
      form.setValue(
        'permissionIds',
        permissionIds.filter((id) => id !== permissionId),
      )
      return
    }
    form.setValue('permissionIds', [...permissionIds, permissionId])
  }

  const onSubmit = form.handleSubmit((data) => {
    if (roleData) {
      updateRoleMutation.mutate({
        roleId: roleData.id,
        body: data,
      })
      return
    }
    createRoleMutation.mutate(data)
  })

  return (
    <form onSubmit={onSubmit}>
      <div className="grid grid-cols-12 gap-4 items-start">
        <Card className="col-span-12 lg:col-span-6">
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
            <CardDescription>
              Điền thông tin cơ bản cho role. Bạn có thể gán permissions cho role ở phần bên phải.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-input-name">Tên</FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-input-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="Ví dụ: Admin, User, Seller,..."
                      autoComplete="name"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-textarea-description">Mô tả (không bắt buộc)</FieldLabel>
                    <Textarea
                      {...field}
                      id="form-rhf-textarea-description"
                      aria-invalid={fieldState.invalid}
                      placeholder="Đây là role dành cho admin"
                      className="min-h-30"
                    />
                    <FieldDescription>
                      Mô tả role này. Thông tin này sẽ giúp người dùng hiểu rõ hơn về role.
                    </FieldDescription>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="isActive"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel htmlFor="form-rhf-switch-isActive">Kích hoạt</FieldLabel>
                      <FieldDescription>Kích hoạt role này để người dùng có thể sử dụng.</FieldDescription>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </FieldContent>
                    <Switch
                      id="form-rhf-switch-isActive"
                      name={field.name}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-invalid={fieldState.invalid}
                    />
                  </Field>
                )}
              />
            </FieldGroup>
          </CardContent>
        </Card>
        <Card className="col-span-12 lg:col-span-6">
          <CardHeader>
            <CardTitle>Permissions</CardTitle>
            <CardDescription>
              Gán permissions cho role này. Người dùng sẽ được thừa hưởng tất cả permissions của role được gán.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" defaultValue={[]}>
              {groupedPermissions.map((group) => {
                // Số lượng permissions của module này đã được chọn
                const totalExistingPermissionsForModule = group.permissions.filter((permission) =>
                  permissionIds.includes(permission.id),
                ).length
                // Tổng số permissions của module này
                const totalPermissionsForModule = group.permissions.length
                return (
                  <AccordionItem key={group.module} value={group.module}>
                    <AccordionTrigger>
                      {group.module.toUpperCase()} ({totalExistingPermissionsForModule}/{totalPermissionsForModule})
                    </AccordionTrigger>
                    <AccordionContent>
                      <FieldGroup className="gap-2">
                        {group.permissions.map((permission) => {
                          const isChecked = permissionIds.includes(permission.id)
                          return (
                            <FieldLabel htmlFor={`permission-${permission.id}`} key={permission.id}>
                              <Field orientation="horizontal">
                                <FieldContent>
                                  <FieldTitle>{permission.name}</FieldTitle>
                                  <FieldDescription>{permission.description || 'Chưa có mô tả.'}</FieldDescription>
                                </FieldContent>
                                <Switch
                                  id={`permission-${permission.id}`}
                                  defaultChecked={isChecked}
                                  onCheckedChange={() => handleTogglePermission(permission.id)}
                                />
                              </Field>
                            </FieldLabel>
                          )
                        })}
                      </FieldGroup>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          </CardContent>
        </Card>
      </div>
      <div className="mt-4 flex justify-end sticky bottom-0 bg-background/80 py-4 pr-4">
        <Button disabled={isPending} type="submit">
          {isPending && <Spinner />}
          {roleData ? 'Cập nhật role' : 'Tạo role'}
        </Button>
      </div>
    </form>
  )
}
