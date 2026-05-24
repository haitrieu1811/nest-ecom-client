import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import userApi from '@/apis/user.api'
import { MessageResType } from '@/schemas/utils.schema'

export default function useDeleteUser({ onSuccess }: { onSuccess?: (payload: MessageResType) => void } = {}) {
  const deleteUserMutation = useMutation({
    mutationKey: ['delete-user'],
    mutationFn: userApi.delete,
    onSuccess: (data) => {
      toast.success(data.payload.message)
      onSuccess?.(data.payload)
    },
  })
  return {
    deleteUserMutation,
  }
}
