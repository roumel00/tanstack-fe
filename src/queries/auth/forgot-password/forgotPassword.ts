import { useMutation } from '@tanstack/react-query'
import { authClient } from '@/lib/auth-client'
import { ForgotPasswordRequest } from './types'

export async function forgotPassword(data: ForgotPasswordRequest) {
  const result = await authClient.$fetch('/email-otp/request-password-reset', {
    method: 'POST',
    body: { email: data.email },
  })
  if (result.error) throw new Error(result.error.message ?? 'Failed to send reset code')
  return result.data
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,
  })
}
