import { queryOptions, useQuery } from '@tanstack/react-query'
import { get } from '@/lib/api'
import { GetCurrentOrgResponse } from './types'

export async function getCurrentOrg(): Promise<GetCurrentOrgResponse> {
  return get<GetCurrentOrgResponse>('/organisations/team/currentOrg')
}

export const getCurrentOrgQueryOptions = queryOptions({
  queryKey: ['organisation', 'currentOrg'],
  queryFn: getCurrentOrg,
  staleTime: Infinity,
})

export function useGetCurrentOrg() {
  return useQuery(getCurrentOrgQueryOptions)
}

