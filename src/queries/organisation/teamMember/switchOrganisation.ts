import { useMutation, useQueryClient } from '@tanstack/react-query'
import { post } from '@/lib/api'

export type SwitchOrganisationRequest = {
  orgId: string
}

export type SwitchOrganisationResponse = {
  orgId: string
}

/**
 * Mutation function to switch organisation
 * POST /organisations/team/switch
 */
export async function switchOrganisation(
  data: SwitchOrganisationRequest
): Promise<SwitchOrganisationResponse> {
  return post<SwitchOrganisationResponse>('/organisations/team/switch', data)
}

/**
 * Mutation hook to switch organisation
 * POST /organisations/team/switch
 */
export function useSwitchOrganisation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: switchOrganisation,
    onSuccess: () => {
      // Invalidate current org query to refetch with new org
      queryClient.invalidateQueries({ queryKey: ['user', 'currentOrg'] })
    },
  })
}
