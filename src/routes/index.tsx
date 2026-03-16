import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: async ({ context }) => {
    const { user } = context.auth || {}
    
    if (user) {
      // Check if email is verified first
      if (!user.emailVerified) {
        throw redirect({ to: '/verify-email' })
      }

      // Authenticated and verified - check if user has a workspace using lastAccessedWorkspace
      const hasWorkspace= !!user.lastAccessedWorkspace

      throw redirect({ to: hasWorkspace? '/dashboard' : '/select-workspace' })
    } else {
      // Not authenticated - redirect to login
      throw redirect({ to: '/login' })
    }
  },
})
