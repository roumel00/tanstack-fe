import { type ReactNode, useRef, useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'

export interface PageHeaderTab {
  label: string
  value: string
  title: string
  description: string
}

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
  tabs?: PageHeaderTab[]
  activeTab?: string
  onTabChange?: (value: string) => void
}

export function PageHeader({
  title,
  description,
  actions,
  tabs,
  activeTab,
  onTabChange,
}: PageHeaderProps) {
  const activeTabData = tabs?.find((t) => t.value === activeTab)
  const activeTitle = activeTabData?.title ?? activeTabData?.label ?? title
  const activeDescription = activeTabData?.description ?? description
  const tabsRef = useRef<Map<string, HTMLButtonElement>>(new Map())
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })

  const updateIndicator = useCallback(() => {
    if (!activeTab) return
    const el = tabsRef.current.get(activeTab)
    if (el) {
      const parent = el.parentElement
      if (parent) {
        setIndicator({
          left: el.offsetLeft - parent.offsetLeft,
          width: el.offsetWidth,
        })
      }
    }
  }, [activeTab])

  useEffect(() => {
    updateIndicator()
  }, [updateIndicator])

  return (
    <div className="space-y-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">{activeTitle}</h1>
          {activeDescription && (
            <p className="my-2 text-sm text-muted-foreground">
              {activeDescription}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      {tabs && tabs.length > 0 && (
        <div className="relative mt-4 border-b border-border">
          <nav className="flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                ref={(el) => {
                  if (el) tabsRef.current.set(tab.value, el)
                  else tabsRef.current.delete(tab.value)
                }}
                onClick={() => onTabChange?.(tab.value)}
                className={cn(
                  'inline-flex items-center gap-2 px-1 pb-3 text-sm font-medium transition-colors cursor-pointer',
                  activeTab === tab.value
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
          <span
            className="absolute bottom-0 h-0.5 bg-primary transition-all duration-300 ease-in-out"
            style={{ left: indicator.left, width: indicator.width }}
          />
        </div>
      )}
    </div>
  )
}
