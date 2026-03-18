import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
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
  },
)

IconButton.displayName = 'IconButton'
