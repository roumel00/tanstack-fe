import { useMutation } from '@tanstack/react-query'
import { post } from '@/lib/api'

export type ResendVerificationRequest = {
  // No request parameters
}

export type ResendVerificationResponse = {
  message?: string
  success?: boolean
}

/**
 * Mutation to resend email verification OTP
 * POST /verify/resend
 */
export function useResendVerification() {
  return useMutation({
    mutationFn: async (): Promise<ResendVerificationResponse> => {
      return post<ResendVerificationResponse>('/verify/resend')
    },
  })
}
