import { useMutation } from '@tanstack/react-query'
import { post } from '@/lib/api'
import { ResendVerificationResponse } from './types'

/**
 * Mutation function to resend email verification OTP
 * POST /auth/email/resend
 */
export async function resendVerification(): Promise<ResendVerificationResponse> {
  return post<ResendVerificationResponse>('/auth/email/resend')
}

/**
 * Mutation hook to resend email verification OTP
 * POST /auth/email/resend
 */
export function useResendVerification() {
  return useMutation({
    mutationFn: resendVerification,
  })
}
