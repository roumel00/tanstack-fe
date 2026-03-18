import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  tooltip?: string
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left'
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, children, tooltip, tooltipSide = 'bottom', ...props }, ref) => {
    const button = (
      <button
        ref={ref}
        className={cn(
          'relative p-1.5 rounded-md text-foreground hover:bg-background transition-colors shrink-0 cursor-pointer',
          props.disabled && 'opacity-50 cursor-not-allowed',
          className,
        )}
        {...props}
      >
        {children}
      </button>
    )

    if (!tooltip) return button

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side={tooltipSide}>{tooltip}</TooltipContent>
      </Tooltip>
    )
  },
)

IconButton.displayName = 'IconButton'
