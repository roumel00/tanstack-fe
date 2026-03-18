import { useState } from 'react'
import { Link, useLocation, useNavigate } from '@tanstack/react-router'
// eslint-disable-next-line @typescript-eslint/no-deprecated
import { Facebook, Gauge, Component, PanelLeftClose, PanelLeft, ChevronsUpDown, Settings, Building2, User as UserIcon, LogOut, Sun, Moon } from 'lucide-react'
import { cn, getStorageUrl } from '@/lib/utils'
import { useGetCurrentWorkspace} from '@/queries'
import { useClearWorkspace} from '@/queries/workspace'
import { useAuth } from '@/context/auth-context'
import { authClient } from '@/lib/auth-client'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils/workspace'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { IconButton, ProfileDrawer } from '@/components/common'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { NotificationDrawer, NotificationBell } from './components'
import { useGetUnreadCount } from '@/queries/notification'
import { useTheme } from '@/components/core/ThemeProvider'

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
  const { data: currentWorkspace, isLoading } = useGetCurrentWorkspace()
  const { data: session } = authClient.useSession()
  const { logout } = useAuth()
  const clearWorkspace= useClearWorkspace()
  const [collapsed, setCollapsed] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const { data: unreadData } = useGetUnreadCount()
  const { theme, toggleTheme } = useTheme()

  const user = session?.user as {
    firstName?: string
    lastName?: string
    email: string
    name?: string
    image?: string
  } | undefined

  const handleChangeWorkspace= async () => {
    await clearWorkspace.mutateAsync()
    navigate({ to: '/select-workspace' })
  }

  return (
    <>
      <div className={cn(
        'flex h-full flex-col rounded-2xl bg-sidebar shadow-md transition-all duration-200',
        collapsed ? 'w-16' : 'w-64'
      )}>
        {/* Header: Logo + Toggle */}
        <div className="flex h-16 items-center justify-between px-4">
          {!collapsed && <Facebook size={24} className="text-foreground shrink-0" />}
          <div className="flex items-center gap-1">
            {!collapsed && (
              <IconButton
                onClick={toggleTheme}
                tooltip={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                <Sun size={18} className="scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                <Moon size={18} className="absolute inset-0 m-auto scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
              </IconButton>
            )}
            <IconButton
              onClick={() => setCollapsed(!collapsed)}
              tooltip={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              tooltipSide={collapsed ? 'right' : 'bottom'}
            >
              {collapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
            </IconButton>
          </div>
        </div>

        {/* Workspace Dropdown */}
        <div className="mx-3 border-b border-muted pb-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn(
                'flex items-center w-full rounded-md border px-3 py-2 text-sm font-medium transition-all cursor-pointer hover:bg-surface-muted/50 hover:text-accent-foreground',
                collapsed && 'justify-center px-0'
              )}>
                {isLoading ? (
                  <Skeleton className="h-5 w-24" />
                ) : (
                  <>
                    {currentWorkspace?.currentWorkspace?.workspace.logo ? (
                      <img
                        src={getStorageUrl(currentWorkspace.currentWorkspace.workspace.logo)}
                        alt={currentWorkspace.currentWorkspace.workspace.name}
                        className={cn('size-5 rounded object-cover shrink-0', !collapsed && 'mr-2')}
                      />
                    ) : (
                      <Building2 size={16} className={cn('shrink-0', !collapsed && 'mr-2')} />
                    )}
                    {!collapsed && (
                      <>
                        <span className="truncate flex-1 text-left">
                          {currentWorkspace?.currentWorkspace?.workspace.name ?? 'Workspace'}
                        </span>
                        <ChevronsUpDown size={14} className="ml-1 shrink-0 text-muted-foreground" />
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
                onClick={handleChangeWorkspace}
                className="cursor-pointer"
              >
                <Building2 />
                Change Workspace
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
                    ? 'bg-background text-primary font-semibold'
                    : 'text-foreground/70 hover:bg-background hover:text-foreground'
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
        <div className="mx-3 border-t border-muted p-3">
          <div className={cn('-mx-3 flex items-center', collapsed ? 'flex-col gap-2' : 'gap-2')}>
            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-md border p-1.5 transition-all flex-1 min-w-0 cursor-pointer hover:bg-surface-muted/50 hover:text-accent-foreground">
                  {user ? (
                    <>
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
                          <ChevronsUpDown size={14} className="ml-auto shrink-0 text-muted-foreground" />
                        </>
                      )}
                    </>
                  ) : (
                    <Skeleton className="h-6 w-24" />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" side="top">
                <DropdownMenuItem
                  onSelect={() => setTimeout(() => setProfileOpen(true), 0)}
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
                  <LogOut className="text-destructive-foreground" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

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
