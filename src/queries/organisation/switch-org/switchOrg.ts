import { useMutation, useQueryClient } from '@tanstack/react-query'
import { post } from '@/lib/api'
import { SwitchOrgRequest, SwitchOrgResponse } from './types'

/**
 * Mutation function to switch organisation
 * POST /organisations/team/switch
 */
export async function switchOrg(
  data: SwitchOrgRequest
): Promise<SwitchOrgResponse> {
  return post<SwitchOrgResponse>('/organisations/team/switch', data)
}

/**
 * Mutation hook to switch organisation
 * POST /organisations/team/switch
 */
export function useSwitchOrg() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: switchOrg,
    onSuccess: () => {
      // Invalidate current org query to refetch with new org
      queryClient.invalidateQueries({ queryKey: ['organisation', 'currentOrg'] })
    },
  })
}

// Backwards compatibility aliases
export const switchOrganisation = switchOrg
export const useSwitchOrganisation = useSwitchOrg
export type SwitchOrganisationRequest = SwitchOrgRequest
export type SwitchOrganisationResponse = SwitchOrgResponse
