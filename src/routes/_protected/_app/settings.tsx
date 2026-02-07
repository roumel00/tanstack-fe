import { createFileRoute } from '@tanstack/react-router'
import { Settings } from '@/components/pages'

export const Route = createFileRoute('/_protected/_app/settings')({
  component: Settings,
})
