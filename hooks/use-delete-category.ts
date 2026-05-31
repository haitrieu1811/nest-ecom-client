import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import categoryApi from '@/apis/category.api'

type UseDeleteCategoryProps = {
  onSuccess?: () => void
}

export default function useDeleteCategory(props?: UseDeleteCategoryProps) {
  const deleteCategoryMutation = useMutation({
    mutationKey: ['delete-category'],
    mutationFn: categoryApi.delete,
    onSuccess: (data) => {
      toast.success(data.payload.message)
      props?.onSuccess?.()
    },
  })

  return {
    deleteCategoryMutation,
  }
}
