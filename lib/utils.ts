/* eslint-disable @typescript-eslint/no-explicit-any */

import { clsx, type ClassValue } from 'clsx'
import jsonwebtoken, { DecodeOptions } from 'jsonwebtoken'
import { UseFormSetError } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'

import { EntityError } from '@/lib/http'
import { AccessTokenPayload, ProfileInLSType, RefreshTokenPayload } from '@/types/utils.type'
import authApi from '@/apis/auth.api'

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

export const getProfileFromLS = (): ProfileInLSType | null => {
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

export const setProfileToLS = (profile: ProfileInLSType) => {
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

export const handleCheckAndRefreshToken = async ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void
  onError?: () => void
} = {}) => {
  const accessToken = getAccessTokenFromLS()
  const refreshToken = getRefreshTokenFromLS()

  // Nếu chưa đăng nhập thì không cần refresh token
  if (!accessToken || !refreshToken) return

  const decodedAccessToken = jwtDecoded<AccessTokenPayload>(accessToken)
  const decodedRefreshToken = jwtDecoded<RefreshTokenPayload>(refreshToken)

  /**
   * Thời điểm hết hạn của access token và refresh token được tính bằng epoch time (s)
   * còn khi sử dụng cú pháp new Date().getTime() thì sẽ trả về epoch time (ms) nên cần phải chia cho 1000 để có thể so sánh được
   */
  const now = new Date().getTime() / 1000

  // Nếu refresh token hết hạn thì không cần refresh token nữa
  if (decodedRefreshToken.exp <= now) return

  /**
   * Ví dụ nếu access token có thời hạn 10 giây
   * thì sẽ kiểm tra 1/3 thời gian còn lại của access token, tức là 3.33 giây trước khi access token hết hạn thì sẽ thực hiện refresh token
   *
   * Thời gian còn lại của access token được tính theo công thức: decodedAccessToken.exp - now
   * Thời gian hết hạn của access token được tính theo công thức: decodedAccessToken.exp - decodedAccessToken.iat
   */
  const shouldRefreshToken = decodedAccessToken.exp - now <= (decodedAccessToken.exp - decodedAccessToken.iat) / 3
  if (shouldRefreshToken) {
    try {
      const res = await authApi.refreshToken()
      setAccessTokenToLS(res.payload.accessToken)
      setRefreshTokenToLS(res.payload.refreshToken)
      setAccessTokenExpiresAtToLS(
        new Date(jwtDecoded<AccessTokenPayload>(res.payload.accessToken).exp * 1000).toISOString(),
      )
      setRefreshTokenExpiresAtToLS(
        new Date(jwtDecoded<RefreshTokenPayload>(res.payload.refreshToken).exp * 1000).toISOString(),
      )
      onSuccess?.()
    } catch {
      onError?.()
    }
  }
}
