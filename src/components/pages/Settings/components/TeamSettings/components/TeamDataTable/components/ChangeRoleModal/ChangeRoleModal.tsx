import { useState } from 'react'
import { useChangeRole } from '@/queries/organisation/change-role'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TeamMemberDto } from '@/queries/organisation/get-team-members'
import { cn } from '@/lib/utils'
import { Shield, User } from 'lucide-react'

type TeamMemberRow = TeamMemberDto

interface ChangeRoleModalProps {
  member: TeamMemberRow | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const roles = [
  { value: 'admin', label: 'Admin', icon: Shield, description: 'Can manage team members and settings' },
  { value: 'member', label: 'Member', icon: User, description: 'Can view and collaborate' },
] as const

export function ChangeRoleModal({ member, open, onOpenChange }: ChangeRoleModalProps) {
  const [selectedRole, setSelectedRole] = useState<string>('')
  const { mutate: changeRole, isPending } = useChangeRole()

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) setSelectedRole('')
    onOpenChange(isOpen)
  }

  const handleConfirm = () => {
    if (!member?.userId || !selectedRole) return
    changeRole(
      { userId: member.userId, role: selectedRole },
      {
        onSuccess: () => {
          setSelectedRole('')
          onOpenChange(false)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change role</DialogTitle>
          <DialogDescription>
            Select a new role for{' '}
            <span className="font-medium text-foreground">
              {member?.name ?? member?.email}
            </span>.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          {roles.map((role) => {
            const Icon = role.icon
            const isCurrentRole = member?.role === role.value
            const isSelected = selectedRole === role.value
            return (
              <button
                key={role.value}
                type="button"
                disabled={isCurrentRole}
                onClick={() => setSelectedRole(role.value)}
                className={cn(
                  'flex items-center gap-3 rounded-md border p-3 text-left transition-colors',
                  isSelected && 'border-primary bg-primary/5',
                  isCurrentRole && 'opacity-50 cursor-not-allowed',
                  !isSelected && !isCurrentRole && 'cursor-pointer hover:bg-muted'
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <div>
                  <div className="text-sm font-medium">
                    {role.label}
                    {isCurrentRole && <span className="ml-2 text-xs text-muted-foreground">(current)</span>}
                  </div>
                  <div className="text-xs text-muted-foreground">{role.description}</div>
                </div>
              </button>
            )
          })}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isPending || !selectedRole}>
            {isPending ? 'Updating...' : 'Update role'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
