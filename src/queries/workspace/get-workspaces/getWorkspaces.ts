import { queryOptions, useQuery } from '@tanstack/react-query'
import { get } from '@/lib/api'
import { GetWorkspacesResponse } from './types'

export async function getWorkspaces(): Promise<GetWorkspacesResponse> {
  return get<GetWorkspacesResponse>('/workspace/fetch')
}

export const getWorkspacesQueryOptions = queryOptions({
  queryKey: ['workspace', 'workspaces'],
  queryFn: getWorkspaces,
  staleTime: 30 * 1000,
})

export function useGetWorkspaces() {
  return useQuery(getWorkspacesQueryOptions)
}
