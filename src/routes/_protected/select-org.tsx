import { createFileRoute } from '@tanstack/react-router'
import { SelectOrg } from '@/components/pages'

export const Route = createFileRoute('/_protected/select-org')({
  component: SelectOrg,
})
