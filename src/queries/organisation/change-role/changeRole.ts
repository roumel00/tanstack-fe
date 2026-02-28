import { useMutation, useQueryClient } from '@tanstack/react-query'
import { post } from '@/lib/api'
import { ChangeRoleRequest, ChangeRoleResponse } from './types'

export async function changeRole(data: ChangeRoleRequest): Promise<ChangeRoleResponse> {
  return post<ChangeRoleResponse>('/organisations/team/changeRole', data)
}

export function useChangeRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: changeRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organisation', 'teamMembers'] })
      queryClient.invalidateQueries({ queryKey: ['organisation', 'teamOverview'] })
    },
  })
}
