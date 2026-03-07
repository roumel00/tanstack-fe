import { useMutation } from '@tanstack/react-query'
import { patch } from '@/lib/api'
import { UpdateOrgDetailsRequest, UpdateOrgDetailsResponse } from './types'

export async function updateOrgDetails(
  data: UpdateOrgDetailsRequest
): Promise<UpdateOrgDetailsResponse> {
  return patch<UpdateOrgDetailsResponse>('/organisations/details', data)
}

export function useUpdateOrgDetails() {
  return useMutation({
    mutationFn: updateOrgDetails,
  })
}
