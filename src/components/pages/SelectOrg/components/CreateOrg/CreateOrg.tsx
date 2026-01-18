import { useForm } from 'react-hook-form'
import { useCreateOrganisation } from '@/queries'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  timezone: string
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

// Common timezones for the select dropdown
const TIMEZONES = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'America/New_York (EST/EDT)' },
  { value: 'America/Chicago', label: 'America/Chicago (CST/CDT)' },
  { value: 'America/Denver', label: 'America/Denver (MST/MDT)' },
  { value: 'America/Los_Angeles', label: 'America/Los_Angeles (PST/PDT)' },
  { value: 'Europe/London', label: 'Europe/London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Europe/Paris (CET/CEST)' },
  { value: 'Asia/Tokyo', label: 'Asia/Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Asia/Shanghai (CST)' },
  { value: 'Australia/Sydney', label: 'Australia/Sydney (AEDT/AEST)' },
]

type CreateOrgProps = {
  onOrgCreated: (orgId: string) => void
}

export function CreateOrg({ onOrgCreated }: CreateOrgProps) {
  const form = useForm<CreateOrgFormData>({
    defaultValues: {
      name: '',
      timezone: 'UTC',
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

  const { mutate: createOrg, isPending, error } = useCreateOrganisation()

  const onSubmit = async (data: CreateOrgFormData) => {
    // Prepare the request payload, omitting empty optional fields
    const payload: Parameters<typeof createOrg>[0] = {
      name: data.name,
      timezone: data.timezone,
    }

    if (data.email) payload.email = data.email
    if (data.phone) payload.phone = data.phone
    if (data.website) payload.website = data.website

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
                    <FormItem>
                      <FormLabel>Organisation Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Acme Inc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="timezone"
                  rules={{ required: 'Timezone is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Timezone *</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        >
                          {TIMEZONES.map((tz) => (
                            <option key={tz.value} value={tz.value}>
                              {tz.label}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
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

              {/* Logo Upload (Non-functional) */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Logo (Coming Soon)</h3>
                <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground">
                  <p>Logo upload functionality will be available soon</p>
                </div>
              </div>

              {error && (
                <div className="text-sm text-destructive">
                  {error instanceof Error ? error.message : 'An error occurred'}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? 'Creating organisation...' : 'Create Organisation'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
