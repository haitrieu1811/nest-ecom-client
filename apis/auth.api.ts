import http from '@/lib/http'

import {
  LoginBodyType,
  LoginResType,
  LogoutBodyType,
  RegisterBodyType,
  RegisterResType,
  SendOTPBodyType,
} from '@/schemas/auth.schema'
import { MessageResType } from '@/types/utils.type'

export const REGISTER_API_ENDPOINT = 'api/auth/register'
export const LOGOUT_API_ENDPOINT = 'api/auth/logout'
export const LOGIN_API_ENDPOINT = 'api/auth/login'

const authApi = {
  sRegister(body: RegisterBodyType) {
    return http.post<RegisterResType>('auth/register', body)
  },

  register(body: RegisterBodyType) {
    return http.post<RegisterResType>(REGISTER_API_ENDPOINT, body, {
      baseUrl: '',
    })
  },

  sendOTP(body: SendOTPBodyType) {
    return http.post<MessageResType>('auth/otp', body)
  },

  sLogin(body: LoginBodyType) {
    return http.post<LoginResType>('auth/login', body)
  },

  login(body: LoginBodyType) {
    return http.post<LoginResType>(LOGIN_API_ENDPOINT, body, {
      baseUrl: '',
    })
  },

  sLogout(body: LogoutBodyType, accessToken: string) {
    return http.post<MessageResType>('auth/logout', body, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  },

  logout() {
    return http.post<MessageResType>(
      LOGOUT_API_ENDPOINT,
      {},
      {
        baseUrl: '',
      },
    )
  },
} as const

export default authApi
