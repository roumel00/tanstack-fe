import { useMutation } from '@tanstack/react-query'
import { post } from '@/lib/api'

export type VerifyEmailRequest = {
  otp: string
}

export type VerifyEmailResponse = {
  message?: string
  success?: boolean
  verified?: boolean
}

/**
 * Mutation to verify user email with OTP
 * POST /verify
 */
export function useVerifyEmail() {
  return useMutation({
    mutationFn: async (data: VerifyEmailRequest): Promise<VerifyEmailResponse> => {
      return post<VerifyEmailResponse>('/verify', data)
    },
  })
}
