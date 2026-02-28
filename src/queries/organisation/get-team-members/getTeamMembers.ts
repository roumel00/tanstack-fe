import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { get } from '@/lib/api'
import { GetTeamMembersRequest, GetTeamMembersResponse } from './types'

export async function getTeamMembers(
  params?: GetTeamMembersRequest,
): Promise<GetTeamMembersResponse> {
  const searchParams = new URLSearchParams()
  if (params?.page) searchParams.set('page', String(params.page))
  if (params?.search) searchParams.set('search', params.search)
  if (params?.sortBy) searchParams.set('sortBy', params.sortBy)
  if (params?.sortOrder) searchParams.set('sortOrder', params.sortOrder)

  const query = searchParams.toString()
  return get<GetTeamMembersResponse>(
    `/organisations/team${query ? `?${query}` : ''}`,
  )
}

export function useGetTeamMembers(params?: GetTeamMembersRequest) {
  return useQuery({
    queryKey: ['organisation', 'teamMembers', params],
    queryFn: () => getTeamMembers(params),
    placeholderData: keepPreviousData,
  })
}
