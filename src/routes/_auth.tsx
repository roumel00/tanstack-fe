import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  beforeLoad: async ({ context }) => {
    // If already authenticated, redirect away from auth pages
    const { user } = context.auth || {};

    if (user) {
      // User is authenticated - check if user has an org using lastAccessedOrg
      const hasOrg = !!user.lastAccessedOrg
      
      throw redirect({ to: hasOrg ? '/dashboard' : '/select-org' })
    }
  },
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <div className="auth-layout">
      <Outlet /> {/* Auth routes render here */}
    </div>
  )
}