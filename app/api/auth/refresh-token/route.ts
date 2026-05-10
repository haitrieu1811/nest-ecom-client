import { cookies } from 'next/headers'

import authApi from '@/apis/auth.api'
import { jwtDecoded } from '@/lib/utils'
import { AccessTokenPayload, RefreshTokenPayload } from '@/types/utils.type'

export async function POST() {
  const cookieStore = await cookies()

  const refreshToken = cookieStore.get('refreshToken')?.value

  if (!refreshToken) {
    return Response.json(
      {
        message: 'Không tìm thấy refresh token !',
      },
      {
        status: 401,
      },
    )
  }

  try {
    const res = await authApi.sRefreshToken({ refreshToken })
    const decodedAccessToken = jwtDecoded<AccessTokenPayload>(res.payload.accessToken)
    const decodedRefreshToken = jwtDecoded<RefreshTokenPayload>(res.payload.refreshToken)
    cookieStore.set('accessToken', res.payload.accessToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      expires: decodedAccessToken.exp * 1000,
    })
    cookieStore.set('refreshToken', res.payload.refreshToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      expires: decodedRefreshToken.exp * 1000,
    })
    return Response.json(res.payload)
  } catch {
    return Response.json(
      {
        message: 'Có lỗi xảy ra !',
      },
      {
        status: 401,
      },
    )
  }
}
