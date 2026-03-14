import { useMutation, useQueryClient } from '@tanstack/react-query'
import { patch } from '@/lib/api'
import type { MarkReadRequest, MarkReadResponse } from './types'

export async function markRead(data: MarkReadRequest): Promise<MarkReadResponse> {
  return patch<MarkReadResponse>(`/notifications/${data.id}/read`)
}

export function useMarkRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: markRead,
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ['notification'] })
    },
  })
}
