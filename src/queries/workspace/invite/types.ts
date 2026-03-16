import { TeamMember } from '@/lib/models'

export type InviteRequest = {
  email: string
}

export type InviteResponse = TeamMember
