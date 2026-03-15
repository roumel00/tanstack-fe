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
        <div className="absolute inset-0 bg-gradient-to-br from-base via-dark to-primary" />
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '16px 16px',
          }}
        />
        <div className="absolute bottom-12 left-12 right-12">
          <div className="rounded-2xl bg-card/10 p-8 backdrop-blur-sm">
            <p className="text-lg font-medium text-light/90">
              Streamline your workflow and collaborate with your team effortlessly.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}