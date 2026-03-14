import { Loader2, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { Notification } from '@/lib/models'

function formatTimeAgo(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

export function NotificationItem({
  notification,
  onMarkRead,
  isMarkingRead,
}: {
  notification: Notification
  onMarkRead: (id: string) => void
  isMarkingRead: boolean
}) {
  return (
    <Card
      className={cn(
        'gap-0 py-3 my-3',
        notification.read && 'opacity-60'
      )}
    >
      <CardContent className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className={cn('text-sm leading-snug', !notification.read && 'font-medium')}>
            {notification.context.title}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {formatTimeAgo(notification.createdAt)}
          </p>
        </div>
        {!notification.read && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="mt-0.5 size-7 shrink-0"
                onClick={() => onMarkRead(notification._id)}
                disabled={isMarkingRead}
              >
                {isMarkingRead ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">Mark as read</TooltipContent>
          </Tooltip>
        )}
      </CardContent>
    </Card>
  )
}
