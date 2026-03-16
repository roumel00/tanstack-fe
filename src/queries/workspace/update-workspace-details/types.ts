export type UpdateWorkspaceDetailsRequest = {
  name?: string
  timezone?: string
  logo?: string
}

export type UpdateWorkspaceDetailsResponse = {
  name: string
  logo: string | null
  timezone: string
}
