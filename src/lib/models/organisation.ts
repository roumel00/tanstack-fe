export type Organisation = {
  _id: string
  owner: string
  name: string
  timezone: string
  address: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  } | null
  phone: string | null
  website: string | null
  billingEmail: string | null
  logo: string | null
  createdAt: Date
  updatedAt: Date
}
