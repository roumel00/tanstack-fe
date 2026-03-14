import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import { UploadToken } from '../get-upload-tokens'
import { UploadFilesToS3Response } from './types'

export async function uploadFilesToS3(
  files: File[],
  tokens: UploadToken[]
  ): Promise<UploadFilesToS3Response> {
  if (tokens.length !== files.length) {
    throw new Error(`Token count (${tokens.length}) does not match file count (${files.length})`)
  }

  const uploadPromises = files.map(async (file, index) => {
    const tokenData = tokens[index]

    const uploadResponse = await axios.put(tokenData.token, file, {
      headers: {
        'Content-Type': file.type,
      },
    })

    if (uploadResponse.status !== 200) {
      throw new Error(`Failed to upload file ${file.name} to S3: ${uploadResponse.statusText}`)
    }

    return {
      urlPath: tokenData.urlPath,
      filename: tokenData.filename,
    }
  })

  const results = await Promise.all(uploadPromises)

  return { results }
}

export function useUploadFilesToS3() {
  return useMutation({
    mutationFn: ({ files, tokens }: { files: File[]; tokens: UploadToken[] }) =>
      uploadFilesToS3(files, tokens),
  })
}
