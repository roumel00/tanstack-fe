import { useMutation } from '@tanstack/react-query'
import { post } from '@/lib/api'

export type ForgotPasswordRequest = {
  email: string
}

export type ForgotPasswordResponse = {
  message?: string
  success?: boolean
}

/**
 * Mutation to request password reset OTP
 * POST /password/forgot
 */
export function useForgotPassword() {
  return useMutation({
    mutationFn: async (data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
      return post<ForgotPasswordResponse>('/password/forgot', data)
    },
  })
}
