import { useCancelInvite } from '@/queries/organisation/cancel-invite'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { GetTeamMembersResponse } from '@/queries/organisation/get-team-members'

type TeamMemberRow = GetTeamMembersResponse[number]

interface UninviteMemberModalProps {
  member: TeamMemberRow | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UninviteMemberModal({ member, open, onOpenChange }: UninviteMemberModalProps) {
  const { mutate: cancelInvite, isPending } = useCancelInvite()

  const handleConfirm = () => {
    if (!member) return
    cancelInvite(
      { email: member.email },
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
          <DialogTitle>Cancel invite</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel the invite for{' '}
            <span className="font-medium text-foreground">{member?.email}</span>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Keep invite
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={isPending}>
            {isPending ? 'Cancelling...' : 'Cancel invite'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
