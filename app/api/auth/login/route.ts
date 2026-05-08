import { cookies } from 'next/headers'

import authApi from '@/apis/auth.api'
import { HttpError } from '@/lib/http'
import { jwtDecoded } from '@/lib/utils'
import { LoginBodyType } from '@/schemas/auth.schema'
import { AccessTokenPayload, RefreshTokenPayload } from '@/types/utils.type'

export async function POST(request: Request) {
  const body = (await request.json()) as LoginBodyType
  try {
    const res = await authApi.sLogin(body)
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
