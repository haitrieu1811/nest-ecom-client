import http from '@/lib/http'

import { LogoutBodyType, RegisterBodyType, RegisterResType, SendOTPBodyType } from '@/schemas/auth.schema'
import { MessageResType } from '@/types/utils.type'

export const REGISTER_API_ENDPOINT = 'api/auth/register'
export const LOGOUT_API_ENDPOINT = 'api/auth/logout'

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

  sLogout(body: LogoutBodyType) {
    return http.post<MessageResType>('auth/logout', body)
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
