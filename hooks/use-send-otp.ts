import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import authApi from '@/apis/auth.api'
import { MessageResType } from '@/types/utils.type'

type SendOTPProps = {
  onSuccess?: (payload: MessageResType) => void
  onError?: (error: Error) => void
}

export default function useSendOTP({ onSuccess, onError }: SendOTPProps = {}) {
  const sendOTPMutation = useMutation({
    mutationKey: ['send-otp'],
    mutationFn: authApi.sendOTP,
    onSuccess(data) {
      toast.success(data.payload.message)
      onSuccess?.(data.payload)
    },
    onError(error) {
      onError?.(error)
    },
  })

  return {
    sendOTPMutation,
  }
}
