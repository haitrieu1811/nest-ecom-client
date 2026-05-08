import { cookies } from 'next/headers'

import authApi from '@/apis/auth.api'

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
    const res = await authApi.sLogout({ refreshToken })
    cookieStore.delete('accessToken')
    cookieStore.delete('refreshToken')
    return Response.json(res.payload)
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
