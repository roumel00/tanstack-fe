import { Workspace, TeamMember } from '@/lib/models'

export type GetCurrentWorkspaceRequest = {
  // No request parameters
}

export type GetCurrentWorkspaceResponse = {
  currentWorkspace: {
    teamMember: TeamMember
    workspace: Workspace
  } | null
}
