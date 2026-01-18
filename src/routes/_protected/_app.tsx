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
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader />
        <Outlet />
      </div>
    </div>
  )
}
