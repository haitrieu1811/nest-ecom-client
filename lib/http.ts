/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  LOGIN_API_ENDPOINT,
  LOGOUT_API_ENDPOINT,
  REGISTER_API_ENDPOINT,
  RESET_PASSWORD_API_ENDPOINT,
  SET_TOKENS_API_ENDPOINT,
} from '@/apis/auth.api'
import { UPDATE_PROFILE_API_ENDPOINT } from '@/apis/profile.api'
import envConfig from '@/config'
import {
  clearAuthFromLS,
  getAccessTokenFromLS,
  isBrowser,
  normalizePath,
  setAccessTokenToLS,
  setProfileToLS,
  setRefreshTokenToLS,
} from '@/lib/utils'
import { LoginResType } from '@/schemas/auth.schema'
import { UpdateProfileResType } from '@/schemas/profile.schema'

const ENTITY_ERROR_STATUS = 422
const UNAUTHORIZED_ERROR_STATUS = 401
const FORBIDDEN_ERROR_STATUS = 403
const NOT_FOUND_ERROR_STATUS = 404

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

let clientLogoutRequest: null | Promise<any> = null

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
    // Khi gặp lỗi 401 thì lập tức cho đăng xuất
    else if (res.status === UNAUTHORIZED_ERROR_STATUS) {
      if (isBrowser) {
        if (!clientLogoutRequest) {
          clientLogoutRequest = fetch(`${envConfig.NEXT_PUBLIC_API_URL}/${normalizePath(LOGOUT_API_ENDPOINT)}`, {
            method: 'POST',
            body: null,
            headers: {
              ...baseHeaders,
            },
          })
        }
        try {
          await clientLogoutRequest
          clearAuthFromLS()
        } finally {
          clientLogoutRequest = null
        }
      }
    }
    // Khi gặp lỗi 403 thì hiển thị toast lỗi
    else if (res.status === FORBIDDEN_ERROR_STATUS) {
      throw new HttpError({
        status: FORBIDDEN_ERROR_STATUS,
        payload,
        message: 'Lỗi phân quyền!',
      })
    }
    // Khi gặp lỗi 404 thì hiển thị toast lỗi
    else if (res.status === NOT_FOUND_ERROR_STATUS) {
      throw new HttpError({
        status: NOT_FOUND_ERROR_STATUS,
        payload,
        message: 'Không tìm thấy!',
      })
    }
  }
  // Xử lý khi request thành công
  if (isBrowser) {
    const normalizedPath = normalizePath(path)
    // Lưu accessToken, refreshToken, profile vào localStorage nếu endpoint là register hoặc login
    if (
      [REGISTER_API_ENDPOINT, LOGIN_API_ENDPOINT, SET_TOKENS_API_ENDPOINT, RESET_PASSWORD_API_ENDPOINT]
        .map((endpoint) => normalizePath(endpoint))
        .includes(normalizedPath)
    ) {
      const { accessToken, refreshToken, user } = payload as LoginResType
      setAccessTokenToLS(accessToken)
      setRefreshTokenToLS(refreshToken)
      setProfileToLS(user)
    } else if (normalizedPath === UPDATE_PROFILE_API_ENDPOINT && method === 'PUT') {
      const user = payload as UpdateProfileResType
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

  delete<Response>(path: string, body?: any, options?: Omit<CustomOptions, 'body'>) {
    return request<Response>(path, 'DELETE', {
      ...options,
      body,
    })
  },
}

export default http
