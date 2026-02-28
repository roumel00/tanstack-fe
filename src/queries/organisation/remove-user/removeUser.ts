import { useMutation, useQueryClient } from '@tanstack/react-query'
import { post } from '@/lib/api'
import { RemoveUserRequest, RemoveUserResponse } from './types'

export async function removeUser(data: RemoveUserRequest): Promise<RemoveUserResponse> {
  return post<RemoveUserResponse>('/organisations/team/removeUser', data)
}

export function useRemoveUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: removeUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organisation', 'teamMembers'] })
    },
  })
}
