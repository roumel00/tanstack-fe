import { useMutation } from '@tanstack/react-query'
import { authClient } from '@/lib/auth-client'
import { ResendVerificationRequest } from './types'

export async function resendVerification(data: ResendVerificationRequest) {
  const result = await authClient.emailOtp.sendVerificationOtp({
    email: data.email,
    type: 'email-verification',
  })
  if (result.error) throw new Error(result.error.message ?? 'Failed to resend verification')
  return result.data
}

export function useResendVerification() {
  return useMutation({
    mutationFn: resendVerification,
  })
}
