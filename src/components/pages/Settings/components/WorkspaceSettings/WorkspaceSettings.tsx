import { Upload } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { getStorageUrl } from '@/lib/utils'
import { useGetCurrentOrg } from '@/queries/organisation/get-current-org'
import { useGetOrgDetails, getOrgDetailsQueryOptions } from '@/queries/organisation/get-org-details'
import { getCurrentOrgQueryOptions } from '@/queries/organisation/get-current-org'
import { useUpdateOrgDetails } from '@/queries/organisation/update-org-details'
import type { UpdateOrgDetailsRequest } from '@/queries/organisation/update-org-details'
import { useGetUploadTokens, type UploadToken } from '@/queries/media/get-upload-tokens'
import { useUploadFilesToS3 } from '@/queries'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
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
import { Skeleton } from '@/components/ui/skeleton'

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
  const { data: currentOrgData, isLoading: isLoadingCurrentOrg } = useGetCurrentOrg()
  const { data: orgDetails, isLoading: isLoadingOrgDetails } = useGetOrgDetails()
  const role = currentOrgData?.currentOrg?.teamMember.role
  const isOwner = role === 'owner'
  const isLoading = isLoadingCurrentOrg || isLoadingOrgDetails

  const queryClient = useQueryClient()
  const { mutate: getUploadTokens } = useGetUploadTokens()
  const { mutateAsync: uploadFiles, isPending: isUploading } = useUploadFilesToS3()
  const { mutate: updateOrgDetails, isPending: isUpdating } = useUpdateOrgDetails()

  const [name, setName] = useState('')
  const [timezone, setTimezone] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoToken, setLogoToken] = useState<UploadToken | null>(null)

  useEffect(() => {
    if (orgDetails) {
      setName(orgDetails.name)
      setTimezone(orgDetails.timezone)
    }
  }, [orgDetails])

  const timezoneOptions = useMemo(() => getTimezoneOptions(), [])

  const isSaving = isUploading || isUpdating
  const hasNameChanged = name !== (orgDetails?.name ?? '')
  const hasTimezoneChanged = timezone !== (orgDetails?.timezone ?? '')
  const hasChanges = hasNameChanged || hasTimezoneChanged || logoFile !== null

  const handleSave = async () => {
    const payload: UpdateOrgDetailsRequest = {}

    if (hasNameChanged) payload.name = name
    if (hasTimezoneChanged) payload.timezone = timezone

    if (logoFile && logoToken) {
      const { results } = await uploadFiles({ files: [logoFile], tokens: [logoToken] })
      payload.logo = results[0].urlPath
    }

    updateOrgDetails(payload, {
      onSuccess: () => {
        setLogoFile(null)
        setLogoToken(null)
        queryClient.invalidateQueries({ queryKey: getOrgDetailsQueryOptions.queryKey })
        queryClient.invalidateQueries({ queryKey: getCurrentOrgQueryOptions.queryKey })
        toast.success('Workspace details updated')
      },
    })
  }

  if (isLoading) {
    return (
      <div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64 mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-[200px] w-full" />
            </div>
          </CardContent>
          <div className="px-6">
            <Separator />
          </div>
          <CardFooter className="justify-end">
            <Skeleton className="h-10 w-32" />
          </CardFooter>
        </Card>
      </div>
    )
  }

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
              className={orgDetails?.logo ? 'w-fit' : undefined}
              onFilesChange={(files) => {
                const file = files[0] ?? null
                setLogoFile(file)

                if (!file) {
                  setLogoToken(null)
                  return
                }

                getUploadTokens(
                  { files: [{ mimetype: file.type }], fileType: 'logo' },
                  { onSuccess: (data) => setLogoToken(data.tokens[0]) }
                )
              }}
            >
              {orgDetails?.logo ? (
                <div className="-m-8 h-[200px] group flex items-center justify-center">
                  <img
                    src={getStorageUrl(orgDetails.logo)}
                    alt={orgDetails.name}
                    className="max-w-full max-h-full object-contain"
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
            disabled={!isOwner || !hasChanges || isSaving}
            onClick={handleSave}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
