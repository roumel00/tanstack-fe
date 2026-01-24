import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { AppSidebar, AppHeader } from '@/components/core'

export const Route = createFileRoute('/_protected/_app')({
  beforeLoad: async ({ context }) => {
    const { user } = context.auth || {};

    if (!user.emailVerified) {
      throw redirect({ to: '/verify-email' })
    } else if (!user.lastAccessedOrg) {
      throw redirect({ to: '/select-org' })
    }
  },
  component: AppLayout,
})

function AppLayout() {
  return (
    <div className="flex min-h-screen">
      <div className="sticky top-0 h-screen">
        <AppSidebar />
      </div>
      <div className="flex-1">
        <AppHeader />
        <Outlet />
      </div>
    </div>
  )
}
