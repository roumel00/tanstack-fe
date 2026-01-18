import { createFileRoute } from '@tanstack/react-router'
import { Dashboard } from '@/components/pages'

export const Route = createFileRoute('/_protected/_app/dashboard')({
  component: Dashboard,
})
