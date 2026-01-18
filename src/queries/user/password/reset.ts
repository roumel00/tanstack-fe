import { useMutation } from '@tanstack/react-query'
import { post } from '@/lib/api'

export type ResetPasswordRequest = {
  email: string
  otp: string
  newPassword: string
  confirmPassword: string
}

export type ResetPasswordResponse = {
  message?: string
  success?: boolean
}

/**
 * Mutation to reset password with OTP
 * POST /password/reset
 */
export function useResetPassword() {
  return useMutation({
    mutationFn: async (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
      return post<ResetPasswordResponse>('/password/reset', data)
    },
  })
}
