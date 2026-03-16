import { useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Building2, Search, User as UserIcon, LogOut } from 'lucide-react'
import { useGetWorkspaces, useSwitchWorkspace} from '@/queries'
import { useAuth } from '@/context/auth-context'
import { authClient } from '@/lib/auth-client'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { ProfileDrawer } from '@/components/common'
import { getStorageUrl } from '@/lib/utils'
import { getInitials } from '@/lib/utils/workspace'
import { WorkspaceCard } from './components'


export function SelectWorkspace() {
  const { data: workspaces, isLoading, error } = useGetWorkspaces()
  const { mutate: switchWorkspace, isPending } = useSwitchWorkspace()
  const { logout } = useAuth()
  const { data: session } = authClient.useSession()
  const [search, setSearch] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)

  const user = session?.user as {
    firstName?: string
    lastName?: string
    email: string
    name?: string
    image?: string
  } | undefined

  const hasOwnedWorkspaces = workspaces?.some((workspace) => workspace.role === 'owner') ?? false

  const filteredWorkspaces = useMemo(() => {
    if (!workspaces) return []
    if (!search.trim()) return workspaces
    const q = search.toLowerCase()
    return workspaces.filter((workspace) => workspace.name.toLowerCase().includes(q))
  }, [workspaces, search])

  const handleSwitchWorkspace= (workspaceId: string) => {
    switchWorkspace(
      { workspaceId },
      {
        onSuccess: () => {
          window.location.href = '/dashboard'
        },
      }
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-destructive">Error loading workspaces</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex justify-center p-6">
      <div className="w-full max-w-3xl rounded-2xl bg-card border p-12 h-fit mt-12">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-muted shadow-md">
            <Building2 className="h-6 w-6 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-semibold">Select a workspace</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose a workspace to continue
          </p>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search workspaces..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {isLoading
            ? Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="relative h-48 overflow-hidden rounded-xl bg-muted"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-muted-foreground/15 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="mt-2 h-4 w-24" />
                  </div>
                </div>
              ))
            : filteredWorkspaces.map((workspace) => (
                  <WorkspaceCard
                    key={workspace.workspaceId}
                    name={workspace.name}
                    role={workspace.role}
                    memberCount={workspace.memberCount}
                    logo={workspace.logo}
                    isPending={isPending}
                    onClick={() => handleSwitchWorkspace(workspace.workspaceId)}
                  />
              ))}
        </div>

        {!hasOwnedWorkspaces && !isLoading && (
          <Link
            to="/create-workspace"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-muted-foreground/30 py-3 text-sm text-muted-foreground transition-colors hover:border-muted-foreground/50 hover:text-foreground"
          >
            + Create new workspace
          </Link>
        )}
      </div>

      {/* User Card */}
      {user && (
        <div className="fixed bottom-6 left-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 rounded-2xl bg-card border px-4 py-3 cursor-pointer hover:bg-muted-dark/50 transition-colors">
                <Avatar size="sm">
                  <AvatarImage
                    src={user.image ? (user.image.startsWith('http') ? user.image : getStorageUrl(user.image)) : undefined}
                    alt={user.name || 'User'}
                  />
                  <AvatarFallback>{getInitials(user.name ?? user.email)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-foreground">
                  {user.firstName ?? user.email}
                </span>
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
        </div>
      )}

      {user && <ProfileDrawer user={user} open={profileOpen} onOpenChange={setProfileOpen} />}
    </div>
  )
}
