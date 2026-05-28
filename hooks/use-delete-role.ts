import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import roleApi from '@/apis/role.api'
import { handleErrorFromAPI } from '@/lib/utils'
import { MessageResType } from '@/types/utils.type'

type UseDeleteRoleProps = {
  onSuccess?: (payload: MessageResType) => void
}

export default function useDeleteRole({ onSuccess }: UseDeleteRoleProps = {}) {
  const deleteRoleMutation = useMutation({
    mutationKey: ['delete-role'],
    mutationFn: roleApi.delete,
    onSuccess: (data) => {
      toast.success('Xóa role thành công')
      onSuccess?.(data.payload)
    },
    onError: (error) => {
      handleErrorFromAPI({
        error,
      })
    },
  })

  return {
    deleteRoleMutation,
  }
}
