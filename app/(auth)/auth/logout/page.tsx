'use client'

import useLogout from '@/hooks/use-logout'
import http from '@/lib/http'
import { getRefreshTokenFromLS } from '@/lib/utils'
import { useSearchParams } from 'next/navigation'
import React from 'react'

export default function LogoutPage() {
  const ref = React.useRef<boolean>(false)

  const searchParams = useSearchParams()
  const refreshToken = searchParams.get('refreshToken')

  React.useEffect(() => {
    if (ref.current || refreshToken !== getRefreshTokenFromLS()) return
    ref.current = true
    http.post('auth/logout', { refreshToken }).then(() => {
      ref.current = false
    })
  }, [refreshToken])

  return null
}
