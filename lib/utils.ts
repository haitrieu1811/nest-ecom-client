/* eslint-disable @typescript-eslint/no-explicit-any */

import { EntityError } from '@/lib/http'
import { clsx, type ClassValue } from 'clsx'
import jsonwebtoken, { DecodeOptions } from 'jsonwebtoken'
import { UseFormSetError } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

/**
 * Xóa đi ký tự `/` đầu tiên của path
 */
export const normalizePath = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path
}

export const isBrowser = typeof window !== 'undefined'

export const getAccessTokenFromLS = () => (isBrowser ? localStorage.getItem('accessToken') : null)

export const getRefreshTokenFromLS = () => (isBrowser ? localStorage.getItem('refreshToken') : null)

export const getProfileFromLS = () => {
  if (!isBrowser) return null
  const profile = localStorage.getItem('profile')
  return profile ? JSON.parse(profile) : null
}

export const setAccessTokenToLS = (token: string) => {
  if (isBrowser) {
    localStorage.setItem('accessToken', token)
  }
}

export const setRefreshTokenToLS = (token: string) => {
  if (isBrowser) {
    localStorage.setItem('refreshToken', token)
  }
}

export const setProfileToLS = (profile: any) => {
  if (isBrowser) {
    localStorage.setItem('profile', JSON.stringify(profile))
  }
}

export const setAccessTokenExpiresAtToLS = (expiresAt: string) => {
  if (isBrowser) {
    localStorage.setItem('accessTokenExpiresAt', expiresAt)
  }
}

export const getAccessTokenExpiresAtFromLS = () => {
  if (!isBrowser) return null
  return localStorage.getItem('accessTokenExpiresAt')
}

export const setRefreshTokenExpiresAtToLS = (expiresAt: string) => {
  if (isBrowser) {
    localStorage.setItem('refreshTokenExpiresAt', expiresAt)
  }
}

export const getRefreshTokenExpiresAtFromLS = () => {
  if (!isBrowser) return null
  return localStorage.getItem('refreshTokenExpiresAt')
}

export const clearAuthFromLS = () => {
  if (isBrowser) {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('profile')
    localStorage.removeItem('accessTokenExpiresAt')
    localStorage.removeItem('refreshTokenExpiresAt')
  }
}

export const handleErrorFromAPI = ({ error, setError }: { error: any; setError?: UseFormSetError<any> }) => {
  if (error instanceof EntityError) {
    error.payload.message.forEach((msg) => {
      setError?.(msg.path, {
        type: 'server',
        message: msg.message,
      })
    })
  }
}

export const jwtDecoded = <TokenPayload>(token: string, options?: DecodeOptions & { complete: true }) => {
  const decoded = jsonwebtoken.decode(token, options) as TokenPayload
  return decoded
}
