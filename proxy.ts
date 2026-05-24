import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { ROLE_NAME } from '@/constants/auth.constant'
import PATH from '@/constants/path'

const AUTH_PATHS = ['/auth']
const PRIVATE_PATHS = ['/account']
const DASHBOARD_PATHS = [PATH.DASHBOARD]
const ADMIN_MANAGER_ONLY_PATHS = [
  PATH.DASHBOARD_USERS,
  PATH.DASHBOARD_ROLES,
  PATH.DASHBOARD_PERMISSIONS,
  PATH.DASHBOARD_CATEGORIES,
  PATH.DASHBOARD_BRANDS,
]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value
  const roleName = request.cookies.get('roleName')?.value

  // Chưa đăng nhập thi không cho vào trang private, dashboard
  if (!refreshToken && [...PRIVATE_PATHS, ...DASHBOARD_PATHS].some((path) => pathname.startsWith(path))) {
    const url = new URL(PATH.LOGIN, request.url)
    url.searchParams.set('clearTokens', 'true')
    return NextResponse.redirect(url)
  }

  // Đăng nhập rồi thì không cho vào các trang auth nữa ngoại trừ trang refreshToken và logout
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

  // Trường hơp hết hạn accessToken nhưng refreshToken vẫn còn hạn mà truy cập vào trang private -> redirect về trang refreshToken để lấy accessToken mới
  if (
    refreshToken &&
    !accessToken &&
    [...PRIVATE_PATHS, ...DASHBOARD_PATHS].some((path) => pathname.startsWith(path))
  ) {
    const url = new URL(PATH.REFRESH_TOKEN, request.url)
    url.searchParams.set('refreshToken', refreshToken)
    url.searchParams.set('redirectPath', pathname)
    return NextResponse.redirect(url)
  }

  // Trường hợp không phải là ADMIN, MANAGER, SELLER thì không dược vào các trang `/dashboard`
  if (refreshToken && roleName && DASHBOARD_PATHS.some((path) => pathname.startsWith(path))) {
    const allowedRoles: string[] = [ROLE_NAME.ADMIN, ROLE_NAME.MANAGER, ROLE_NAME.SELLER]
    if (!allowedRoles.includes(roleName)) {
      return NextResponse.redirect(new URL(PATH.HOME, request.url))
    }
    // Chỉ ADMIN mơi được quyền vào trang dashboard/users, dashboard/roles, dashboard/permissions, dashboard/categoríe, dashboard/brands
    const allowedRolesForAdminManagerOnlyPaths: string[] = [ROLE_NAME.ADMIN, ROLE_NAME.MANAGER]
    if (
      !allowedRolesForAdminManagerOnlyPaths.includes(roleName) &&
      ADMIN_MANAGER_ONLY_PATHS.some((path) => pathname.startsWith(path))
    ) {
      return NextResponse.redirect(new URL(PATH.DASHBOARD, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/auth/:path*', '/account/:path*', '/dashboard/:path*'],
}
