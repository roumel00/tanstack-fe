import { useMutation, useQueryClient } from '@tanstack/react-query'
import { post } from '@/lib/api'
import { CreateWorkspaceRequest, CreateWorkspaceResponse } from './types'

/**
 * Mutation function to create a workspace
 * POST /workspace/create-workspace
 */
export async function createWorkspace(
  data: CreateWorkspaceRequest
): Promise<CreateWorkspaceResponse> {
  return post<CreateWorkspaceResponse>('/workspace/create-workspace', data)
}

/**
 * Mutation hook to create a workspace
 * POST /workspace/create-workspace
 */
export function useCreateWorkspace() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createWorkspace,
    onSuccess: () => {
      // Invalidate user workspaces query to refetch the list
      queryClient.invalidateQueries({ queryKey: ['workspace', 'workspaces'] })
      queryClient.invalidateQueries({ queryKey: ['workspace', 'currentWorkspace'] })
    },
  })
}
