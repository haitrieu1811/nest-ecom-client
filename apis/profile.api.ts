import http from '@/lib/http'
import { GetProfileResType, UpdateProfileBodyType, UpdateProfileResType } from '@/schemas/profile.schema'

export const UPDATE_PROFILE_API_ENDPOINT = 'profile'

const profileApi = {
  getProfile() {
    return http.get<GetProfileResType>('profile')
  },

  updateProfile(body: UpdateProfileBodyType) {
    return http.put<UpdateProfileResType>(UPDATE_PROFILE_API_ENDPOINT, body)
  },
} as const

export default profileApi
