import { useQuery } from '@tanstack/react-query'
import { get } from '@/lib/api'
import { GetTeamOverviewResponse } from './types'

export async function getTeamOverview(): Promise<GetTeamOverviewResponse> {
  return get<GetTeamOverviewResponse>('/organisations/team/overview')
}

export function useGetTeamOverview() {
  return useQuery({
    queryKey: ['organisation', 'teamOverview'],
    queryFn: getTeamOverview,
  })
}
