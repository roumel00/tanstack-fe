import { useNavigate } from '@tanstack/react-router'
import { PageHeader } from '@/components/common'
import { type PageHeaderTab } from '@/components/common'
import { WorkspaceSettings, TeamSettings } from './components'
import { Route } from '@/routes/_protected/_app/settings'

const tabs: PageHeaderTab[] = [
  {
    label: 'Workspace Settings',
    value: 'workspace-settings',
    title: 'Workspace Settings',
    description: 'Manage your workspace preferences and members',
  },
  {
    label: 'Team Settings',
    value: 'team-settings',
    title: 'Team Settings',
    description: 'Manage your team members and permissions',
  },
]

export function Settings() {
  const { tab } = Route.useSearch()
  const navigate = useNavigate({ from: '/settings' })

  const handleTabChange = (value: string) => {
    navigate({ search: { tab: value } })
  }

  return (
    <div className="p-8">
      <PageHeader
        title="Settings"
        tabs={tabs}
        activeTab={tab}
        onTabChange={handleTabChange}
      />

      <div className="mt-6">
        {tab === 'workspace-settings' &&
          <WorkspaceSettings />
        }
        {tab === 'team-settings' &&
          <TeamSettings />
        }
      </div>
    </div>
  )
}
