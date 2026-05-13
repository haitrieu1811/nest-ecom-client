'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import profileApi from '@/apis/profile.api'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { ChangePasswordBodySchema, ChangePasswordBodyType } from '@/schemas/profile.schema'
import { handleErrorFromAPI } from '@/lib/utils'

export default function ChangePasswordForm() {
  const form = useForm<ChangePasswordBodyType>({
    resolver: zodResolver(ChangePasswordBodySchema),
    defaultValues: {
      oldPassword: '',
      password: '',
      confirmPassword: '',
    },
  })

  const changePasswordMutation = useMutation({
    mutationKey: ['change-password'],
    mutationFn: profileApi.changePassword,
    onSuccess: (data) => {
      toast.success(data.payload.message)
      form.reset()
    },
    onError: (error) => {
      handleErrorFromAPI({
        error,
        setError: form.setError,
      })
    },
  })

  const onSubmit = form.handleSubmit((data) => {
    changePasswordMutation.mutate(data)
  })

  return (
    <form onSubmit={onSubmit}>
      <FieldGroup>
        <Controller
          name="oldPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-input-old-password">Mật khẩu cũ</FieldLabel>
              <Input
                {...field}
                type="password"
                id="form-rhf-input-old-password"
                aria-invalid={fieldState.invalid}
                placeholder="Nhập mật khẩu cũ"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-input-password">Mật khẩu mới</FieldLabel>
              <Input
                {...field}
                id="form-rhf-input-password"
                type="password"
                aria-invalid={fieldState.invalid}
                placeholder="Nhập mật khẩu mới"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-input-confirm-password">Xác nhận mật khẩu mới</FieldLabel>
              <Input
                {...field}
                id="form-rhf-input-confirm-password"
                type="password"
                aria-invalid={fieldState.invalid}
                placeholder="Nhập lại mật khẩu mới"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <Button type="submit" disabled={changePasswordMutation.isPending} className="mt-7">
        {changePasswordMutation.isPending && <Spinner />}
        Cập nhật mật khẩu
      </Button>
    </form>
  )
}
