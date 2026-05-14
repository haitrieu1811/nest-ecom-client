import { cookies } from 'next/headers'

import authApi from '@/apis/auth.api'
import { jwtDecoded } from '@/lib/utils'
import { RegisterBodyType } from '@/schemas/auth.schema'
import { AccessTokenPayload, RefreshTokenPayload } from '@/types/utils.type'
import { HttpError } from '@/lib/http'

export async function POST(request: Request) {
  const body = (await request.json()) as RegisterBodyType
  try {
    const res = await authApi.sRegister(body)
    const { accessToken, refreshToken } = res.payload
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
    cookieStore.set('roleName', res.payload.user.role.name, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      expires: decodedRefreshToken.exp * 1000,
    })
    return Response.json(res.payload)
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status,
      })
    } else {
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
}
