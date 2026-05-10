'use client'

import { usePathname } from 'next/navigation'
import React from 'react'

import { handleCheckAndRefreshToken } from '@/lib/utils'

const UNAUTHORIZED_PATHS = ['/auth/login', '/auth/register', '/auth/reset-password', '/auth/refresh-token']

export default function RefreshToken() {
  const pathname = usePathname()

  React.useEffect(() => {
    // Không cần refresh token nếu đang ở các trang không yêu cầu xác thực
    if (UNAUTHORIZED_PATHS.includes(pathname)) return

    const TIME_OUT_TO_REFRESH_TOKEN = 1000 // 1 giây

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let interval: any = null

    // Khởi chạy hàm handleCheckAndRefreshToken ngay khi component được mount để kiểm tra và refresh token ngay lập tức
    handleCheckAndRefreshToken({
      onError() {
        clearInterval(interval)
      },
    })

    // Sau đó thiết lập interval để tự động kiểm tra và refresh token sau mỗi 1 phút
    interval = setInterval(handleCheckAndRefreshToken, TIME_OUT_TO_REFRESH_TOKEN)

    return () => {
      clearInterval(interval)
    }
  }, [pathname])

  return null
}
