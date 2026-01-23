import { useMutation } from '@tanstack/react-query'
import { post } from '@/lib/api'
import { ForgotPasswordRequest, ForgotPasswordResponse } from './types'

/**
 * Mutation function to request password reset OTP
 * POST /password/forgot
 */
export async function forgotPassword(
  data: ForgotPasswordRequest
): Promise<ForgotPasswordResponse> {
  return post<ForgotPasswordResponse>('/password/forgot', data)
}

/**
 * Mutation hook to request password reset OTP
 * POST /password/forgot
 */
export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,
  })
}
