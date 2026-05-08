import { LoginResType } from '@/schemas/auth.schema'

export type MessageResType = {
  message: string
}

export type AccessTokenPayloadInput = {
  userId: number
  roleId: number
  deviceId: number
}

export type AccessTokenPayload = AccessTokenPayloadInput & {
  iat: number
  exp: number
}

export type RefreshTokenPayloadInput = {
  userId: number
}

export type RefreshTokenPayload = RefreshTokenPayloadInput & {
  iat: number
  exp: number
}

export type ProfileInLSType = LoginResType['user']
