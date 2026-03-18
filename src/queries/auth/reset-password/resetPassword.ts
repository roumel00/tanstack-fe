import { useMutation } from '@tanstack/react-query'
import { authClient } from '@/lib/auth-client'
import { ResetPasswordRequest } from './types'

export async function resetPassword(data: ResetPasswordRequest) {
  if (data.newPassword !== data.confirmPassword) {
    throw new Error('Passwords do not match')
  }
  const result = await authClient.$fetch('/email-otp/reset-password', {
    method: 'POST',
    body: {
      email: data.email,
      otp: data.otp,
      password: data.newPassword,
    },
  })
  if (result.error) throw new Error(result.error.message ?? 'Failed to reset password')
  return result.data
}

export function useResetPassword() {
  return useMutation({
    mutationFn: resetPassword,
  })
}
