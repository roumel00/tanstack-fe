import { Workspace } from '../../../lib/models'

export type CreateWorkspaceRequest = {
  name: string
  timezone: string
  logo?: string
}

export type CreateWorkspaceResponse = Workspace
