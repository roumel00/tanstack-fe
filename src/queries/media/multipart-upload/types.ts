export type MultipartUploadRequest = {
  file: File
  fileType: 'avatar' | 'logo' | 'general' | 'video'
  workspaceId?: string
}

export type MultipartUploadResponse = {
  urlPath: string
}

export type MultipartUploadProgress = {
  loaded: number
  total: number
  percentage: number
}
