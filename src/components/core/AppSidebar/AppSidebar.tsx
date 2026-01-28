import { Link, useLocation } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { useGetCurrentOrg } from '@/queries'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: null, // Can add icons later if needed
  },
  {
    name: 'Components',
    href: '/components',
    icon: null, // Can add icons later if needed
  },
]

export function AppSidebar() {
  const location = useLocation()
  const { data: currentOrg } = useGetCurrentOrg()

  return (
    <div className="flex h-screen w-64 flex-col border-r border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <div className="flex h-16 items-center px-6">
        <h1 className="text-xl font-semibold">FlowBod</h1>
      </div>
      
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-neutral-100 dark:bg-neutral-800 text-primary'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-neutral-100'
              )}
            >
              {item.name}
            </Link>
          )
        })}
      </nav>

      {currentOrg?.currentOrg && (
        <div className="border-t border-neutral-100 dark:border-neutral-800 p-4">
          <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
            Current Organisation
          </div>
          <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
            {currentOrg.currentOrg.organisation.name}
          </div>
        </div>
      )}
    </div>
  )
}
