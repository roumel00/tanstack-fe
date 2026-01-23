import { useQuery } from '@tanstack/react-query'
import { get } from '@/lib/api'
import { GetOrgsResponse } from './types'

/**
 * Query function to fetch user organisations
 * GET /organisations/team
 */
export async function getOrgs(): Promise<GetOrgsResponse> {
  return get<GetOrgsResponse>('/organisations/team')
}

/**
 * Query hook to fetch user organisations
 * GET /organisations/team
 */
export function useGetOrgs() {
  return useQuery({
    queryKey: ['organisation', 'orgs'],
    queryFn: getOrgs,
  })
}

// Backwards compatibility aliases
export const fetchUserOrganisations = getOrgs
export const useUserOrganisations = useGetOrgs
