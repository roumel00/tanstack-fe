import { useMemo, useState } from "react"
import { cn, getStorageUrl } from "@/lib/utils"
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, Crown, Mail, MoreHorizontal, Plus, RefreshCw, Shield, User, UserMinus, MailX } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { TeamMemberDto } from "@/queries/organisation/get-team-members"
import { useGetTeamMembers } from "@/queries/organisation/get-team-members"
import { getInitials } from "@/lib/utils/organisation"
import { InviteMemberModal, UninviteMemberModal, RemoveMemberModal, ChangeRoleModal } from "./components"
import { useDebounce } from "@/hooks/useDebounce"

type TeamMemberRow = TeamMemberDto

interface ColumnActions {
  onCancelInvite: (member: TeamMemberRow) => void
  onChangeRole: (member: TeamMemberRow) => void
  onRemoveMember: (member: TeamMemberRow) => void
}

function getColumns(
  currentRole: "owner" | "admin" | "member" | "invitee" | undefined,
  actions: ColumnActions
): ColumnDef<TeamMemberRow>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const { name, image, email } = row.original
        return (
          <div className="flex items-center gap-2">
            <Avatar>
              {image && <AvatarImage src={image.startsWith('http') ? image : getStorageUrl(image)} alt={name ?? email} />}
              <AvatarFallback>{getInitials(name ?? email)}</AvatarFallback>
            </Avatar>
            <span>{name ?? "—"}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Role
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const role = row.getValue<string>("role")
        const config = {
          owner: { icon: Crown, label: "Owner", className: "bg-purple-100 text-purple-700" },
          admin: { icon: Shield, label: "Admin", className: "bg-blue-100 text-blue-700" },
          member: { icon: User, label: "Member", className: "bg-green-100 text-green-700" },
          invitee: { icon: Mail, label: "Invitee", className: "bg-yellow-100 text-yellow-700" },
        }[role] ?? { icon: User, label: role, className: "bg-gray-100 text-gray-700" }
        const Icon = config.icon
        return (
          <Badge variant="secondary" className={config.className}>
            <Icon />
            {config.label}
          </Badge>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Joined
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue<string>("createdAt"))
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      },
    },
    {
      id: "actions",
      size: 48,
      meta: { sticky: "right" },
      cell: ({ row }) => {
        const memberRole = row.original.role

        const disabled =
          memberRole === "owner" ||
          ((memberRole === "admin" || memberRole === "member") && currentRole !== "owner") ||
          (memberRole === "invitee" && currentRole !== "owner" && currentRole !== "admin")

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-8 w-8 p-0" disabled={disabled}>
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {memberRole === "invitee" ? (
                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => actions.onCancelInvite(row.original)}>
                  <MailX className="h-4 w-4 text-destructive" />
                  Cancel invite
                </DropdownMenuItem>
              ) : (
                <>
                  {currentRole === "owner" && (
                    <DropdownMenuItem onClick={() => actions.onChangeRole(row.original)}>
                      <RefreshCw className="h-4 w-4" />
                      Change role
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    disabled={memberRole === "admin"}
                    onClick={() => actions.onRemoveMember(row.original)}
                  >
                    <UserMinus className="h-4 w-4 text-destructive" />
                    Remove from team
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}

interface TeamDataTableProps {
  currentRole: "owner" | "admin" | "member" | "invitee" | undefined
}

export function TeamDataTable({ currentRole }: TeamDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [searchInput, setSearchInput] = useState("")
  const [page, setPage] = useState(1)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [uninviteMember, setUninviteMember] = useState<TeamMemberRow | null>(null)
  const [removeMember, setRemoveMember] = useState<TeamMemberRow | null>(null)
  const [changeRoleMember, setChangeRoleMember] = useState<TeamMemberRow | null>(null)

  const debouncedSearch = useDebounce(searchInput, 300)

  const sortBy = sorting[0]?.id
  const sortOrder = sorting[0] ? (sorting[0].desc ? 'desc' : 'asc') : undefined

  const { data, isLoading } = useGetTeamMembers({
    page,
    search: debouncedSearch || undefined,
    sortBy,
    sortOrder,
  })

  const members = data?.members ?? []
  const totalPages = data?.totalPages ?? 1

  const actions: ColumnActions = useMemo(() => ({
    onCancelInvite: setUninviteMember,
    onChangeRole: setChangeRoleMember,
    onRemoveMember: setRemoveMember,
  }), [])

  const columns = useMemo(() => getColumns(currentRole, actions), [currentRole, actions])

  const table = useReactTable({
    data: members,
    columns,
    onSortingChange: (updater) => {
      setSorting(updater)
      setPage(1)
    },
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    state: {
      sorting,
    },
  })

  const handleSearchChange = (value: string) => {
    setSearchInput(value)
    setPage(1)
  }

  return (
    <div>
      <div className="w-full flex justify-between items-center py-4">
        <Input
          placeholder="Search by name or email..."
          value={searchInput}
          onChange={(event) => handleSearchChange(event.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => setInviteOpen(true)} disabled={currentRole === "member"}>
          <Plus className="h-4 w-4" />
          Add member
        </Button>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table className="min-w-[800px]">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const sticky = (header.column.columnDef.meta as { sticky?: string })?.sticky
                  const size = header.column.columnDef.size
                  return (
                    <TableHead
                      key={header.id}
                      data-sticky={sticky || undefined}
                      className={cn(
                        sticky !== "left" && "first:pl-4",
                        sticky === "left" && "sticky left-0 z-10 bg-background px-2 text-center [&:has([role=checkbox])]:pr-2",
                        sticky === "right" && "sticky right-0 z-10 bg-background px-2 text-center"
                      )}
                      style={size ? { width: size } : undefined}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="py-3 first:pl-4">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell className="py-3">
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </TableCell>
                  <TableCell className="py-3">
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell className="py-3" style={{ width: 48 }}>
                    <Skeleton className="h-8 w-8" />
                  </TableCell>
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    const sticky = (cell.column.columnDef.meta as { sticky?: string })?.sticky
                    const size = cell.column.columnDef.size
                    return (
                      <TableCell
                        key={cell.id}
                        data-sticky={sticky || undefined}
                        className={cn(
                          "py-3",
                          sticky !== "left" && "first:pl-4",
                          sticky === "left" && "sticky left-0 z-10 bg-background px-2 text-center [&:has([role=checkbox])]:pr-2",
                          sticky === "right" && "sticky right-0 z-10 bg-background px-2 text-center"
                        )}
                        style={size ? { width: size } : undefined}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1}
        >
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= totalPages}
        >
          Next
        </Button>
      </div>
      <InviteMemberModal open={inviteOpen} onOpenChange={setInviteOpen} />
      <UninviteMemberModal
        member={uninviteMember}
        open={!!uninviteMember}
        onOpenChange={(open) => { if (!open) setUninviteMember(null) }}
      />
      <RemoveMemberModal
        member={removeMember}
        open={!!removeMember}
        onOpenChange={(open) => { if (!open) setRemoveMember(null) }}
      />
      <ChangeRoleModal
        member={changeRoleMember}
        open={!!changeRoleMember}
        onOpenChange={(open) => { if (!open) setChangeRoleMember(null) }}
      />
    </div>
  )
}
