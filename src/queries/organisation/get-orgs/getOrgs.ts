import { queryOptions, useQuery } from '@tanstack/react-query'
import { get } from '@/lib/api'
import { GetOrgsResponse } from './types'

export async function getOrgs(): Promise<GetOrgsResponse> {
  return get<GetOrgsResponse>('/organisations')
}

export const getOrgsQueryOptions = queryOptions({
  queryKey: ['organisation', 'orgs'],
  queryFn: getOrgs,
})

export function useGetOrgs() {
  return useQuery(getOrgsQueryOptions)
}
