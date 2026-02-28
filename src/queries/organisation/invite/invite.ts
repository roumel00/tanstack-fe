import { useMutation, useQueryClient } from '@tanstack/react-query'
import { post } from '@/lib/api'
import { InviteRequest, InviteResponse } from './types'

export async function invite(data: InviteRequest): Promise<InviteResponse> {
  return post<InviteResponse>('/organisations/team/invite', data)
}

export function useInvite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: invite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organisation', 'teamMembers'] })
      queryClient.invalidateQueries({ queryKey: ['organisation', 'teamOverview'] })
    },
  })
}
