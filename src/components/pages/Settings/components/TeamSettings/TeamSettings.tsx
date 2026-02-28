import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from '@/components/ui/avatar'
import { useGetCurrentOrg } from '@/queries/organisation/get-current-org'
import { useGetTeamOverview } from '@/queries/organisation/get-team-overview'
import { TeamDataTable } from './components'
import { getInitials } from '@/lib/utils/organisation'

function MemberAvatars({ members, total }: { members: { name: string | null; email: string }[]; total: number }) {
  const remaining = total - members.length

  return (
    <AvatarGroup>
      {members.map((member) => {
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
  const { data: currentOrgData } = useGetCurrentOrg()
  const { data: overview } = useGetTeamOverview()

  const currentRole = currentOrgData?.currentOrg?.teamMember.role
  const owner = overview?.owner
  const counts = overview?.counts ?? { admins: 0, members: 0, invitees: 0 }
  const recentAdmins = overview?.recentAdmins ?? []
  const recentMembers = overview?.recentMembers ?? []

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
              <p className="text-4xl font-semibold pr-1">{counts.admins}</p>
              <p className="text-sm text-muted-foreground">Admin{counts.admins !== 1 ? 's' : ''}</p>
            </div>
            <MemberAvatars members={recentAdmins} total={counts.admins} />
          </CardContent>
        </Card>

        <Card className="justify-center">
          <CardContent className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-semibold pr-1">{counts.members}</p>
              <p className="text-sm text-muted-foreground">Member{counts.members !== 1 ? 's' : ''}</p>
            </div>
            <MemberAvatars members={recentMembers} total={counts.members} />
          </CardContent>
        </Card>
      </div>

      <TeamDataTable currentRole={currentRole} />
    </div>
  )
}
