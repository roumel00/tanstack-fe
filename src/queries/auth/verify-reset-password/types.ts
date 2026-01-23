export type VerifyResetPasswordRequest = {
  email: string
  otp: string
}

export type VerifyResetPasswordResponse = {
  message?: string
  success?: boolean
  valid?: boolean
}
