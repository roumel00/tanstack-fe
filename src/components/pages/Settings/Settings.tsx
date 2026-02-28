import { useState } from 'react'
import { PageHeader, type PageHeaderTab } from '@/components/common/PageHeader'
import { WorkspaceSettings, TeamSettings } from './components'

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
  const [activeTab, setActiveTab] = useState('workspace-settings')

  return (
    <div className="p-8">
      <PageHeader
        title="Settings"
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="mt-6">
        {activeTab === 'workspace-settings' &&
          <WorkspaceSettings />
        }
        {activeTab === 'team-settings' &&
          <TeamSettings />
        }
      </div>
    </div>
  )
}
