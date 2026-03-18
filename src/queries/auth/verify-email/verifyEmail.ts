import { useMutation } from '@tanstack/react-query'
import { authClient } from '@/lib/auth-client'
import { VerifyEmailRequest } from './types'

export async function verifyEmail(data: VerifyEmailRequest) {
  const result = await authClient.emailOtp.verifyEmail({
    email: data.email,
    otp: data.otp,
  })
  if (result.error) throw new Error(result.error.message ?? 'Email verification failed')
  return result.data
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: verifyEmail,
  })
}
