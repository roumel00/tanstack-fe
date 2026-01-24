import { createFileRoute } from '@tanstack/react-router'
import { ComponentsPage } from '@/components/pages/ComponentsPage'

export const Route = createFileRoute('/_protected/_app/components')({
  component: ComponentsPage,
})
