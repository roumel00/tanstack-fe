import { createFileRoute } from '@tanstack/react-router'
import { CreateWorkspace} from '@/components/pages'

export const Route = createFileRoute('/_protected/create-workspace')({
  component: CreateWorkspace,
})
