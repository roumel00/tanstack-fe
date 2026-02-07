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
  email?: string
  phone?: string
  address: {
    street?: string
    city?: string
    state?: string
    postalCode?: string
    country?: string
  }
  website?: string
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
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
      },
      website: '',
    },
  })

  const { mutate: createOrg, isPending, error } = useCreateOrg()

  const onSubmit = async (data: CreateOrgFormData) => {
    // Prepare the request payload, omitting empty optional fields
    const payload: Parameters<typeof createOrg>[0] = {
      name: data.name,
      timezone: browserTimezone,
    }

    if (data.email) payload.email = data.email
    if (data.phone) payload.phone = data.phone
    if (data.website) payload.website = data.website

    // Upload logo if selected
    if (logoFile && logoToken) {
      const { results } = await uploadFiles({ files: [logoFile], tokens: [logoToken] })
      payload.logo = results[0].urlPath
    }

    // Only include address if at least one field is filled
    const hasAddressFields = Object.values(data.address || {}).some(
      (value) => value && value.trim() !== ''
    )
    if (hasAddressFields) {
      payload.address = {}
      if (data.address?.street) payload.address.street = data.address.street
      if (data.address?.city) payload.address.city = data.address.city
      if (data.address?.state) payload.address.state = data.address.state
      if (data.address?.postalCode)
        payload.address.postalCode = data.address.postalCode
      if (data.address?.country)
        payload.address.country = data.address.country
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
              {/* Required Fields */}
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

              {/* Optional Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Contact Information (Optional)</h3>
                <FormField
                  control={form.control}
                  name="email"
                  rules={{
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Billing Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="billing@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Optional Address */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Address (Optional)</h3>
                <FormField
                  control={form.control}
                  name="address.street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="address.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="New York" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address.state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State/Province</FormLabel>
                        <FormControl>
                          <Input placeholder="NY" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="address.postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input placeholder="10001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address.country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder="United States" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
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
        </CardContent>
      </Card>
    </div>
  )
}
