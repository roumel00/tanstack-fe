import { useMutation, useQueryClient } from '@tanstack/react-query'
import { post } from '@/lib/api'
import { CancelInviteRequest, CancelInviteResponse } from './types'

export async function cancelInvite(data: CancelInviteRequest): Promise<CancelInviteResponse> {
  return post<CancelInviteResponse>('/organisations/team/cancelInvite', data)
}

export function useCancelInvite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: cancelInvite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organisation', 'teamMembers'] })
    },
  })
}
