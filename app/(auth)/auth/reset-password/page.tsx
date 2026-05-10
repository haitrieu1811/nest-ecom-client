import { GalleryVerticalEnd } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'

import ResetPasswordForm from '@/app/(auth)/auth/reset-password/reset-password-form'
import PATH from '@/constants/path'

export const metadata: Metadata = {
  title: 'Đặt lại mật khẩu',
  description: 'Đặt lại mật khẩu cho tài khoản của bạn',
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href={PATH.HOME} className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Nest Ecom.
        </Link>
        <ResetPasswordForm />
      </div>
    </div>
  )
}
