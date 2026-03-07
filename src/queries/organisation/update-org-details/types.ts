export type UpdateOrgDetailsRequest = {
  name?: string
  timezone?: string
  logo?: string
}

export type UpdateOrgDetailsResponse = {
  name: string
  logo: string | null
  timezone: string
}
