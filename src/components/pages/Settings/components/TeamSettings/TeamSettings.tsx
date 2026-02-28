import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from '@/components/ui/avatar'
import { useGetTeamMembers } from '@/queries/organisation/get-team-members'
import { useGetCurrentOrg } from '@/queries/organisation/get-current-org'
import { TeamDataTable } from './components'
import { getInitials } from '@/lib/utils/organisation'

function MemberAvatars({ members }: { members: { name: string | null; email: string }[] }) {
  const maxVisible = 2
  const visible = members.slice(0, maxVisible)
  const remaining = members.length - maxVisible

  return (
    <AvatarGroup>
      {visible.map((member) => {
        if (!member.name) return null
        return (
          <Avatar size="lg" key={member.email}>
            <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
          </Avatar>
        )
      })}
      {remaining > 0 && <AvatarGroupCount>+{remaining}</AvatarGroupCount>}
    </AvatarGroup>
  )
}

export function TeamSettings() {
  const { data: teamMembers = [] } = useGetTeamMembers()
  const { data: currentOrgData } = useGetCurrentOrg()

  const currentRole = currentOrgData?.currentOrg?.teamMember.role

  const owner = teamMembers.find((m) => m.role === 'owner')
  const admins = teamMembers.filter((m) => m.role === 'admin')
  const members = teamMembers.filter((m) => m.role === 'member')

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-6">
        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Owner</p>
              <p className="text-lg font-semibold">{owner?.name ?? '—'}</p>
            </div>
            {owner && (
              <Avatar size="lg">
                <AvatarFallback>{getInitials(owner.name ?? '')}</AvatarFallback>
              </Avatar>
            )}
          </CardContent>
        </Card>

        <Card className="justify-center">
          <CardContent className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-semibold pr-1">{admins.length}</p>
              <p className="text-sm text-muted-foreground">Admin{admins.length !== 1 ? 's' : ''}</p>
            </div>
            <MemberAvatars members={admins} />
          </CardContent>
        </Card>

        <Card className="justify-center">
          <CardContent className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-semibold pr-1">{members.length}</p>
              <p className="text-sm text-muted-foreground">Member{members.length !== 1 ? 's' : ''}</p>
            </div>
            <MemberAvatars members={members} />
          </CardContent>
        </Card>
      </div>

      <TeamDataTable data={teamMembers} currentRole={currentRole} />
    </div>
  )
}
