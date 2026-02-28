export type GetTeamMembersRequest = {
  page?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export type TeamMemberDto = {
  id: string
  orgId: string
  email: string
  userId: string | null
  name: string | null
  image: string | null
  role: 'owner' | 'admin' | 'member' | 'invitee'
  createdAt: Date
}

export type GetTeamMembersResponse = {
  members: TeamMemberDto[]
  total: number
  page: number
  totalPages: number
}
