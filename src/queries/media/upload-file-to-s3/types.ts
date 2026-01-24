export type UploadFileToS3Result = {
  urlPath: string
  filename: string
}

export type UploadFilesToS3Result = {
  results: UploadFileToS3Result[]
}
