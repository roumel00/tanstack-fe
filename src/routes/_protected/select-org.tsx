import { createFileRoute, redirect } from '@tanstack/react-router'
import { SelectOrg } from '@/components/pages'
import { getOrgsQueryOptions } from '@/queries'

export const Route = createFileRoute('/_protected/select-org')({
  beforeLoad: async ({ context }) => {
    const { user } = context.auth || {}

    if (user?.lastAccessedOrg) {
      throw redirect({ to: '/dashboard' })
    }
  },
  loader: async ({ context }) => {
    const orgs = await context.queryClient.ensureQueryData(getOrgsQueryOptions)

    if (!orgs || orgs.length === 0) {
      throw redirect({ to: '/create-org' })
    }
  },
  component: SelectOrg,
})
