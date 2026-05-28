'use client'

import { zodResolver } from '@hookform/resolvers/zod/dist/zod.js'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import {
  PermissionType,
  UpdatePermissionBodySchema,
  UpdatePermissionBodyType,
  UpdatePermissionResType,
} from '@/schemas/permission.schema'
import { useMutation } from '@tanstack/react-query'
import permissionApi from '@/apis/permission.api'
import { toast } from 'sonner'

type CreatePermissionFormProps = {
  permissionData?: PermissionType
  onUpdateSuccess?: (payload: UpdatePermissionResType) => void
}

export default function CreatePermissionForm({ permissionData, onUpdateSuccess }: CreatePermissionFormProps) {
  const form = useForm<UpdatePermissionBodyType>({
    resolver: zodResolver(UpdatePermissionBodySchema),
    defaultValues: {
      name: permissionData?.name || '',
      description: permissionData?.description || '',
    },
  })

  React.useEffect(() => {
    if (!permissionData) return
    form.reset({
      name: permissionData.name,
      description: permissionData.description || '',
    })
  }, [permissionData, form])

  const updatePermissionMutation = useMutation({
    mutationKey: ['update-permission'],
    mutationFn: permissionApi.update,
    onSuccess: (data) => {
      toast.success('Cập nhật permission thành công')
      onUpdateSuccess?.(data.payload)
    },
  })

  const isPending = updatePermissionMutation.isPending

  const onSubmit = form.handleSubmit((data) => {
    if (permissionData) {
      updatePermissionMutation.mutate({
        body: data,
        permissionId: permissionData.id,
      })
    }
  })

  return (
    <form onSubmit={onSubmit}>
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">Tên</FieldLabel>
              <Input {...field} id="name" aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="description">Mô tả</FieldLabel>
              <Textarea {...field} id="description" aria-invalid={fieldState.invalid} className="min-h-30" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <div className="mt-4 flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending && <Spinner />}
          {permissionData ? 'Cập nhật permission' : 'Tạo permission'}
        </Button>
      </div>
    </form>
  )
}
