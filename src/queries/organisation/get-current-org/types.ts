import { Organisation, TeamMember } from '../../../lib/models'

export type CurrentOrg = {
  currentOrg: {
    teamMember: TeamMember
    organisation: Organisation
  } | null
}

export type GetCurrentOrgRequest = {
  // No request parameters
}

export type GetCurrentOrgResponse = CurrentOrg
