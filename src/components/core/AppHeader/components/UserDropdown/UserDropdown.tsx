import { useState } from 'react'
import { getStorageUrl } from '@/lib/utils'
import { useAuth } from '@/context/auth-context'
import { useClearOrg } from '@/queries/organisation'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { useNavigate } from '@tanstack/react-router'
import { Building2, LogOut, User as UserIcon } from 'lucide-react'
import { getInitials } from '@/lib/utils/organisation'
import { ProfileDrawer } from './components'

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
  const clearOrg = useClearOrg()
  const [profileOpen, setProfileOpen] = useState(false)

  const handleChangeOrg = async () => {
    await clearOrg.mutateAsync()
    navigate({ to: '/select-org' })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="group flex items-center gap-3 px-2 py-1 -mx-2 -my-1 h-auto hover:bg-transparent dark:hover:bg-transparent cursor-pointer focus-visible:ring-0">
            <Avatar size="lg">
              <AvatarImage src={user.image ? (user.image.startsWith('http') ? user.image : getStorageUrl(user.image)) : undefined} alt={user.name || 'User'} />
              <AvatarFallback>{getInitials(user.name ?? user.email)}</AvatarFallback>
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
            onClick={() => setProfileOpen(true)}
            className="cursor-pointer"
          >
            <UserIcon />
            View Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleChangeOrg}
            className="cursor-pointer"
          >
            <Building2 />
            Change Organisation
          </DropdownMenuItem>
          <DropdownMenuSeparator className="mx-2" />
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
      <ProfileDrawer user={user} open={profileOpen} onOpenChange={setProfileOpen} />
    </>
  )
}
