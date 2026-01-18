import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: async ({ context }) => {
    const { user } = context.auth || {}
    
    if (user) {
      // Check if email is verified first
      if (!user.emailVerified) {
        throw redirect({ to: '/verify-email' })
      }

      // Authenticated and verified - check if user has an org using lastAccessedOrg
      const hasOrg = !!user.lastAccessedOrg

      throw redirect({ to: hasOrg ? '/dashboard' : '/select-org' })
    } else {
      // Not authenticated - redirect to login
      throw redirect({ to: '/login' })
    }
  },
})
