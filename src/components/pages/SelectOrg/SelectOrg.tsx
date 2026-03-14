import { useMemo, useState } from 'react'
import { useNavigate, Link } from '@tanstack/react-router'
import { Building2, Search } from 'lucide-react'
import { useGetOrgs, useSwitchOrg } from '@/queries'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { OrgCard } from './components'


export function SelectOrg() {
  const { data: organisations, isLoading, error } = useGetOrgs()
  const { mutate: switchOrg, isPending } = useSwitchOrg()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const hasOwnedOrgs = organisations?.some((org) => org.role === 'owner') ?? false

  const filteredOrgs = useMemo(() => {
    if (!organisations) return []
    if (!search.trim()) return organisations
    const q = search.toLowerCase()
    return organisations.filter((org) => org.name.toLowerCase().includes(q))
  }, [organisations, search])

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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-destructive">Error loading organisations</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-muted shadow-md">
            <Building2 className="h-6 w-6 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-semibold">Select an organisation</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose an organisation to continue
          </p>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search organisations..."
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
            : filteredOrgs.map((org) => (
                  <OrgCard
                    key={org.orgId}
                    name={org.name}
                    role={org.role}
                    memberCount={org.memberCount}
                    logo={org.logo}
                    isPending={isPending}
                    onClick={() => handleSwitchOrg(org.orgId)}
                  />
              ))}
        </div>

        {!hasOwnedOrgs && !isLoading && (
          <Link
            to="/create-org"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-muted-foreground/30 py-3 text-sm text-muted-foreground transition-colors hover:border-muted-foreground/50 hover:text-foreground"
          >
            + Create new organisation
          </Link>
        )}
      </div>
    </div>
  )
}
