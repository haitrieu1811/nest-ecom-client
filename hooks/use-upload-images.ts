import { useMutation } from '@tanstack/react-query'

import mediaApi from '@/apis/media.api'
import { UploadImagesResType } from '@/schemas/media.schema'

export default function useUploadImages({ onSuccess }: { onSuccess?: (payload: UploadImagesResType) => void } = {}) {
  const uploadImagesMutation = useMutation({
    mutationKey: ['upload-images'],
    mutationFn: mediaApi.uploadImages,
    onSuccess: (data) => {
      onSuccess?.(data.payload)
    },
  })

  return {
    uploadImagesMutation,
  }
}
