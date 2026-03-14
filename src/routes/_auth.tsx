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
    <div className="flex min-h-screen">
      {/* Left: auth form */}
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
        <Outlet />
      </div>

      {/* Right: decorative panel */}
      <div className="relative hidden overflow-hidden lg:block lg:w-1/2">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-primary/90" />
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.3) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(255,255,255,0.2) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 70%)`,
          }}
        />
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute bottom-12 left-12 right-12">
          <div className="rounded-2xl bg-white/10 p-8 backdrop-blur-sm">
            <p className="text-lg font-medium text-white/90">
              Streamline your workflow and collaborate with your team effortlessly.
            </p>
            <p className="mt-2 text-sm text-white/60">FlowBod</p>
          </div>
        </div>
      </div>
    </div>
  )
}