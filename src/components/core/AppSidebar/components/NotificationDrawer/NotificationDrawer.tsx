import { useCallback, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Check, CheckCheck, Loader2 } from 'lucide-react'
import { useGetNotifications, useGetUnreadCount, useMarkRead, useMarkAllRead } from '@/queries/notification'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Skeleton } from '@/components/ui/skeleton'
import { NotificationItem } from './components'

interface NotificationDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NotificationDrawer({ open, onOpenChange }: NotificationDrawerProps) {
  const queryClient = useQueryClient()
  const { data: unreadData } = useGetUnreadCount()
  const {
    data: notificationsData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetNotifications({ limit: 20, enabled: open })
  const markRead = useMarkRead()
  const markAllRead = useMarkAllRead()

  const unreadCount = unreadData?.count ?? 0
  const notifications = notificationsData?.pages.flatMap((p) => p.notifications) ?? []

  const observer = useRef<IntersectionObserver | null>(null)
  const lastNotificationRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage()
        }
      })
      if (node) observer.current.observe(node)
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage],
  )

  const handleMarkRead = (id: string) => {
    markRead.mutate({ id })
  }

  const handleMarkAllRead = () => {
    markAllRead.mutate()
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      queryClient.removeQueries({ queryKey: ['notification', 'list'] })
    }
    onOpenChange(isOpen)
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <div className="flex items-center">
            <SheetTitle>Notifications</SheetTitle>
            {unreadCount > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="ml-2 mr-6 size-7"
                    onClick={handleMarkAllRead}
                    disabled={markAllRead.isPending}
                  >
                    {markAllRead.isPending ? <Loader2 size={14} className="animate-spin" /> : <CheckCheck size={14} />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Mark all read</TooltipContent>
              </Tooltip>
            )}
          </div>
          <SheetDescription>
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
              : 'You\'re all caught up'}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4">
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-3 px-3 py-2.5">
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Check size={24} className="mb-2" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.map((notification, index) => (
                <div
                  key={notification._id}
                  ref={index === notifications.length - 1 ? lastNotificationRef : undefined}
                >
                  <NotificationItem
                    notification={notification}
                    onMarkRead={handleMarkRead}
                    isMarkingRead={markRead.isPending && markRead.variables?.id === notification._id}
                  />
                </div>
              ))}
              {isFetchingNextPage && (
                <div className="flex justify-center py-3">
                  <Loader2 size={16} className="animate-spin text-muted-foreground" />
                </div>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
