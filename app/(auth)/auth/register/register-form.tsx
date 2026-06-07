'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { SendIcon } from 'lucide-react'
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
import useSendOTP from '@/hooks/use-send-otp'
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

  const { sendOTPMutation } = useSendOTP({
    onError: (error) => {
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
    registerMutation.mutate(data)
  })

  return (
    <div className={cn('flex flex-col gap-4', className)} {...props}>
      <Card className="relative overflow-hidden border-border/60 bg-card/95 shadow-xl shadow-black/5 backdrop-blur-sm">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-r from-primary/20 via-primary/5 to-transparent" />
        <CardHeader className="relative space-y-2 pb-4 text-center">
          <CardTitle className="text-2xl font-extrabold tracking-tight">Tạo tài khoản mới</CardTitle>
          <CardDescription className="text-[15px]">
            Điền thông tin bên dưới để bắt đầu mua sắm cùng Nest Ecom.
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <form onSubmit={onSubmit}>
            <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="space-y-3 rounded-lg border border-border/60 bg-linear-to-b from-primary/10 via-background/80 to-background p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Bước 1</p>
                <p className="text-lg font-semibold text-foreground">Bạn tham gia Nest Ecom với vai trò nào?</p>

                <Controller
                  control={form.control}
                  name="roleId"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
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
                        className="grid grid-cols-1 gap-2.5"
                      >
                        <FieldLabel htmlFor="client" className="cursor-pointer">
                          <Field
                            orientation="vertical"
                            className="h-full rounded-lg border border-border/70 bg-background/80 p-4 transition-all hover:border-primary/40 hover:bg-primary/5 has-data-[state=checked]:border-primary/70 has-data-[state=checked]:bg-primary/10"
                          >
                            <FieldContent>
                              <FieldTitle className="text-sm font-semibold">Người mua hàng</FieldTitle>
                              <FieldDescription className="text-xs leading-relaxed">
                                Mua sắm dễ dàng với trải nghiệm cá nhân hóa và hỗ trợ khách hàng tuyệt vời.
                              </FieldDescription>
                            </FieldContent>
                            <RadioGroupItem value="3" id="client" className="sr-only" />
                          </Field>
                        </FieldLabel>
                        <FieldLabel htmlFor="seller" className="cursor-pointer">
                          <Field
                            orientation="vertical"
                            className="h-full rounded-lg border border-border/70 bg-background/80 p-4 transition-all hover:border-primary/40 hover:bg-primary/5 has-data-[state=checked]:border-primary/70 has-data-[state=checked]:bg-primary/10"
                          >
                            <FieldContent>
                              <FieldTitle className="text-sm font-semibold">Nhà bán hàng</FieldTitle>
                              <FieldDescription className="text-xs leading-relaxed">
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

                <div className="rounded-md bg-primary/10 px-3 py-2 text-xs text-muted-foreground">
                  Chọn đúng vai trò giúp hệ thống cá nhân hóa trải nghiệm ngay sau khi đăng ký.
                </div>
              </div>

              <FieldGroup className="grid gap-3 md:grid-cols-2">
                <div className="rounded-lg border border-border/60 bg-background/70 p-3 md:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Bước 2</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    Điền thông tin tài khoản và xác minh email
                  </p>
                </div>

                <Controller
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="md:col-span-2">
                      <FieldLabel htmlFor="email" className="text-sm font-semibold">
                        Email
                      </FieldLabel>
                      <Input
                        {...field}
                        id="email"
                        type="text"
                        placeholder="m@example.com"
                        className="h-11 rounded-lg border-border/70 bg-background/80"
                      />
                      <FieldDescription className="text-xs leading-relaxed">
                        Email này sẽ được sử dụng để nhận mã xác minh 6 chữ số để điền vào ô bên dưới.
                      </FieldDescription>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name="code"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="md:col-span-2">
                      <div className="mb-1 flex items-center justify-between">
                        <FieldLabel htmlFor="otp-verification" className="text-sm font-semibold">
                          Mã xác minh
                        </FieldLabel>
                        <Button
                          type="button"
                          variant="outline"
                          size="xs"
                          className="rounded-md border-border/70 bg-background/80 font-medium"
                          disabled={sendOTPMutation.isPending}
                          onClick={handleSendOTP}
                        >
                          {!sendOTPMutation.isPending && <SendIcon />}
                          {sendOTPMutation.isPending && <Spinner />}
                          Gửi mã
                        </Button>
                      </div>
                      <InputOTP
                        {...field}
                        maxLength={6}
                        id="otp-verification"
                        containerClassName="w-full justify-center"
                      >
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
                      <FieldLabel htmlFor="confirm-password" className="text-sm font-semibold">
                        Xác nhận mật khẩu
                      </FieldLabel>
                      <Input
                        {...field}
                        id="confirm-password"
                        type="password"
                        placeholder="********"
                        className="h-11 rounded-lg border-border/70 bg-background/80"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Field className="md:col-span-2">
                  <Button
                    type="submit"
                    disabled={registerMutation.isPending}
                    className="h-11 w-full rounded-lg bg-linear-to-r from-primary to-primary/85 font-semibold shadow-md shadow-primary/20 hover:from-primary/90 hover:to-primary"
                  >
                    {registerMutation.isPending && <Spinner className="mr-2" />}
                    Tạo tài khoản
                  </Button>
                  <FieldDescription className="pt-1 text-center text-sm">
                    Đã có tài khoản?{' '}
                    <Link href={PATH.LOGIN} className="font-semibold text-primary underline-offset-4 hover:underline">
                      Đăng nhập
                    </Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </div>
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
