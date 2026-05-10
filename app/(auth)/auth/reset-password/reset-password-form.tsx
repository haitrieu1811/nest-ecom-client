'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { SendIcon } from 'lucide-react'

import authApi from '@/apis/auth.api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Spinner } from '@/components/ui/spinner'
import { VERIFICATION_CODE_TYPE } from '@/constants/auth.constant'
import PATH from '@/constants/path'
import useSendOTP from '@/hooks/use-send-otp'
import { cn, handleErrorFromAPI } from '@/lib/utils'
import { useAppStore } from '@/providers/app.provider'
import { ResetPasswordBodySchema, ResetPasswordBodyType } from '@/schemas/auth.schema'

export default function ResetPasswordForm({ className, ...props }: React.ComponentProps<'div'>) {
  const router = useRouter()

  const { setProfile, setIsAuthenticated } = useAppStore()

  const form = useForm<ResetPasswordBodyType>({
    resolver: zodResolver(ResetPasswordBodySchema),
    defaultValues: {
      email: '',
      code: '',
      password: '',
      confirmPassword: '',
    },
  })

  const { sendOTPMutation } = useSendOTP({
    onError: (error) => {
      handleErrorFromAPI({
        error,
        setError: form.setError,
      })
    },
  })

  const handleSendOTP = () => {
    const email = form.getValues('email')
    sendOTPMutation.mutate({ email, type: VERIFICATION_CODE_TYPE.FORGOT_PASSWORD })
  }

  const resetPasswordMutation = useMutation({
    mutationKey: ['reset-password'],
    mutationFn: authApi.resetPassword,
    onSuccess: async (data) => {
      toast.success('Đặt lại mật khẩu thành công.')
      router.push(PATH.HOME)
      setIsAuthenticated(true)
      setProfile(data.payload.user)
      await authApi.setTokens(data.payload) // Lưu token vào cookie thông qua API route
    },
    onError: (error) => {
      handleErrorFromAPI({
        error,
        setError: form.setError,
      })
    },
  })

  const onSubmit = form.handleSubmit((data) => {
    resetPasswordMutation.mutate(data)
  })

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Đặt lại mật khẩu</CardTitle>
          <CardDescription>Vui lòng nhập email của bạn và làm theo hướng dẫn để đặt lại mật khẩu</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <FieldGroup>
              <Controller
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                    />
                    <FieldDescription>Chúng tôi sẽ gửi mã xác nhận đến email này</FieldDescription>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="code"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex items-center justify-between">
                      <FieldLabel htmlFor="otp-verification">Mã xác nhận</FieldLabel>
                      <Button
                        type="button"
                        disabled={sendOTPMutation.isPending}
                        variant="outline"
                        size="xs"
                        onClick={handleSendOTP}
                      >
                        {sendOTPMutation.isPending && <Spinner />}
                        {!sendOTPMutation.isPending && <SendIcon />}
                        Gửi mã
                      </Button>
                    </div>
                    <InputOTP {...field} maxLength={6} id="otp-verification">
                      <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id="password"
                      type="password"
                      placeholder="********"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="confirmPassword"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="confirmPassword">Xác nhận mật khẩu</FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id="confirmPassword"
                      type="password"
                      placeholder="********"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Field>
                <Button type="submit" disabled={resetPasswordMutation.isPending}>
                  {resetPasswordMutation.isPending && <Spinner className="mr-2" />}
                  Đặt lại mật khẩu
                </Button>
                <FieldDescription className="text-center">
                  Đã nhớ mật khẩu? <Link href={PATH.LOGIN}>Đăng nhập</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        Bằng cách tiếp tục, bạn đồng ý với <a href="#">Điều khoản dịch vụ</a> và <a href="#">Chính sách bảo mật</a>.
      </FieldDescription>
    </div>
  )
}
