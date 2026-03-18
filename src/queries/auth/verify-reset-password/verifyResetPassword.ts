import { useMutation } from '@tanstack/react-query'
import { authClient } from '@/lib/auth-client'
import { VerifyResetPasswordRequest } from './types'

export async function verifyResetPassword(data: VerifyResetPasswordRequest) {
  const result = await authClient.emailOtp.checkVerificationOtp({
    email: data.email,
    otp: data.otp,
    type: 'forget-password',
  })
  if (result.error) throw new Error(result.error.message ?? 'Invalid or expired code')
  return result.data
}

export function useVerifyResetPassword() {
  return useMutation({
    mutationFn: verifyResetPassword,
  })
}
