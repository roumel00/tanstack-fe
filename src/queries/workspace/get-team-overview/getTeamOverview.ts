import { queryOptions, useQuery } from '@tanstack/react-query'
import { get } from '@/lib/api'
import { GetTeamOverviewResponse } from './types'

export async function getTeamOverview(): Promise<GetTeamOverviewResponse> {
  return get<GetTeamOverviewResponse>('/workspaces/team/overview')
}

export const getTeamOverviewQueryOptions = queryOptions({
  queryKey: ['workspace', 'teamOverview'],
  queryFn: getTeamOverview,
})

export function useGetTeamOverview() {
  return useQuery(getTeamOverviewQueryOptions)
}
