import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected')({
  beforeLoad: async ({ context, location }) => {
    const { user } = context.auth || {};
    
    if (!user) {
      throw redirect({ to: '/login' })
    }

    // If email is not verified and not already on verify-email page, redirect
    if (!user.emailVerified && location.pathname !== '/verify-email') {
      throw redirect({ to: '/verify-email' })
    }
  },
  component: ProtectedLayout,
})

function ProtectedLayout() {
  return (
    <div>
      <Outlet />
    </div>
  )
}