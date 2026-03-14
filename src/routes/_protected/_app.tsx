import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { AppSidebar } from '@/components/core'

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
    <div className="flex min-h-screen p-3 gap-3">
      <div className="sticky top-3 h-[calc(100vh-1.5rem)]">
        <AppSidebar />
      </div>
      <div className="min-w-0 flex-1 rounded-2xl bg-white dark:bg-neutral-900 shadow-md">
        <Outlet />
      </div>
    </div>
  )
}
