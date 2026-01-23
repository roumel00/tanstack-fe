export type GetImageUploadTokenRequest = {
  mimetype: string
  fileType: 'avatar' | 'logo'
}

export type GetImageUploadTokenResponse = {
  token: string
  filename: string
  urlPath: string
}

export type UploadFileToS3Result = {
  urlPath: string
  filename: string
}
