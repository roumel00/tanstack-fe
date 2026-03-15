import { Bell } from 'lucide-react'
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
        <button
          onClick={onClick}
          className="relative p-1.5 rounded-md text-foreground hover:bg-background transition-colors shrink-0 cursor-pointer"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side={collapsed ? 'right' : 'top'}>Notifications</TooltipContent>
    </Tooltip>
  )
}
