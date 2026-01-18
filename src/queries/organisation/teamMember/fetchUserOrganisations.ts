import { useQuery } from '@tanstack/react-query'
import { get } from '@/lib/api'

export type UserOrganisation = {
  orgId: string
  name: string
  timezone: string
  owner: string
  role: 'owner' | 'admin' | 'member'
}

export type FetchUserOrganisationsRequest = {
  // No request parameters
}

export type FetchUserOrganisationsResponse = UserOrganisation[]

/**
 * Query function to fetch user organisations
 * GET /organisations/team
 */
export async function fetchUserOrganisations(): Promise<FetchUserOrganisationsResponse> {
  return get<FetchUserOrganisationsResponse>('/organisations/team')
}

/**
 * Query hook to fetch user organisations
 * GET /organisations/team
 */
export function useUserOrganisations() {
  return useQuery({
    queryKey: ['user', 'organisations'],
    queryFn: fetchUserOrganisations,
  })
}
