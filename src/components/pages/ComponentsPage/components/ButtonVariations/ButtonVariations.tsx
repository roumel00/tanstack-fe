import { Settings, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { ActionButton, IconButton } from '@/components/common'

export function ButtonVariations() {
  const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const

  return (
    <div className="flex flex-wrap items-center gap-4">
      {variants.map((variant) => (
        <Button key={variant} variant={variant}>
          {variant.charAt(0).toUpperCase() + variant.slice(1)}
        </Button>
      ))}
      <IconButton tooltip="Settings">
        <Settings size={18} />
      </IconButton>
      <IconButton tooltip="Notifications">
        <Bell size={18} />
      </IconButton>
      <ActionButton>
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem>Duplicate</DropdownMenuItem>
        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
      </ActionButton>
    </div>
  )
}
