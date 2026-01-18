import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { TanStackQueryDevtools } from '@/integrations'
import appCss from '../styles.css?url'
import type { QueryClient } from '@tanstack/react-query'
import { getUserSession } from '@/lib/auth'
import { AuthProvider } from '@/context/auth-context'
import { Toaster } from '@/components/ui/sonner'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'FlowBod' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  beforeLoad: async () => {
    const auth = await getUserSession();
    return { auth };
  },
  component: RootComponent,
  shellComponent: RootDocument,
  notFoundComponent: NotFoundComponent,
})

function RootComponent() {
  const { auth } = Route.useRouteContext()

  return (
    <AuthProvider initialAuth={auth}>
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">
          <Outlet />
        </main>
      </div>

      <Toaster />
      {import.meta.env.NODE_ENV === 'development' && (
        <TanStackDevtools
          config={{ position: 'bottom-right' }}
          plugins={[TanStackQueryDevtools]}
        />
      )}
    </AuthProvider>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function NotFoundComponent() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-gray-400 mb-8">Page not found</p>
        <a href="/" className="px-6 py-3 bg-primary text-white rounded-lg">
          Go Home
        </a>
      </div>
    </div>
  )
}
