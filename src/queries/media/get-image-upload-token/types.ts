export type GetImageUploadTokenRequest = {
  mimetype: string
  fileType: 'avatar' | 'logo'
}

export type GetImageUploadTokenResponse = {
  token: string
  filename: string
  urlPath: string
}
