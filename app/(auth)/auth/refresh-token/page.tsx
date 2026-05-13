'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

import { getRefreshTokenFromLS, handleCheckAndRefreshToken } from '@/lib/utils'
import PATH from '@/constants/path'

export default function RefreshTokenPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const refreshToken = searchParams.get('refreshToken')
  const redirectPath = searchParams.get('redirectPath') || PATH.HOME

  React.useEffect(() => {
    if (refreshToken && refreshToken === getRefreshTokenFromLS()) {
      handleCheckAndRefreshToken({
        onSuccess() {
          router.push(redirectPath)
        },
      })
    }
  }, [refreshToken, redirectPath, router])

  return null
}
