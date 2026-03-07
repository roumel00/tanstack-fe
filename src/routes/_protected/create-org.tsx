import { createFileRoute } from '@tanstack/react-router'
import { CreateOrg } from '@/components/pages'

export const Route = createFileRoute('/_protected/create-org')({
  component: CreateOrg,
})
