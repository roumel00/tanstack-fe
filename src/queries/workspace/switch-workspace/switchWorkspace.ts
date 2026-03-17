import { useMutation, useQueryClient } from '@tanstack/react-query'
import { post } from '@/lib/api'
import { SwitchWorkspaceRequest, SwitchWorkspaceResponse } from './types'

/**
 * Mutation function to switch workspace
 * POST /workspace/team/switch
 */
export async function switchWorkspace(
  data: SwitchWorkspaceRequest
): Promise<SwitchWorkspaceResponse> {
  return post<SwitchWorkspaceResponse>('/workspace/team/switch', data)
}

/**
 * Mutation hook to switch workspace
 * POST /workspace/team/switch
 */
export function useSwitchWorkspace() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: switchWorkspace,
    onSuccess: () => {
      // Invalidate current workspace query to refetch with new workspace
      queryClient.invalidateQueries({ queryKey: ['workspace', 'currentWorkspace'] })
    },
  })
}
