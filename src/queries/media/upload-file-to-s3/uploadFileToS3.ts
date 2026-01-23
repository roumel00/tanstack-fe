import axios from 'axios'
import { getImageUploadToken } from '../get-image-upload-token'
import { UploadFileToS3Result } from './types'

/**
 * Uploads a file directly to S3 using a presigned URL
 *
 * @param file - The file to upload
 * @param fileType - The type of file ('avatar' or 'logo')
 * @returns Promise resolving to the upload result with urlPath and filename
 * @throws Error if upload fails
 */
export async function uploadFileToS3(
  file: File,
  fileType: 'avatar' | 'logo'
): Promise<UploadFileToS3Result> {
  // Get presigned URL from backend
  const { token, filename, urlPath } = await getImageUploadToken({
    mimetype: file.type,
    fileType,
  })

  // Upload directly to S3 using the presigned URL
  const uploadResponse = await axios.put(token, file, {
    headers: {
      'Content-Type': file.type, // Must match the mimetype sent to backend
    },
  })

  if (uploadResponse.status !== 200) {
    throw new Error(`Failed to upload file to S3: ${uploadResponse.statusText}`)
  }

  return {
    urlPath,
    filename,
  }
}
