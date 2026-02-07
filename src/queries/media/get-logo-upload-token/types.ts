export type GetLogoUploadTokenRequest = {
  mimetype: string
}

export type GetLogoUploadTokenResponse = {
  token: string
  filename: string
  urlPath: string
}
