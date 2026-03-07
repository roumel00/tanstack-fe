import { Upload } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useGetCurrentOrg } from '@/queries/organisation/get-current-org'
import { useGetOrgDetails } from '@/queries/organisation/get-org-details'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Dropzone } from '@/components/ui/dropzone'
import { Separator } from '@/components/ui/separator'
import { Combobox, type ComboboxOption } from '@/components/ui/combobox'

function getTimezoneLabel(tz: string): string {
  try {
    const offset = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      timeZoneName: 'shortOffset',
    })
      .formatToParts(new Date())
      .find((p) => p.type === 'timeZoneName')?.value ?? ''
    return `${tz.replace(/_/g, ' ')} (${offset})`
  } catch {
    return tz
  }
}

function getTimezoneOptions(): ComboboxOption[] {
  const timezones = Intl.supportedValuesOf('timeZone')
  return timezones.map((tz) => ({
    value: tz,
    label: getTimezoneLabel(tz),
  }))
}

export function WorkspaceSettings() {
  const { data: currentOrgData } = useGetCurrentOrg()
  const { data: orgDetails } = useGetOrgDetails()
  const role = currentOrgData?.currentOrg?.teamMember.role
  const isOwner = role === 'owner'

  const [name, setName] = useState('')
  const [timezone, setTimezone] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)

  useEffect(() => {
    if (orgDetails) {
      setName(orgDetails.name)
      setTimezone(orgDetails.timezone)
    }
  }, [orgDetails])

  const timezoneOptions = useMemo(() => getTimezoneOptions(), [])

  const hasNameChanged = name !== (orgDetails?.name ?? '')
  const hasTimezoneChanged = timezone !== (orgDetails?.timezone ?? '')
  const hasChanges = hasNameChanged || hasTimezoneChanged || logoFile !== null

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Workspace Details</CardTitle>
          <CardDescription>
            Update your workspace name and logo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="workspace-name">Workspace Name</Label>
              <Input
                id="workspace-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isOwner}
                placeholder="Workspace name"
              />
            </div>
            <div className="space-y-2">
              <Label>Timezone</Label>
              <Combobox
                options={timezoneOptions}
                value={timezone}
                onValueChange={setTimezone}
                placeholder="Select timezone..."
                searchPlaceholder="Search timezones..."
                emptyText="No timezone found."
                disabled={!isOwner}
                className="w-full"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Workspace Logo</Label>
            <Dropzone
              maxFiles={1}
              accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
              disabled={!isOwner}
              onFilesChange={(files) => setLogoFile(files[0] ?? null)}
            >
              {orgDetails?.logo ? (
                <div className="-m-8 aspect-video group">
                  <img
                    src={orgDetails.logo}
                    alt={orgDetails.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center pointer-events-none">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm font-medium">
                      Click or drag to replace
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    Drag and drop or click to upload
                  </span>
                  <p className="text-xs text-muted-foreground">
                    Accepts image/*
                  </p>
                </div>
              )}
            </Dropzone>
          </div>
        </CardContent>
        <div className="px-6">
          <Separator />
        </div>
        <CardFooter className="justify-end">
          <Button
            disabled={!isOwner || !hasChanges}
            onClick={() => console.log('hello')}
          >
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
