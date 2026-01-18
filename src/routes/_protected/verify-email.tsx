import { createFileRoute, redirect } from '@tanstack/react-router'
import { VerifyEmail } from '@/components/pages'

export const Route = createFileRoute('/_protected/verify-email')({
  beforeLoad: async ({ context }) => {
    const { user } = context.auth || {};

    if (user?.emailVerified) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: VerifyEmail,
})
