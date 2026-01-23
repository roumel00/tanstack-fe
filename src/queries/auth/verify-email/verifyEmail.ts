import { useMutation } from '@tanstack/react-query'
import { post } from '@/lib/api'
import { VerifyEmailRequest, VerifyEmailResponse } from './types'

/**
 * Mutation function to verify user email with OTP
 * POST /verify
 */
export async function verifyEmail(
  data: VerifyEmailRequest
): Promise<VerifyEmailResponse> {
  return post<VerifyEmailResponse>('/verify', data)
}

/**
 * Mutation hook to verify user email with OTP
 * POST /verify
 */
export function useVerifyEmail() {
  return useMutation({
    mutationFn: verifyEmail,
  })
}
