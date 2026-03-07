import { Organisation, TeamMember } from '@/lib/models'

export type GetCurrentOrgRequest = {
  // No request parameters
}

export type GetCurrentOrgResponse = {
  currentOrg: {
    teamMember: TeamMember
    organisation: Organisation
  } | null
}
