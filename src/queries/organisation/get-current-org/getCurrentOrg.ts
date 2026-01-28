import { useQuery } from '@tanstack/react-query'
import { get } from '@/lib/api'
import { GetCurrentOrgResponse } from './types'

/**
 * Query function to fetch current organisation
 * GET /organisations/team/currentOrg
 */
export async function getCurrentOrg(): Promise<GetCurrentOrgResponse> {
  return get<GetCurrentOrgResponse>('/organisations/team/currentOrg')
}

/**
 * Query hook to fetch current organisation
 * GET /organisations/team/currentOrg
 */
export function useGetCurrentOrg() {
  return useQuery({
    queryKey: ['organisation', 'currentOrg'],
    queryFn: getCurrentOrg,
    staleTime: Infinity,
  })
}

