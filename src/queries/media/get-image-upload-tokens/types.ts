export type FileUploadRequest = {
  mimetype: string
}

export type GetImageUploadTokensRequest = {
  files: FileUploadRequest[]
  fileType: 'avatar' | 'logo'
}

export type ImageUploadToken = {
  token: string
  filename: string
  urlPath: string
}

export type GetImageUploadTokensResponse = {
  tokens: ImageUploadToken[]
}
