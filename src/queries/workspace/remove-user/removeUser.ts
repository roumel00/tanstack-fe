import { useMutation, useQueryClient } from '@tanstack/react-query'
import { post } from '@/lib/api'
import { RemoveUserRequest, RemoveUserResponse } from './types'

export async function removeUser(data: RemoveUserRequest): Promise<RemoveUserResponse> {
  return post<RemoveUserResponse>('/workspace/team/remove-user', data)
}

export function useRemoveUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: removeUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace', 'teamMembers'] })
      queryClient.invalidateQueries({ queryKey: ['workspace', 'teamOverview'] })
    },
  })
}
