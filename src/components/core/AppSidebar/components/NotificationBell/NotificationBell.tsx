import { Bell } from 'lucide-react'
import { IconButton } from '@/components/common'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface NotificationBellProps {
  collapsed: boolean
  onClick: () => void
  unreadCount: number
}

export function NotificationBell({ collapsed, onClick, unreadCount }: NotificationBellProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <IconButton onClick={onClick}>
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </IconButton>
      </TooltipTrigger>
      <TooltipContent side={collapsed ? 'right' : 'top'}>Notifications</TooltipContent>
    </Tooltip>
  )
}
