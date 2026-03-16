import { useGetCurrentWorkspace} from '@/queries'
import { useSession } from '@/lib/auth-client'
import { Skeleton } from '@/components/ui/skeleton'

export function Dashboard() {
  const { data: session } = useSession()
  const { data: currentWorkspace, isLoading } = useGetCurrentWorkspace()

  if (isLoading) {
    return (
      <div className="p-8">
        <Skeleton className="h-9 w-48 mb-4" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-64" />
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-5 w-56" />
        </div>
      </div>
    )
  }

  const user = session?.user as { firstName?: string; lastName?: string; email: string } | undefined
  const workspace = currentWorkspace?.currentWorkspace

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
        {workspace ? (
          <p>Current Workspace: {workspace.workspace.name}</p>
        ) : (
          <p>No workspace selected</p>
        )}
      </div>
    </div>
  )
}
