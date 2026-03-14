export type CompletedPart = {
  partNumber: number
  etag: string
}

export type CompleteMultipartUploadRequest = {
  uploadId: string
  key: string
  parts: CompletedPart[]
}

export type CompleteMultipartUploadResponse = {
  urlPath: string
}
