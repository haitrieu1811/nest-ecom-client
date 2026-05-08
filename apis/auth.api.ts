import http from '@/lib/http'

import {
  GetGoogleOAuthLinkResType,
  LoginBodyType,
  LoginResType,
  LogoutBodyType,
  RegisterBodyType,
  RegisterResType,
  SendOTPBodyType,
} from '@/schemas/auth.schema'
import { MessageResType, ProfileInLSType } from '@/types/utils.type'

export const REGISTER_API_ENDPOINT = 'api/auth/register'
export const LOGOUT_API_ENDPOINT = 'api/auth/logout'
export const LOGIN_API_ENDPOINT = 'api/auth/login'
export const SET_TOKENS_API_ENDPOINT = 'api/auth/set-tokens'

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

  getGoogleOauth2Url() {
    return http.get<GetGoogleOAuthLinkResType>('auth/google-link')
  },

  setTokens(body: { accessToken: string; refreshToken: string; user: ProfileInLSType }) {
    return http.post(SET_TOKENS_API_ENDPOINT, body, {
      baseUrl: '',
    })
  },
} as const

export default authApi
