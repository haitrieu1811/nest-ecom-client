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
    <div className={cn('flex flex-col gap-4', className)} {...props}>
      <Card className="relative overflow-hidden border-border/60 bg-card/95 shadow-xl shadow-black/5 backdrop-blur-sm">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-r from-primary/20 via-primary/5 to-transparent" />
        <CardHeader className="relative space-y-2 pb-4 text-center">
          <CardTitle className="text-2xl font-extrabold tracking-tight">Đặt lại mật khẩu</CardTitle>
          <CardDescription className="text-[15px]">
            Vui lòng nhập email và mã xác nhận để tạo mật khẩu mới cho tài khoản của bạn.
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <form onSubmit={onSubmit}>
            <FieldGroup className="space-y-3">
              <Controller
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email" className="text-sm font-semibold">
                      Email
                    </FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      className="h-11 rounded-lg border-border/70 bg-background/80"
                    />
                    <FieldDescription className="text-xs leading-relaxed">
                      Chúng tôi sẽ gửi mã xác nhận đến email này.
                    </FieldDescription>
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
                      <FieldLabel htmlFor="otp-verification" className="text-sm font-semibold">
                        Mã xác nhận
                      </FieldLabel>
                      <Button
                        type="button"
                        disabled={sendOTPMutation.isPending}
                        variant="outline"
                        size="xs"
                        className="rounded-md border-border/70 bg-background/80 font-medium"
                        onClick={handleSendOTP}
                      >
                        {sendOTPMutation.isPending && <Spinner />}
                        {!sendOTPMutation.isPending && <SendIcon />}
                        Gửi mã
                      </Button>
                    </div>
                    <InputOTP {...field} maxLength={6} id="otp-verification" containerClassName="w-full justify-center">
                      <InputOTPGroup className="mx-auto grid w-full max-w-sm grid-cols-6 gap-2 rounded-none *:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-full *:data-[slot=input-otp-slot]:rounded-lg *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:border-border/70 *:data-[slot=input-otp-slot]:bg-background/80 *:data-[slot=input-otp-slot]:text-lg *:data-[slot=input-otp-slot]:font-semibold *:data-[slot=input-otp-slot]:shadow-sm *:data-[slot=input-otp-slot]:transition-all *:data-[slot=input-otp-slot]:data-[active=true]:-translate-y-0.5 *:data-[slot=input-otp-slot]:data-[active=true]:shadow-md">
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
                    <FieldLabel htmlFor="password" className="text-sm font-semibold">
                      Mật khẩu
                    </FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id="password"
                      type="password"
                      placeholder="********"
                      className="h-11 rounded-lg border-border/70 bg-background/80"
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
                    <FieldLabel htmlFor="confirmPassword" className="text-sm font-semibold">
                      Xác nhận mật khẩu
                    </FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id="confirmPassword"
                      type="password"
                      placeholder="********"
                      className="h-11 rounded-lg border-border/70 bg-background/80"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Field>
                <Button
                  type="submit"
                  disabled={resetPasswordMutation.isPending}
                  className="h-11 w-full rounded-lg bg-linear-to-r from-primary to-primary/85 font-semibold shadow-md shadow-primary/20 hover:from-primary/90 hover:to-primary"
                >
                  {resetPasswordMutation.isPending && <Spinner className="mr-2" />}
                  Đặt lại mật khẩu
                </Button>
                <FieldDescription className="pt-1 text-center text-sm">
                  Đã nhớ mật khẩu?{' '}
                  <Link href={PATH.LOGIN} className="font-semibold text-primary underline-offset-4 hover:underline">
                    Đăng nhập
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-4 text-center text-xs leading-relaxed md:px-6">
        Bằng cách tiếp tục, bạn đồng ý với{' '}
        <a href="#" className="font-medium text-primary underline-offset-4 hover:underline">
          Điều khoản dịch vụ
        </a>{' '}
        và{' '}
        <a href="#" className="font-medium text-primary underline-offset-4 hover:underline">
          Chính sách bảo mật
        </a>
        .
      </FieldDescription>
    </div>
  )
}
