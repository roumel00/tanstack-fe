import { useMutation } from '@tanstack/react-query'
import { post } from '@/lib/api'
import { ResetPasswordRequest, ResetPasswordResponse } from './types'

/**
 * Mutation function to reset password with OTP
 * POST /password/reset
 */
export async function resetPassword(
  data: ResetPasswordRequest
): Promise<ResetPasswordResponse> {
  return post<ResetPasswordResponse>('/password/reset', data)
}

/**
 * Mutation hook to reset password with OTP
 * POST /password/reset
 */
export function useResetPassword() {
  return useMutation({
    mutationFn: resetPassword,
  })
}
