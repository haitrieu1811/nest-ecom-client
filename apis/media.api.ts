import http from '@/lib/http'
import { UploadImagesResType } from '@/schemas/media.schema'

const mediaApi = {
  uploadImages(formData: FormData) {
    return http.post<UploadImagesResType>('media/images/upload', formData)
  },
} as const

export default mediaApi
