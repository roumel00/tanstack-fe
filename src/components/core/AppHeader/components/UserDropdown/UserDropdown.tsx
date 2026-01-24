import { useAuth } from '@/context/auth-context'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useNavigate } from '@tanstack/react-router'
import { Building2, LogOut } from 'lucide-react'

type User = {
  firstName?: string
  lastName?: string
  email: string
  name?: string
  image?: string
}

interface UserDropdownProps {
  user: User
}

export function UserDropdown({ user }: UserDropdownProps) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="group flex items-center gap-3 px-2 py-1 -mx-2 -my-1 h-auto hover:bg-transparent dark:hover:bg-transparent cursor-pointer focus-visible:ring-0">
          <Avatar className="h-8 w-8 rounded-md shadow-md group-hover:shadow-lg transition-shadow duration-300">
            <AvatarImage src={user.image || undefined} alt={user.name || 'User'} />
            <AvatarFallback className="rounded-md">{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="hidden sm:block text-base text-left">
            <div className="font-medium text-neutral-900 dark:text-neutral-100">
              {user.firstName}
            </div>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => navigate({ to: '/select-org' })}
          className="cursor-pointer"
        >
          <Building2 />
          Change Organisation
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          onClick={() => logout()}
          className="cursor-pointer"
        >
          <LogOut className="text-destructive" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
