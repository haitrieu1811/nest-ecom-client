'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import authApi from '@/apis/auth.api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSeparator } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import InputPassword from '@/components/input-password'
import { Spinner } from '@/components/ui/spinner'
import PATH from '@/constants/path'
import { clearAuthFromLS, cn, handleErrorFromAPI } from '@/lib/utils'
import { useAppStore } from '@/providers/app.provider'
import { LoginBodySchema, LoginBodyType } from '@/schemas/auth.schema'

export default function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  const router = useRouter()

  const searchParams = useSearchParams()
  const clearTokens = searchParams.get('clearTokens')

  const { setIsAuthenticated, setProfile } = useAppStore()

  // Trường hợp lâu ngày không đăng nhập rồi truy cập vào trang private thì sẽ bị proxy redirect về trang login với query clearTokens=true để xóa tokens trong localStorage và state
  React.useEffect(() => {
    if (clearTokens !== 'true') return
    clearAuthFromLS()
    setIsAuthenticated(false)
    setProfile(null)
  }, [clearTokens, setIsAuthenticated, setProfile])

  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBodySchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const loginMutation = useMutation({
    mutationKey: ['login'],
    mutationFn: authApi.login,
    onSuccess: (res) => {
      setIsAuthenticated(true)
      setProfile(res.payload.user)
      form.reset()
      toast.success('Đăng nhập thành công!')
      router.push(PATH.HOME)
    },
    onError: (error) => {
      handleErrorFromAPI({
        error,
        setError: form.setError,
      })
    },
  })

  const onSubmit = form.handleSubmit((data) => {
    loginMutation.mutate(data)
  })

  const handleLoginWithGoogle = async () => {
    const res = await authApi.getGoogleOauth2Url()
    window.location.href = res.payload.url
  }

  return (
    <div className={cn('flex flex-col gap-4 w-full max-w-[360px] mx-auto', className)} {...props}>
      <Card className="relative overflow-hidden border border-border/60 bg-card/80 shadow-md backdrop-blur-md rounded-xl p-4 sm:p-5">
        <CardHeader className="relative space-y-1.5 pb-3 text-center">
          <CardTitle className="text-2xl font-extrabold tracking-tight">Chào mừng trở lại! 👋</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Nhập thông tin đăng nhập để tiếp tục mua sắm cùng Nest Ecom.
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <form onSubmit={onSubmit}>
            <FieldGroup className="space-y-3">
              <Field>
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleLoginWithGoogle}
                  className="h-10 w-full rounded-lg border border-border/70 bg-background/50 font-semibold shadow-xs hover:bg-muted/70 flex items-center justify-center gap-2.5 transition-all duration-200"
                >
                  <svg className="size-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  Đăng nhập với Google
                </Button>
              </Field>
              <FieldSeparator className="text-muted-foreground/80 *:data-[slot=field-separator-content]:bg-card/0 text-xs uppercase tracking-wider font-semibold">
                Hoặc đăng nhập bằng email
              </FieldSeparator>
              <Controller
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="email"
                      className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                    >
                      Email
                    </FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className="h-10 rounded-lg border border-border/70 bg-background/50 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all duration-200"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex items-center justify-between">
                      <FieldLabel
                        htmlFor="password"
                        className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                      >
                        Mật khẩu
                      </FieldLabel>
                      <Link
                        href={PATH.RESET_PASSWORD}
                        className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                      >
                        Quên mật khẩu?
                      </Link>
                    </div>
                    <InputPassword
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id="password"
                      placeholder="••••••••"
                      className="h-10 rounded-lg border border-border/70 bg-background/50 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all duration-200"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Field className="pt-1">
                <Button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="h-10 w-full rounded-lg bg-primary font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-all duration-200"
                >
                  {loginMutation.isPending && <Spinner className="mr-2" />}
                  Đăng nhập
                </Button>
                <FieldDescription className="pt-2 text-center text-sm">
                  Chưa có tài khoản?{' '}
                  <Link href={PATH.REGISTER} className="font-semibold text-primary underline-offset-4 hover:underline">
                    Đăng ký ngay
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-4 text-center text-xs leading-relaxed md:px-6 text-muted-foreground/80">
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
