import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import { getImageUploadTokens, ImageUploadToken } from '../get-image-upload-tokens'
import { UploadFilesToS3Result, UploadFileToS3Result } from './types'

/**
 * Uploads files directly to S3 using presigned URLs
 *
 * @param files - The files to upload
 * @param fileType - The type of file ('avatar' or 'logo')
 * @param tokensData - Optional array of token data (token, filename, urlPath). If not provided, will fetch new tokens.
 * @returns Promise resolving to the upload results with urlPath and filename for each file
 * @throws Error if upload fails
 */
export async function uploadFilesToS3(
  files: File[],
  fileType: 'avatar' | 'logo',
  tokensData?: ImageUploadToken[]
): Promise<UploadFilesToS3Result> {
  let tokens: ImageUploadToken[]

  if (tokensData && tokensData.length === files.length) {
    // Use provided tokens
    tokens = tokensData
  } else {
    // Get presigned URLs from backend
    const tokenResult = await getImageUploadTokens({
      files: files.map(f => ({ mimetype: f.type })),
      fileType,
    })
    tokens = tokenResult.tokens
  }

  // Upload all files in parallel
  const uploadPromises = files.map(async (file, index) => {
    const tokenData = tokens[index]
    
    const uploadResponse = await axios.put(tokenData.token, file, {
      headers: {
        'Content-Type': file.type, // Must match the mimetype sent to backend
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

/**
 * Mutation hook to upload files to S3
 */
export function useUploadFilesToS3() {
  return useMutation({
    mutationFn: ({ 
      files, 
      fileType, 
      tokensData 
    }: { 
      files: File[]
      fileType: 'avatar' | 'logo'
      tokensData?: ImageUploadToken[]
    }) =>
      uploadFilesToS3(files, fileType, tokensData),
  })
}
