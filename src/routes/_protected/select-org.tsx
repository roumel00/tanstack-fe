import { createFileRoute, redirect } from '@tanstack/react-router'
import { SelectOrg } from '@/components/pages'

export const Route = createFileRoute('/_protected/select-org')({
  beforeLoad: async ({ context }) => {
    const { user } = context.auth || {}

    // If user already has a lastAccessedOrg, redirect to dashboard
    if (user?.lastAccessedOrg) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: SelectOrg,
})
