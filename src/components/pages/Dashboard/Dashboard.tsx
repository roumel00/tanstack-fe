import { useCurrentOrg } from '@/queries'
import { useSession } from '@/lib/auth-client'

export function Dashboard() {
  // Get auth data from Better Auth session (identity data)
  const { data: session } = useSession()
  
  // Get current organisation from query
  const { data: currentOrg, isLoading } = useCurrentOrg()

  if (isLoading) {
    return <div>Loading...</div>
  }

  const user = session?.user as { firstName?: string; lastName?: string; email: string } | undefined
  const org = currentOrg?.currentOrg

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="space-y-2">
        {user && (
          <>
            <p>Welcome, {user.firstName} {user.lastName}!</p>
            <p>Email: {user.email}</p>
          </>
        )}
        {org ? (
          <p>Current Organisation: {org.organisation.name}</p>
        ) : (
          <p>No organisation selected</p>
        )}
      </div>
    </div>
  )
}
