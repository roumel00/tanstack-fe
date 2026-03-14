export type InitiateMultipartUploadRequest = {
  mimetype: string
  fileSize: number
  fileType: 'avatar' | 'logo' | 'general' | 'video'
  orgId?: string
}

export type PresignedPart = {
  partNumber: number
  url: string
}

export type InitiateMultipartUploadResponse = {
  uploadId: string
  key: string
  parts: PresignedPart[]
}
