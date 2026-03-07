import { Organisation } from '../../../lib/models'

export type CreateOrgRequest = {
  name: string
  timezone: string
  logo?: string
}

export type CreateOrgResponse = Organisation
