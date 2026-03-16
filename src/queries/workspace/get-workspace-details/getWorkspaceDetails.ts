import { queryOptions, useQuery } from '@tanstack/react-query'
import { get } from '@/lib/api'
import { GetWorkspaceDetailsResponse } from './types'

export async function getWorkspaceDetails(): Promise<GetWorkspaceDetailsResponse> {
  return get<GetWorkspaceDetailsResponse>('/workspaces/details')
}

export const getWorkspaceDetailsQueryOptions = queryOptions({
  queryKey: ['workspace', 'details'],
  queryFn: getWorkspaceDetails,
})

export function useGetWorkspaceDetails() {
  return useQuery(getWorkspaceDetailsQueryOptions)
}
