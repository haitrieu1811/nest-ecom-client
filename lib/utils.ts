/* eslint-disable @typescript-eslint/no-explicit-any */

import { clsx, type ClassValue } from 'clsx'
import jsonwebtoken, { DecodeOptions } from 'jsonwebtoken'
import { UseFormSetError } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'

import { EntityError, HttpError } from '@/lib/http'
import { AccessTokenPayload, ProfileInLSType, RefreshTokenPayload } from '@/types/utils.type'
import authApi from '@/apis/auth.api'
import { toast } from 'sonner'
import { PermissionInRoleType } from '@/schemas/role.schema'
import { PermissionType } from '@/schemas/permission.schema'

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

export const clearAuthFromLS = () => {
  if (isBrowser) {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('profile')
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
  } else if (error instanceof HttpError) {
    toast.error(error.payload.message || 'Có lỗi xảy ra!')
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
  const now = new Date().getTime() / 1000 - 1

  // Nếu refresh token hết hạn thì không cần refresh token nữa mà cho logout luôn
  if (decodedRefreshToken.exp <= now) {
    clearAuthFromLS()
    onError?.()
    return
  }

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
      onSuccess?.()
    } catch {
      clearAuthFromLS()
      onError?.()
    }
  }
}

type GroupedPermissions = Record<string, PermissionInRoleType[]>

export const groupPermissionsByModule = (permissions: PermissionInRoleType[]): GroupedPermissions => {
  return permissions.reduce<GroupedPermissions>((acc, permission) => {
    // /auth/register -> auth
    // /users/:id -> users
    // / -> root
    const moduleName = permission.path.split('/').filter(Boolean)[0] || 'root'

    if (!acc[moduleName]) {
      acc[moduleName] = []
    }

    acc[moduleName].push(permission)

    return acc
  }, {})
}

type PermissionGroup = {
  module: string
  permissions: PermissionInRoleType[]
}

export const groupPermissionsByModuleArray = (
  permissions: PermissionInRoleType[] | PermissionType[],
): PermissionGroup[] => {
  const grouped = groupPermissionsByModule(permissions)
  return Object.entries(grouped).map(([module, permissions]) => ({
    module,
    permissions,
  }))
}

export const generateNameId = (name: string, id: number) => {
  const slug = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return `${slug}-i-${id}`
}

export const extractIdFromNameId = (nameId: string) => {
  const parts = nameId.split('-i-')
  const idPart = parts[parts.length - 1]
  const id = parseInt(idPart, 10)
  return isNaN(id) ? null : id
}

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value)
}
