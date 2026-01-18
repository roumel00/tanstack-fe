import { createFileRoute } from '@tanstack/react-router'
import { Login } from '@/components/pages'

export const Route = createFileRoute('/_auth/login')({
  component: Login,
})