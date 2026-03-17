import { useMutation, useQueryClient } from '@tanstack/react-query'
import { post } from '@/lib/api'
import { ChangeRoleRequest, ChangeRoleResponse } from './types'

export async function changeRole(data: ChangeRoleRequest): Promise<ChangeRoleResponse> {
  return post<ChangeRoleResponse>('/workspace/team/change-role', data)
}

export function useChangeRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: changeRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace', 'teamMembers'] })
      queryClient.invalidateQueries({ queryKey: ['workspace', 'teamOverview'] })
    },
  })
}
