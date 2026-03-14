import type { Notification } from '@/lib/models'

export type GetNotificationsRequest = {
  page?: number
  limit?: number
}

export type GetNotificationsResponse = {
  notifications: Notification[]
  total: number
  page: number
  totalPages: number
}
