import { authClient } from '@/lib/auth-client'
import { UserDropdown } from './components'

export function AppHeader() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return (
      <header className="flex h-16 items-center border-b border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-6">
        <div className="ml-auto flex items-center gap-3">
          <div className="h-8 w-8 bg-muted animate-pulse rounded-full" />
        </div>
      </header>
    )
  }

  if (session?.user) {
    const user = session.user as {
      firstName?: string
      lastName?: string
      email: string
      name?: string
      image?: string
    }

    return (
      <header className="flex h-16 items-center border-b border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-6">
        <div className="ml-auto flex items-center gap-4">
          <UserDropdown user={user} />
        </div>
      </header>
    )
  }

  return null
}
