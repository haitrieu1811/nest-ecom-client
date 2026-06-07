import { GalleryVerticalEnd } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'

import RegisterForm from '@/app/(auth)/auth/register/register-form'
import PATH from '@/constants/path'

export const metadata: Metadata = {
  title: 'Đăng ký',
  description: 'Tạo tài khoản mới để trải nghiệm mua sắm và trở thành một phần của cộng đồng Nest Ecom.',
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-5xl flex-col gap-6">
        <Link href={PATH.HOME} className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Nest Ecom.
        </Link>
        <RegisterForm />
      </div>
    </div>
  )
}
