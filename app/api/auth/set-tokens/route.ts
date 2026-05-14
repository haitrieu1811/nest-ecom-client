import { cookies } from 'next/headers'

import { jwtDecoded } from '@/lib/utils'
import { AccessTokenPayload, ProfileInLSType, RefreshTokenPayload } from '@/types/utils.type'

export async function POST(request: Request) {
  const body = (await request.json()) as { accessToken: string; refreshToken: string; user: ProfileInLSType }
  try {
    const { accessToken, refreshToken, user } = body
    const decodedAccessToken = jwtDecoded<AccessTokenPayload>(accessToken)
    const decodedRefreshToken = jwtDecoded<RefreshTokenPayload>(refreshToken)
    const cookieStore = await cookies()
    cookieStore.set('accessToken', accessToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      expires: decodedAccessToken.exp * 1000,
    })
    cookieStore.set('refreshToken', refreshToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      expires: decodedRefreshToken.exp * 1000,
    })
    cookieStore.set('roleName', user.role.name, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      expires: decodedRefreshToken.exp * 1000,
    })
    return Response.json({
      accessToken,
      refreshToken,
      user,
    })
  } catch {
    return Response.json(
      {
        message: 'Có lỗi xảy ra !',
      },
      {
        status: 500,
      },
    )
  }
}
