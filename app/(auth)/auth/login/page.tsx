import { GalleryVerticalEnd } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'

import LoginForm from '@/app/(auth)/auth/login/login-form'
import PATH from '@/constants/path'

export const metadata: Metadata = {
  title: 'Đăng nhập - Nest Ecom.',
  description: 'Đăng nhập vào tài khoản của bạn để trải nghiệm mua sắm tuyệt vời tại Nest Ecom.',
}

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href={PATH.HOME} className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Nest Ecom.
        </Link>
        <LoginForm />
      </div>
    </div>
  )
}
