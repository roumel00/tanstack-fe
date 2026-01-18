import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useUserOrganisations, useSwitchOrganisation } from '@/queries'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CreateOrg } from './components'

export function SelectOrg() {
  const { data: organisations, isLoading, error } = useUserOrganisations()
  const { mutate: switchOrg, isPending } = useSwitchOrganisation()
  const navigate = useNavigate()
  const [showCreateOrg, setShowCreateOrg] = useState(false)

  // Check if user has any organizations they created (role === 'owner')
  const hasOwnedOrgs = organisations?.some((org) => org.role === 'owner') ?? false

  const handleSwitchOrg = (orgId: string) => {
    switchOrg(
      { orgId },
      {
        onSuccess: () => {
          navigate({ to: '/dashboard' })
        },
      }
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading organisations...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-destructive">Error loading organisations</div>
      </div>
    )
  }

  if (!organisations || organisations.length === 0 || showCreateOrg) {
    return <CreateOrg onOrgCreated={handleSwitchOrg} />
  }

  return (
    <div className="min-h-screen p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Select Organisation</h1>
        {!hasOwnedOrgs && (
          <Button onClick={() => setShowCreateOrg(true)}>
            Create Organisation
          </Button>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {organisations.map((org) => (
          <Card
            key={org.orgId}
            onClick={() => !isPending && handleSwitchOrg(org.orgId)}
            className={`hover:shadow-lg transition-shadow ${
              isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
            aria-disabled={isPending}
          >
            <CardHeader>
              <CardTitle className="text-xl">{org.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-1">Role: {org.role}</p>
              <p className="text-sm text-muted-foreground">Timezone: {org.timezone}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
