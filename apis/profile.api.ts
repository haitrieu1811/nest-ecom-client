import http from '@/lib/http'
import {
  ChangePasswordBodyType,
  GetProfileResType,
  UpdateProfileBodyType,
  UpdateProfileResType,
} from '@/schemas/profile.schema'
import { MessageResType } from '@/types/utils.type'

export const UPDATE_PROFILE_API_ENDPOINT = 'profile'

const profileApi = {
  getProfile() {
    return http.get<GetProfileResType>('profile')
  },

  updateProfile(body: UpdateProfileBodyType) {
    return http.put<UpdateProfileResType>(UPDATE_PROFILE_API_ENDPOINT, body)
  },

  changePassword(body: ChangePasswordBodyType) {
    return http.post<MessageResType>('profile/change-password', body)
  },
} as const

export default profileApi
