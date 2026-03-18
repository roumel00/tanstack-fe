export type VerifyEmailRequest = {
  email: string
  otp: string
}

export type VerifyEmailResponse = {
  status: boolean
  token: string | null
  user: Record<string, unknown>
}
