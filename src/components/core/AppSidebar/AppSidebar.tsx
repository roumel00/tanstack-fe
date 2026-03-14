import { useState } from 'react'
import { Link, useLocation, useNavigate } from '@tanstack/react-router'
// eslint-disable-next-line @typescript-eslint/no-deprecated
import { Facebook, Gauge, Component, PanelLeftClose, PanelLeft, ChevronsUpDown, Settings, Building2, User as UserIcon, LogOut } from 'lucide-react'
import { cn, getStorageUrl } from '@/lib/utils'
import { useGetCurrentOrg } from '@/queries'
import { useClearOrg } from '@/queries/organisation'
import { useAuth } from '@/context/auth-context'
import { authClient } from '@/lib/auth-client'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils/organisation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { ProfileDrawer } from '@/components/common'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { NotificationDrawer, NotificationBell } from './components'
import { useGetUnreadCount } from '@/queries/notification'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Gauge,
  },
  {
    name: 'Components',
    href: '/components',
    icon: Component,
  },
]

export function AppSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { data: currentOrg, isLoading } = useGetCurrentOrg()
  const { data: session } = authClient.useSession()
  const { logout } = useAuth()
  const clearOrg = useClearOrg()
  const [collapsed, setCollapsed] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const { data: unreadData } = useGetUnreadCount()

  const user = session?.user as {
    firstName?: string
    lastName?: string
    email: string
    name?: string
    image?: string
  } | undefined

  const handleChangeOrg = async () => {
    await clearOrg.mutateAsync()
    navigate({ to: '/select-org' })
  }

  return (
    <>
      <div className={cn(
        'flex h-full flex-col rounded-2xl bg-white dark:bg-neutral-900 shadow-md transition-all duration-200',
        collapsed ? 'w-16' : 'w-64'
      )}>
        {/* Header: Logo + Toggle */}
        <div className="flex h-16 items-center justify-between px-4">
          {!collapsed && <Facebook size={24} className="text-blue-600 shrink-0" />}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-md text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer"
          >
            {collapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>

        {/* Workspace Dropdown */}
        <div className="mx-3 border-b border-neutral-100 dark:border-neutral-800 pb-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn(
                'flex items-center w-full rounded-md px-3 py-2 text-sm font-medium transition-all cursor-pointer shadow-md hover:shadow-xl hover:text-accent-foreground',
                collapsed && 'justify-center px-0'
              )}>
                {isLoading ? (
                  <Skeleton className="h-4 w-24" />
                ) : (
                  <>
                    {currentOrg?.currentOrg?.organisation.logo ? (
                      <img
                        src={getStorageUrl(currentOrg.currentOrg.organisation.logo)}
                        alt={currentOrg.currentOrg.organisation.name}
                        className={cn('size-5 rounded object-cover shrink-0', !collapsed && 'mr-2')}
                      />
                    ) : (
                      <Building2 size={16} className={cn('shrink-0', !collapsed && 'mr-2')} />
                    )}
                    {!collapsed && (
                      <>
                        <span className="truncate flex-1 text-left">
                          {currentOrg?.currentOrg?.organisation.name ?? 'Workspace'}
                        </span>
                        <ChevronsUpDown size={14} className="ml-1 shrink-0 text-neutral-400" />
                      </>
                    )}
                  </>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52">
              <DropdownMenuItem
                onClick={() => navigate({ to: '/settings' as string })}
                className="cursor-pointer"
              >
                <Settings />
                Workspace Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="mx-2" />
              <DropdownMenuItem
                onClick={handleChangeOrg}
                className="cursor-pointer"
              >
                <Building2 />
                Change Organisation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            const link = (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  collapsed && 'justify-center px-0',
                  isActive
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-primary'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-neutral-100'
                )}
              >
                {item.icon && <item.icon size={16} className={cn(!collapsed && 'mr-2')} />}
                {!collapsed && item.name}
              </Link>
            )

            if (!collapsed) return link

            return (
              <Tooltip key={item.name}>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent side="right">{item.name}</TooltipContent>
              </Tooltip>
            )
          })}
        </nav>

        {/* Bottom: User + Notifications */}
        <div className="mx-3 border-t border-neutral-100 dark:border-neutral-800 p-3">
          <div className={cn('-mx-3 flex items-center', collapsed ? 'flex-col gap-2' : 'gap-2')}>
            {/* User Dropdown */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-md p-1.5 transition-all flex-1 min-w-0 cursor-pointer shadow-md hover:shadow-xl hover:text-accent-foreground">
                    <Avatar size="sm">
                      <AvatarImage
                        src={user.image ? (user.image.startsWith('http') ? user.image : getStorageUrl(user.image)) : undefined}
                        alt={user.name || 'User'}
                      />
                      <AvatarFallback>{getInitials(user.name ?? user.email)}</AvatarFallback>
                    </Avatar>
                    {!collapsed && (
                      <>
                        <span className="text-sm font-medium truncate">
                          {user.firstName}
                        </span>
                        <ChevronsUpDown size={14} className="ml-auto shrink-0 text-neutral-400" />
                      </>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" side="top">
                  <DropdownMenuItem
                    onClick={() => setProfileOpen(true)}
                    className="cursor-pointer"
                  >
                    <UserIcon />
                    View Profile
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
            ) : (
              <Skeleton className="h-8 w-8 rounded-full" />
            )}

            {/* Notifications */}
            <NotificationBell
              collapsed={collapsed}
              onClick={() => setNotificationsOpen(true)}
              unreadCount={unreadData?.count ?? 0}
            />
          </div>
        </div>
      </div>

      {user && <ProfileDrawer user={user} open={profileOpen} onOpenChange={setProfileOpen} />}
      <NotificationDrawer open={notificationsOpen} onOpenChange={setNotificationsOpen} />
    </>
  )
}
