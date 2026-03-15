import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Building2 } from 'lucide-react'
import { useCreateOrg, useUploadFilesToS3, useGetUploadTokens, type UploadToken } from '@/queries'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dropzone } from '@/components/ui/dropzone'
import { Label } from '@/components/ui/label'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useSwitchOrg } from '@/queries'

type CreateOrgFormData = {
  name: string
}

export function CreateOrg() {
  const [browserTimezone, setBrowserTimezone] = useState<string>('UTC')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoToken, setLogoToken] = useState<UploadToken | null>(null)

  useEffect(() => {
    setBrowserTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)
  }, [])

  const { mutate: getUploadTokens } = useGetUploadTokens()
  const { mutateAsync: uploadFiles, isPending: isUploading } = useUploadFilesToS3()
  const { mutate: switchOrg } = useSwitchOrg()

  const form = useForm<CreateOrgFormData>({
    defaultValues: {
      name: '',
    },
  })

  const { mutate: createOrg, isPending, error } = useCreateOrg()

  const onSubmit = async (data: CreateOrgFormData) => {
    const payload: Parameters<typeof createOrg>[0] = {
      name: data.name,
      timezone: browserTimezone,
    }

    if (logoFile && logoToken) {
      const { results } = await uploadFiles({ files: [logoFile], tokens: [logoToken] })
      payload.logo = results[0].urlPath
    }

    createOrg(payload, {
      onSuccess: (createdOrg) => {
        switchOrg(
          { orgId: createdOrg._id },
          { onSuccess: () => { window.location.href = '/dashboard' } }
        )
      },
    })
  }

  return (
    <div className="min-h-screen flex justify-center p-6">
      <div className="w-full max-w-3xl rounded-2xl bg-card border p-12 h-fit mt-12">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-muted shadow-md">
            <Building2 className="h-6 w-6 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-semibold">Create an organisation</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your organisation information to get started
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                rules={{ required: 'Organisation name is required' }}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Organisation Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Inc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <Label>Organisation Logo</Label>
                <Dropzone
                  maxFiles={1}
                  accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
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
                />
              </div>
            </div>

            {error && (
              <div className="text-sm text-destructive">
                {error instanceof Error ? error.message : 'An error occurred'}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isPending || isUploading}>
              {isUploading ? 'Uploading logo...' : isPending ? 'Creating organisation...' : 'Create Organisation'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
