export type TeamMember = {
  orgId: string
  email: string
  userId: string | null
  role: 'owner' | 'admin' | 'member'
  deletedAt: Date | null
  _id: string
  createdAt: Date
  updatedAt: Date
}
