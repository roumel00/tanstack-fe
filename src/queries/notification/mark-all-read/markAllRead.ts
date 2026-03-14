import { useMutation, useQueryClient } from '@tanstack/react-query'
import { patch } from '@/lib/api'
import type { MarkAllReadResponse } from './types'

export async function markAllRead(): Promise<MarkAllReadResponse> {
  return patch<MarkAllReadResponse>('/notifications/read-all')
}

export function useMarkAllRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: markAllRead,
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ['notification'] })
    },
  })
}
