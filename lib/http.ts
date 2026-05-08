/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  LOGIN_API_ENDPOINT,
  LOGOUT_API_ENDPOINT,
  REGISTER_API_ENDPOINT,
  SET_TOKENS_API_ENDPOINT,
} from '@/apis/auth.api'
import envConfig from '@/config'
import {
  clearAuthFromLS,
  getAccessTokenFromLS,
  isBrowser,
  jwtDecoded,
  normalizePath,
  setAccessTokenExpiresAtToLS,
  setAccessTokenToLS,
  setProfileToLS,
  setRefreshTokenExpiresAtToLS,
  setRefreshTokenToLS,
} from '@/lib/utils'
import { LoginResType } from '@/schemas/auth.schema'
import { AccessTokenPayload, RefreshTokenPayload } from '@/types/utils.type'

const ENTITY_ERROR_STATUS = 422
// const UNAUTHORIZED_ERROR_STATUS = 401

type CustomOptions = Omit<RequestInit, 'method'> & {
  baseUrl?: string
}

type BaseHeaders = {
  [k: string]: string
}

export class HttpError extends Error {
  status: number
  payload: any

  constructor({ status, payload, message = 'Lỗi HTTP!' }: { status: number; payload: any; message?: string }) {
    super(message)
    this.status = status
    this.payload = payload
  }
}

type EntityErrorPayload = {
  error: string
  statusCode: number
  message: {
    path: string
    message: string
  }[]
}

export class EntityError extends HttpError {
  status: typeof ENTITY_ERROR_STATUS
  payload: EntityErrorPayload

  constructor({ status, payload }: { status: typeof ENTITY_ERROR_STATUS; payload: EntityErrorPayload }) {
    super({
      message: 'Lỗi thực thể!',
      status,
      payload,
    })
    this.status = status
    this.payload = payload
  }
}

const request = async <Response>(path: string, method: 'GET' | 'PUT' | 'POST' | 'DELETE', options?: CustomOptions) => {
  // Nếu truyền baseUrl là "" thì sẽ gọi đến Next.js API route, nếu không truyền baseUrl thì sẽ gọi đến API server
  const baseUrl = options?.baseUrl === undefined ? envConfig.NEXT_PUBLIC_API_URL : options.baseUrl
  const fullUrl = `${baseUrl}/${normalizePath(path)}`

  let body: FormData | string | undefined = undefined
  if (options?.body instanceof FormData) {
    body = options.body
  } else if (options?.body) {
    body = JSON.stringify(options.body)
  }

  const baseHeaders: BaseHeaders =
    body instanceof FormData
      ? {}
      : {
          'Content-Type': 'application/json',
        }

  if (isBrowser) {
    const accessToken = getAccessTokenFromLS()
    if (accessToken) {
      baseHeaders.Authorization = `Bearer ${accessToken}`
    }
  }

  const res = await fetch(fullUrl, {
    method,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    },
    body,
  })

  const payload: Response = await res.json()

  const data = {
    status: res.status,
    payload,
  }

  // Xử lý lỗi
  if (!res.ok) {
    // Lỗi 422 - lỗi thực thể
    if (res.status === ENTITY_ERROR_STATUS) {
      throw new EntityError(
        data as {
          status: typeof ENTITY_ERROR_STATUS
          payload: EntityErrorPayload
        },
      )
    }
  }
  // Xử lý khi request thành công
  if (isBrowser) {
    const normalizedPath = normalizePath(path)

    // Lưu accessToken, refreshToken, profile vào localStorage nếu endpoint là register hoặc login
    if (
      [REGISTER_API_ENDPOINT, LOGIN_API_ENDPOINT, SET_TOKENS_API_ENDPOINT]
        .map((endpoint) => normalizePath(endpoint))
        .includes(normalizedPath)
    ) {
      const { accessToken, refreshToken, user } = payload as LoginResType
      const decodedAccessToken = jwtDecoded<AccessTokenPayload>(accessToken)
      const decodedRefreshToken = jwtDecoded<RefreshTokenPayload>(refreshToken)
      setAccessTokenToLS(accessToken)
      setRefreshTokenToLS(refreshToken)
      setAccessTokenExpiresAtToLS(new Date(decodedAccessToken.exp * 1000).toISOString())
      setRefreshTokenExpiresAtToLS(new Date(decodedRefreshToken.exp * 1000).toISOString())
      setProfileToLS(user)
    } else if (normalizedPath === LOGOUT_API_ENDPOINT) {
      // Xóa accessToken, refreshToken, profile khỏi localStorage nếu endpoint là logout
      clearAuthFromLS()
    }
  }

  return data
}

const http = {
  get<Response>(path: string, options?: Omit<CustomOptions, 'body'>) {
    return request<Response>(path, 'GET', options)
  },

  post<Response>(path: string, body: any, options?: Omit<CustomOptions, 'body'>) {
    return request<Response>(path, 'POST', {
      ...options,
      body,
    })
  },

  put<Response>(path: string, body: any, options?: Omit<CustomOptions, 'body'>) {
    return request<Response>(path, 'PUT', {
      ...options,
      body,
    })
  },

  delete<Response>(path: string, body: any, options?: Omit<CustomOptions, 'body'>) {
    return request<Response>(path, 'DELETE', {
      ...options,
      body,
    })
  },
}

export default http
