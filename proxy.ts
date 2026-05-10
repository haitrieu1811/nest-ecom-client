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
  const refreshToken = request.cookies.get('refreshToken')?.value

  // Chưa đăng nhập thi không cho vào trang private
  if (!refreshToken && PRIVATE_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL(PATH.LOGIN, request.url))
  }

  // Đăng nhập rồi thì không cho vào các trang auth nữa
  if (
    refreshToken &&
    AUTH_PATHS.some(
      (path) =>
        pathname.startsWith(path) &&
        [PATH.REFRESH_TOKEN, PATH.LOGOUT].every((unauthorizedPath) => !pathname.startsWith(unauthorizedPath)),
    )
  ) {
    return NextResponse.redirect(new URL(PATH.HOME, request.url))
  }

  // Trường hơp hết hạn accessToken nhưng refreshToken vẫn còn hạn mà truy cập vào trang private
  if (refreshToken && !accessToken && PRIVATE_PATHS.some((path) => pathname.startsWith(path))) {
    const url = new URL(PATH.REFRESH_TOKEN, request.url)
    url.searchParams.set('refreshToken', refreshToken)
    url.searchParams.set('redirectPath', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/auth/:path*', '/account/:path*'],
}
