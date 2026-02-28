export type TeamOverviewMember = {
  id: string
  orgId: string
  email: string
  userId: string | null
  name: string | null
  image: string | null
  role: 'owner' | 'admin' | 'member' | 'invitee'
  createdAt: Date
}

export type RoleCounts = {
  admins: number
  members: number
  invitees: number
}

export type GetTeamOverviewResponse = {
  owner: TeamOverviewMember
  counts: RoleCounts
  recentAdmins: TeamOverviewMember[]
  recentMembers: TeamOverviewMember[]
}
