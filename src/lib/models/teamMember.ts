export type TeamMember = {
  workspaceId: string
  email: string
  userId: string | null
  name: string | null
  image: string | null
  role: 'owner' | 'admin' | 'member' | 'invitee'
  deletedAt: Date | null
  _id: string
  createdAt: Date
  updatedAt: Date
}
