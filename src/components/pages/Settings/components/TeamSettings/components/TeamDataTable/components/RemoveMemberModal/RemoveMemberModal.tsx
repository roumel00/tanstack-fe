import { useRemoveUser } from '@/queries/workspace/remove-user'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TeamMemberDto } from '@/queries/workspace/get-team-members'

type TeamMemberRow = TeamMemberDto

interface RemoveMemberModalProps {
  member: TeamMemberRow | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RemoveMemberModal({ member, open, onOpenChange }: RemoveMemberModalProps) {
  const { mutate: removeUser, isPending } = useRemoveUser()

  const handleConfirm = () => {
    if (!member?.userId) return
    removeUser(
      { userId: member.userId },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove team member</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove{' '}
            <span className="font-medium text-foreground">
              {member?.name ?? member?.email}
            </span>{' '}
            from the team? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={isPending}>
            {isPending ? 'Removing...' : 'Remove member'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
