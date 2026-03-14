export type UploadFileToS3Response = {
  urlPath: string
  filename: string
}

export type UploadFilesToS3Response = {
  results: UploadFileToS3Response[]
}
