export type UserOrganisation = {
  orgId: string
  name: string
  timezone: string
  owner: string
  role: 'owner' | 'admin' | 'member'
}

export type GetOrgsRequest = {
  // No request parameters
}

export type GetOrgsResponse = UserOrganisation[]
