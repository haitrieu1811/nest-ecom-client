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
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-background p-6 md:p-10">
      {/* Glow background blobs */}
      <div className="absolute top-[-10%] left-[-10%] size-96 rounded-full bg-primary/10 blur-3xl dark:bg-primary/5" />
      <div className="absolute bottom-[-10%] right-[-10%] size-96 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/5" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-size-[24px_24px] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_80%,transparent_100%)] opacity-70" />

      <div className="relative flex w-full max-w-md flex-col gap-6">
        <Link href={PATH.HOME} className="flex items-center gap-2.5 self-center font-bold text-lg group">
          <div className="flex size-9 items-center justify-center rounded-xl bg-linear-to-tr from-primary via-indigo-500 to-violet-600 text-white shadow-md shadow-primary/20 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
            <GalleryVerticalEnd className="size-5" />
          </div>
          <span className="bg-linear-to-r from-primary via-indigo-500 to-violet-600 bg-clip-text text-transparent text-xl tracking-tight">
            Nest Ecom
          </span>
        </Link>
        <LoginForm />
      </div>
    </div>
  )
}
