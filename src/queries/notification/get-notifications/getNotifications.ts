import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query'
import { get } from '@/lib/api'
import type { GetNotificationsRequest, GetNotificationsResponse } from './types'

export async function getNotifications(
  params?: GetNotificationsRequest,
): Promise<GetNotificationsResponse> {
  const searchParams = new URLSearchParams()
  if (params?.page) searchParams.set('page', String(params.page))
  if (params?.limit) searchParams.set('limit', String(params.limit))

  const query = searchParams.toString()
  return get<GetNotificationsResponse>(
    `/notifications${query ? `?${query}` : ''}`,
  )
}

export const getNotificationsQueryOptions = (params?: Omit<GetNotificationsRequest, 'page'>) =>
  infiniteQueryOptions({
    queryKey: ['notification', 'list', params] as const,
    queryFn: ({ pageParam }) => getNotifications({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  })

export function useGetNotifications(params?: Omit<GetNotificationsRequest, 'page'> & { enabled?: boolean }) {
  const { enabled, ...queryParams } = params ?? {}
  return useInfiniteQuery({
    ...getNotificationsQueryOptions(Object.keys(queryParams).length > 0 ? queryParams : undefined),
    enabled,
  })
}
