import { createFileRoute } from '@tanstack/react-router'
import { ComponentsPage } from '@/components/pages'

export const Route = createFileRoute('/_protected/_app/components')({
  component: ComponentsPage,
})
