'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

import authApi from '@/apis/auth.api'
import PATH from '@/constants/path'
import { useAppStore } from '@/providers/app.provider'
import { ProfileInLSType } from '@/types/utils.type'

export default function OauthGoogleCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setProfile, setIsAuthenticated } = useAppStore()

  const accessToken = searchParams.get('accessToken')
  const refreshToken = searchParams.get('refreshToken')
  const user = (searchParams.get('user') ? JSON.parse(searchParams.get('user')!) : null) as ProfileInLSType | null

  React.useEffect(() => {
    ;(async () => {
      if (accessToken && refreshToken && user) {
        await authApi.setTokens({ accessToken, refreshToken, user })
        setProfile(user)
        setIsAuthenticated(true)
        router.push(PATH.ACCOUNT)
      }
    })()
  }, [accessToken, refreshToken, user, router, setProfile, setIsAuthenticated])

  return <React.Fragment></React.Fragment>
}
