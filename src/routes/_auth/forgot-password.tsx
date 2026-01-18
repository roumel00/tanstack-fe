import { createFileRoute } from '@tanstack/react-router'
import { ForgotPassword } from '@/components/pages'

export const Route = createFileRoute('/_auth/forgot-password')({
  component: ForgotPassword,
})
