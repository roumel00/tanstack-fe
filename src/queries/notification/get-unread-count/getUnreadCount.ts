import { queryOptions, useQuery } from '@tanstack/react-query'
import { get } from '@/lib/api'
import type { GetUnreadCountResponse } from './types'

export async function getUnreadCount(): Promise<GetUnreadCountResponse> {
  return get<GetUnreadCountResponse>('/notifications/unread-count/fetch')
}

export const getUnreadCountQueryOptions = queryOptions({
  queryKey: ['notification', 'unreadCount'],
  queryFn: getUnreadCount,
  refetchInterval: 30_000,
})

export function useGetUnreadCount() {
  return useQuery(getUnreadCountQueryOptions)
}
