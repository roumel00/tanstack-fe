import { useMutation } from '@tanstack/react-query'
import { post } from '@/lib/api'

export type VerifyResetPasswordRequest = {
  email: string
  otp: string
}

export type VerifyResetPasswordResponse = {
  message?: string
  success?: boolean
  valid?: boolean
}

/**
 * Mutation to verify password reset OTP
 * POST /password/verify-reset
 */
export function useVerifyResetPassword() {
  return useMutation({
    mutationFn: async (data: VerifyResetPasswordRequest): Promise<VerifyResetPasswordResponse> => {
      return post<VerifyResetPasswordResponse>('/password/verify-reset', data)
    },
  })
}
