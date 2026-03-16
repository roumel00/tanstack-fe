export type GetWorkspacesRequest = {
  // No request parameters
}

export type GetWorkspacesResponse = {
  workspaceId: string
  name: string
  timezone: string
  owner: string
  logo: string | null
  role: 'owner' | 'admin' | 'member' | 'invitee'
  memberCount: number
}[]
