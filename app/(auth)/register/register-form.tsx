'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { RefreshCwIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import authApi from '@/apis/auth.api'
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
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Spinner } from '@/components/ui/spinner'
import { VERIFICATION_CODE_TYPE } from '@/constants/auth.constant'
import PATH from '@/constants/path'
import { cn, handleErrorFromAPI } from '@/lib/utils'
import { useAppStore } from '@/providers/app.provider'
import { RegisterBodySchema, RegisterBodyType } from '@/schemas/auth.schema'

export default function RegisterForm({ className, ...props }: React.ComponentProps<'div'>) {
  const router = useRouter()

  const { setIsAuthenticated, setProfile } = useAppStore()

  const form = useForm<RegisterBodyType>({
    resolver: zodResolver(RegisterBodySchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      code: '',
      roleId: 3,
    },
  })

  const sendOTPMutation = useMutation({
    mutationKey: ['send-otp'],
    mutationFn: authApi.sendOTP,
    onSuccess(data) {
      toast.success(data.payload.message)
    },
    onError(error) {
      handleErrorFromAPI({
        error,
        setError: form.setError,
      })
    },
  })

  const registerMutation = useMutation({
    mutationKey: ['register'],
    mutationFn: authApi.register,
    onSuccess(data) {
      toast.success('Đăng ký thành công.')
      form.reset()
      setIsAuthenticated(true)
      setProfile(data.payload.user)
      router.push(PATH.ACCOUNT)
    },
    onError(error) {
      handleErrorFromAPI({
        error,
        setError: form.setError,
      })
    },
  })

  const handleSendOTP = () => {
    if (!form.getValues('email')) return
    sendOTPMutation.mutate({ email: form.getValues('email'), type: VERIFICATION_CODE_TYPE.REGISTER })
  }

  const onSubmit = form.handleSubmit((data) => {
    console.log(data)
    registerMutation.mutate(data)
  })

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Đăng ký tài khoản</CardTitle>
          <CardDescription>Nhập email của bạn bên dưới để tạo tài khoản</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <FieldGroup>
              {/* Role */}
              <Controller
                control={form.control}
                name="roleId"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Bạn là?</FieldLabel>
                    <RadioGroup
                      name={field.name}
                      value={String(field.value ?? '')}
                      onValueChange={(value) => {
                        const roleId = Number.parseInt(value, 10)
                        if (!Number.isNaN(roleId)) {
                          field.onChange(roleId)
                        }
                      }}
                      onBlur={field.onBlur}
                      className="grid grid-cols-2 gap-3"
                    >
                      <FieldLabel htmlFor="client">
                        <Field orientation="vertical">
                          <FieldContent>
                            <FieldTitle>Người mua hàng</FieldTitle>
                            <FieldDescription>
                              Mua sắm dễ dàng với trải nghiệm cá nhân hóa và hỗ trợ khách hàng tuyệt vời.
                            </FieldDescription>
                          </FieldContent>
                          <RadioGroupItem value="3" id="client" className="sr-only" />
                        </Field>
                      </FieldLabel>
                      <FieldLabel htmlFor="seller">
                        <Field orientation="vertical">
                          <FieldContent>
                            <FieldTitle>Nhà bán hàng</FieldTitle>
                            <FieldDescription>
                              Bán hàng hiệu quả với công cụ quản lý sản phẩm và đơn hàng mạnh mẽ.
                            </FieldDescription>
                          </FieldContent>
                          <RadioGroupItem value="2" id="seller" className="sr-only" />
                        </Field>
                      </FieldLabel>
                    </RadioGroup>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              {/* Email */}
              <Controller
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input {...field} id="email" type="text" placeholder="m@example.com" />
                    <FieldDescription>
                      Email này sẽ được sử dụng để nhận mã xác minh 6 chữ số để điền vào ô bên dưới.
                    </FieldDescription>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              {/* OTP Verification */}
              <Controller
                control={form.control}
                name="code"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex items-center justify-between">
                      <FieldLabel htmlFor="otp-verification">Mã xác minh</FieldLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="xs"
                        disabled={sendOTPMutation.isPending}
                        onClick={handleSendOTP}
                      >
                        {!sendOTPMutation.isPending && <RefreshCwIcon />}
                        {sendOTPMutation.isPending && <Spinner />}
                        Gửi lại mã
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
              {/* Mật khẩu */}
              <Controller
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
                    <Input {...field} id="password" type="password" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              {/* Xác nhận mật khẩu */}
              <Controller
                control={form.control}
                name="confirmPassword"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="confirm-password">Xác nhận mật khẩu</FieldLabel>
                    <Input {...field} id="confirm-password" type="password" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Field>
                <Button type="submit" disabled={registerMutation.isPending}>
                  {registerMutation.isPending && <Spinner />}
                  Tạo tài khoản
                </Button>
                <FieldDescription className="text-center">
                  Đã có tài khoản? <Link href={PATH.LOGIN}>Đăng nhập</Link>
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
