export type FileUploadRequest = {
  mimetype: string
}

export type GetUploadTokensRequest = {
  files: FileUploadRequest[]
  fileType: 'avatar' | 'logo' | 'general'
  orgId?: string
}

export type UploadToken = {
  token: string
  filename: string
  urlPath: string
}

export type GetUploadTokensResponse = {
  tokens: UploadToken[]
}
