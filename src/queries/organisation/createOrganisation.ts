import { useMutation, useQueryClient } from '@tanstack/react-query'
import { post } from '@/lib/api'
import { Organisation } from './types'

export type CreateOrganisationRequest = {
  name: string
  timezone: string
  email?: string
  phone?: string
  address?: {
    street?: string
    city?: string
    state?: string
    postalCode?: string
    country?: string
  }
  website?: string
  logo?: string
}

export type CreateOrganisationResponse = Organisation

/**
 * Mutation function to create an organisation
 * POST /organisations
 */
export async function createOrganisation(
  data: CreateOrganisationRequest
): Promise<CreateOrganisationResponse> {
  return post<CreateOrganisationResponse>('/organisations', data)
}

/**
 * Mutation hook to create an organisation
 * POST /organisations
 */
export function useCreateOrganisation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createOrganisation,
    onSuccess: () => {
      // Invalidate user organisations query to refetch the list
      queryClient.invalidateQueries({ queryKey: ['user', 'organisations'] })
      queryClient.invalidateQueries({ queryKey: ['user', 'currentOrg'] })
    },
  })
}
