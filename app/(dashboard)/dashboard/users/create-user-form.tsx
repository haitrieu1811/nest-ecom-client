'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { manageUserApi } from '@/apis/user.api'
import InputAvatar from '@/components/input-avatar'
import InputPassword from '@/components/input-password'
import { Button } from '@/components/ui/button'
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { USER_STATUS } from '@/constants/auth.constant'
import useRoles from '@/hooks/use-roles'
import useUploadImages from '@/hooks/use-upload-images'
import { handleErrorFromAPI } from '@/lib/utils'
import {
  CreateUserBodySchema,
  CreateUserBodyType,
  CreateUserResType,
  UpdateUserResType,
  UserIncludeRoleType,
} from '@/schemas/user.schema'

type CreateUserFormProps = {
  userData?: Omit<UserIncludeRoleType, 'password' | 'totpSecret'> | null
  onCreateSuccess?: (payload: CreateUserResType) => void
  onUpdateSuccess?: (payload: UpdateUserResType) => void
}

export default function CreateUserForm({ userData, onCreateSuccess, onUpdateSuccess }: CreateUserFormProps) {
  const queryClient = useQueryClient()

  const [avatarFile, setAvatarFile] = React.useState<File | null>(null)

  const { uploadImagesMutation } = useUploadImages()

  const createUserMutation = useMutation({
    mutationKey: ['create-user'],
    mutationFn: manageUserApi.create,
    onSuccess: (data) => {
      toast.success('Tạo người dùng thành công')
      form.reset()
      setAvatarFile(null)
      queryClient.invalidateQueries({
        queryKey: ['get-all-users'],
      })
      onCreateSuccess?.(data.payload)
    },
    onError: (error) => {
      handleErrorFromAPI({
        error,
        setError: form.setError,
      })
    },
  })

  const updateUserMutation = useMutation({
    mutationKey: ['update-user'],
    mutationFn: manageUserApi.update,
    onSuccess: (data) => {
      toast.success('Cập nhật người dùng thành công')
      form.reset()
      setAvatarFile(null)
      queryClient.invalidateQueries({
        queryKey: ['get-all-users'],
      })
      onUpdateSuccess?.(data.payload)
    },
    onError: (error) => {
      handleErrorFromAPI({
        error,
        setError: form.setError,
      })
    },
  })

  const isPending = uploadImagesMutation.isPending || createUserMutation.isPending || updateUserMutation.isPending

  const { roles } = useRoles({ page: 1, limit: 20 })

  const form = useForm<CreateUserBodyType>({
    resolver: zodResolver(CreateUserBodySchema),
    defaultValues: {
      avatar: userData?.avatar || null,
      email: userData?.email || '',
      name: userData?.name || '',
      password: '',
      status: userData?.status || USER_STATUS.ACTIVE,
      roleId: userData?.roleId || undefined,
      phoneNumber: userData?.phoneNumber || null,
    },
  })

  // Nếu userData thay đổi (ví dụ khi mở form với user khác), cập nhật lại giá trị form
  React.useEffect(() => {
    if (!userData) return
    form.reset({
      avatar: userData.avatar,
      email: userData.email,
      name: userData.name,
      password: '',
      status: userData.status,
      roleId: userData.roleId,
      phoneNumber: userData.phoneNumber,
    })
  }, [userData, form])

  const onSubmit = form.handleSubmit(async (data) => {
    let avatar = data.avatar
    if (avatarFile) {
      const formData = new FormData()
      formData.append('files', avatarFile)
      const res = await uploadImagesMutation.mutateAsync(formData)
      avatar = res.payload.data[0].url
    }
    const body = { ...data, avatar }
    if (userData) {
      updateUserMutation.mutate({
        body,
        userId: userData.id,
      })
    } else {
      createUserMutation.mutate(body)
    }
  })

  return (
    <form className="space-y-7" onSubmit={onSubmit}>
      <InputAvatar
        file={avatarFile}
        defaultAvatar={form.watch('avatar')}
        onChange={(file) => setAvatarFile(file)}
        onCancel={() => setAvatarFile(null)}
        onRemoveDefault={() => form.setValue('avatar', null, { shouldValidate: true })}
        title="Ảnh đại diện người dùng"
        description="Ảnh đại diện hiển thị của tài khoản thành viên."
      />
      <FieldGroup>
        <div className="grid grid-cols-12 gap-4">
          {/* Email */}
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="col-span-6">
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" placeholder="name@example.com" {...field} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          {/* Họ tên */}
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="col-span-6">
                <FieldLabel htmlFor="name">Họ tên</FieldLabel>
                <Input id="name" placeholder="Nhập họ tên" {...field} value={field.value ?? ''} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>
        <div className="grid grid-cols-12 gap-4">
          {/* Mật khẩu */}
          <Controller
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="col-span-6">
                <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
                <InputPassword id="password" placeholder="Nhập mật khẩu" {...field} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          {/* Số điện thoại */}
          <Controller
            control={form.control}
            name="phoneNumber"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="col-span-6">
                <FieldLabel htmlFor="phoneNumber">Số điện thoại</FieldLabel>
                <Input
                  id="phoneNumber"
                  placeholder="0123456789"
                  {...field}
                  value={field.value ?? ''}
                  onChange={(e) => {
                    const value = e.target.value
                    if (value === '') {
                      field.onChange(null)
                    } else {
                      field.onChange(value)
                    }
                  }}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>
        <div className="grid grid-cols-12 gap-4">
          {/* Trạng thái */}
          <Controller
            control={form.control}
            name="status"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="col-span-6">
                <FieldContent>
                  <FieldLabel htmlFor="status">Trạng thái</FieldLabel>
                  <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="status" className="w-full">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={USER_STATUS.ACTIVE}>Hoạt động</SelectItem>
                      <SelectItem value={USER_STATUS.BLOCKED}>Bị chặn</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </FieldContent>
              </Field>
            )}
          />
          {/* Vai trò */}
          <Controller
            control={form.control}
            name="roleId"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="col-span-6">
                <FieldContent>
                  <FieldLabel htmlFor="roleId">Vai trò</FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value?.toString()}
                    onValueChange={(value) => {
                      const intValue = parseInt(value, 10)
                      field.onChange(intValue)
                    }}
                  >
                    <SelectTrigger id="roleId" className="w-full">
                      <SelectValue placeholder="Chọn vai trò" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id.toString()}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </FieldContent>
              </Field>
            )}
          />
        </div>
      </FieldGroup>
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending && <Spinner />}
          {userData ? 'Cập nhật người dùng' : 'Tạo người dùng'}
        </Button>
      </div>
    </form>
  )
}
