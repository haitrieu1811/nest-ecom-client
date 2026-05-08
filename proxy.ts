import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import PATH from '@/constants/path'

// Đăng nhập rồi thì không cho vào những trang này nữa
const AUTH_PATHS = ['/auth']

// Chưa đăng nhập thì không cho vào những trang này
const PRIVATE_PATHS = ['/account']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const accessToken = request.cookies.get('accessToken')?.value

  // Chưa đăng nhập thi không cho vào trang private
  if (!accessToken && PRIVATE_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL(PATH.LOGIN, request.url))
  }

  // Đăng nhập rồi thì không cho vào các trang auth nữa
  if (accessToken && AUTH_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL(PATH.HOME, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/auth/:path*', '/account/:path*'],
}
