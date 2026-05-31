import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import brandApi from '@/apis/brand.api'

type UseDeleteBrandProps = {
  onSuccess?: () => void
}

export default function useDeleteBrand(props?: UseDeleteBrandProps) {
  const deleteBrandMutation = useMutation({
    mutationKey: ['delete-brand'],
    mutationFn: brandApi.delete,
    onSuccess: (data) => {
      toast.success(data.payload.message)
      props?.onSuccess?.()
    },
  })

  return {
    deleteBrandMutation,
  }
}
