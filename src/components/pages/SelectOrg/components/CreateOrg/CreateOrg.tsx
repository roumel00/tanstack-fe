import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useCreateOrg, useUploadFilesToS3, useGetLogoUploadToken } from '@/queries'
import type { GetLogoUploadTokenResponse } from '@/queries'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dropzone } from '@/components/ui/dropzone'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type CreateOrgFormData = {
  name: string
}

type CreateOrgProps = {
  onOrgCreated: (orgId: string) => void
}

export function CreateOrg({ onOrgCreated }: CreateOrgProps) {
  const [browserTimezone, setBrowserTimezone] = useState<string>('UTC')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoToken, setLogoToken] = useState<GetLogoUploadTokenResponse | null>(null)

  useEffect(() => {
    setBrowserTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)
  }, [])

  const { mutate: getLogoToken } = useGetLogoUploadToken()
  const { mutateAsync: uploadFiles, isPending: isUploading } = useUploadFilesToS3()

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

    // Upload logo if selected
    if (logoFile && logoToken) {
      const { results } = await uploadFiles({ files: [logoFile], tokens: [logoToken] })
      payload.logo = results[0].urlPath
    }

    createOrg(payload, {
      onSuccess: (createdOrg) => {
        onOrgCreated(createdOrg._id)
      },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Create Organisation</CardTitle>
          <CardDescription>
            Enter your organisation information to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
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

                    getLogoToken(
                      { mimetype: file.type },
                      { onSuccess: (token) => setLogoToken(token) }
                    )
                  }}
                />
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
        </CardContent>
      </Card>
    </div>
  )
}
