import { createFileRoute, redirect } from '@tanstack/react-router'
import { SelectWorkspace} from '@/components/pages'
import { getWorkspacesQueryOptions } from '@/queries'

export const Route = createFileRoute('/_protected/select-workspace')({
  beforeLoad: async ({ context }) => {
    const { user } = context.auth || {}

    if (user?.lastAccessedWorkspace) {
      throw redirect({ to: '/dashboard' })
    }
  },
  loader: async ({ context }) => {
    const workspaces = await context.queryClient.ensureQueryData(getWorkspacesQueryOptions)

    if (!workspaces || workspaces.length === 0) {
      throw redirect({ to: '/create-workspace' })
    }
  },
  component: SelectWorkspace,
})
