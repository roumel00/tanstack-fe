import { useMutation, useQueryClient } from '@tanstack/react-query'
import { post } from '@/lib/api'
import { CreateOrgRequest, CreateOrgResponse } from './types'

/**
 * Mutation function to create an organisation
 * POST /organisations
 */
export async function createOrg(
  data: CreateOrgRequest
): Promise<CreateOrgResponse> {
  return post<CreateOrgResponse>('/organisations', data)
}

/**
 * Mutation hook to create an organisation
 * POST /organisations
 */
export function useCreateOrg() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createOrg,
    onSuccess: () => {
      // Invalidate user organisations query to refetch the list
      queryClient.invalidateQueries({ queryKey: ['organisation', 'orgs'] })
      queryClient.invalidateQueries({ queryKey: ['organisation', 'currentOrg'] })
    },
  })
}
