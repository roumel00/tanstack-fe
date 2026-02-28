import { useQuery } from '@tanstack/react-query'
import { get } from '@/lib/api'
import { GetTeamMembersResponse } from './types'

export async function getTeamMembers(): Promise<GetTeamMembersResponse> {
  return get<GetTeamMembersResponse>('/organisations/team')
}

export function useGetTeamMembers() {
  return useQuery({
    queryKey: ['organisation', 'teamMembers'],
    queryFn: getTeamMembers,
  })
}
