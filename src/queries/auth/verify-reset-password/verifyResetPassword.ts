import { useMutation } from '@tanstack/react-query'
import { post } from '@/lib/api'
import { VerifyResetPasswordRequest, VerifyResetPasswordResponse } from './types'

/**
 * Mutation function to verify password reset OTP
 * POST /password/verify-reset
 */
export async function verifyResetPassword(
  data: VerifyResetPasswordRequest
): Promise<VerifyResetPasswordResponse> {
  return post<VerifyResetPasswordResponse>('/password/verify-reset', data)
}

/**
 * Mutation hook to verify password reset OTP
 * POST /password/verify-reset
 */
export function useVerifyResetPassword() {
  return useMutation({
    mutationFn: verifyResetPassword,
  })
}
