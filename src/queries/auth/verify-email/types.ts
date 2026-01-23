export type VerifyEmailRequest = {
  otp: string
}

export type VerifyEmailResponse = {
  message?: string
  success?: boolean
  verified?: boolean
}
