import { queryOptions, useQuery } from '@tanstack/react-query'
import { get } from '@/lib/api'
import { GetCurrentWorkspaceResponse } from './types'

export async function getCurrentWorkspace(): Promise<GetCurrentWorkspaceResponse> {
  return get<GetCurrentWorkspaceResponse>('/workspaces/team/currentWorkspace')
}

export const getCurrentWorkspaceQueryOptions = queryOptions({
  queryKey: ['workspace', 'currentWorkspace'],
  queryFn: getCurrentWorkspace,
  staleTime: Infinity,
})

export function useGetCurrentWorkspace() {
  return useQuery(getCurrentWorkspaceQueryOptions)
}

