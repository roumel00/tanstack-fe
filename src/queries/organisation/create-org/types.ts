import { Organisation } from '../../../lib/models'

export type CreateOrgRequest = {
  name: string
  timezone: string
  email?: string
  phone?: string
  address?: {
    street?: string
    city?: string
    state?: string
    postalCode?: string
    country?: string
  }
  website?: string
  logo?: string
}

export type CreateOrgResponse = Organisation
