import { useMutation } from '@tanstack/react-query'
import { patch } from '@/lib/api'
import { UpdateWorkspaceDetailsRequest, UpdateWorkspaceDetailsResponse } from './types'

export async function updateWorkspaceDetails(
  data: UpdateWorkspaceDetailsRequest
): Promise<UpdateWorkspaceDetailsResponse> {
  return patch<UpdateWorkspaceDetailsResponse>('/workspace/update-details', data)
}

export function useUpdateWorkspaceDetails() {
  return useMutation({
    mutationFn: updateWorkspaceDetails,
  })
}
