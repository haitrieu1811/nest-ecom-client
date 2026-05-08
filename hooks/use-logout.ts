'use client'

import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import authApi from '@/apis/auth.api'
import { useAppStore } from '@/providers/app.provider'
import { MessageResType } from '@/types/utils.type'

type UseLogoutProps = {
  onSuccess?: (payload: MessageResType) => void
}

export default function useLogout({ onSuccess }: UseLogoutProps = {}) {
  const { setIsAuthenticated } = useAppStore()

  const logoutMutation = useMutation({
    mutationKey: ['logout'],
    mutationFn: authApi.logout,
    onSuccess: (data) => {
      toast.success(data.payload.message)
      setIsAuthenticated(false)
      onSuccess?.(data.payload)
    },
  })

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  return {
    handleLogout,
    logoutMutation,
  }
}
