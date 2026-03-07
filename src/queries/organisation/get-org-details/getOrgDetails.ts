import { queryOptions, useQuery } from '@tanstack/react-query'
import { get } from '@/lib/api'
import { GetOrgDetailsResponse } from './types'

export async function getOrgDetails(): Promise<GetOrgDetailsResponse> {
  return get<GetOrgDetailsResponse>('/organisations/details')
}

export const getOrgDetailsQueryOptions = queryOptions({
  queryKey: ['organisation', 'details'],
  queryFn: getOrgDetails,
})

export function useGetOrgDetails() {
  return useQuery(getOrgDetailsQueryOptions)
}
