import { useMutation, useQueryClient } from '@tanstack/react-query'
import { post } from '@/lib/api'
import { InviteRequest, InviteResponse } from './types'

export async function invite(data: InviteRequest): Promise<InviteResponse> {
  return post<InviteResponse>('/workspaces/team/invite', data)
}

export function useInvite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: invite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace', 'teamMembers'] })
      queryClient.invalidateQueries({ queryKey: ['workspace', 'teamOverview'] })
    },
  })
}
