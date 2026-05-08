import http from '@/lib/http'

import { RegisterBodyType, RegisterResType, SendOTPBodyType } from '@/schemas/auth.schema'
import { MessageResType } from '@/types/utils.type'

export const REGISTER_API_ENDPOINT = 'api/auth/register'

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
} as const

export default authApi
