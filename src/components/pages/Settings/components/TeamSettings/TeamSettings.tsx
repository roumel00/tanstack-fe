import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage, AvatarGroup, AvatarGroupCount } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { getStorageUrl } from '@/lib/utils'
import { useGetTeamOverview, useGetCurrentOrg } from '@/queries/organisation'
import { TeamDataTable } from './components'
import { getInitials } from '@/lib/utils/organisation'

function MemberAvatars({ members, total }: { members: { name: string | null; email: string; image?: string | null }[]; total: number }) {
  const remaining = total - members.length

  return (
    <AvatarGroup>
      {members.map((member) => {
        if (!member.name) return null
        return (
          <Avatar size="lg" key={member.email}>
            <AvatarImage src={member.image ? (member.image.startsWith('http') ? member.image : getStorageUrl(member.image)) : undefined} alt={member.name} />
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
  const { data: overview, isLoading } = useGetTeamOverview()

  const currentRole = currentOrgData?.currentOrg?.teamMember.role
  const owner = overview?.owner
  const counts = overview?.counts ?? { admins: 0, members: 0, invitees: 0 }
  const recentAdmins = overview?.recentAdmins ?? []
  const recentMembers = overview?.recentMembers ?? []

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="grid grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <Skeleton className="h-10 w-10 rounded-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          <Card>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Owner</p>
                <p className="text-lg font-semibold">{owner?.name ?? '—'}</p>
              </div>
              {owner && (
                <Avatar size="lg">
                  <AvatarImage src={owner.image ? (owner.image.startsWith('http') ? owner.image : getStorageUrl(owner.image)) : undefined} alt={owner.name ?? 'Owner'} />
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
      )}

      <TeamDataTable currentRole={currentRole} />
    </div>
  )
}
