export type GetOrgsRequest = {
  // No request parameters
}

export type GetOrgsResponse = {
  orgId: string
  name: string
  timezone: string
  owner: string
  logo: string | null
  role: 'owner' | 'admin' | 'member' | 'invitee'
  memberCount: number
}[]
