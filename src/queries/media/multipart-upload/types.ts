export type MultipartUploadRequest = {
  file: File
  fileType: 'avatar' | 'logo' | 'general' | 'video'
  orgId?: string
}

export type MultipartUploadResponse = {
  urlPath: string
}

export type MultipartUploadProgress = {
  loaded: number
  total: number
  percentage: number
}
