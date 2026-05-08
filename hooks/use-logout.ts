'use client'

import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import authApi from '@/apis/auth.api'
import { useAppStore } from '@/providers/app.provider'

export default function useLogout() {
  const { setIsAuthenticated } = useAppStore()

  const logoutMutation = useMutation({
    mutationKey: ['logout'],
    mutationFn: authApi.logout,
    onSuccess: (data) => {
      toast.success(data.payload.message)
      setIsAuthenticated(false)
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
