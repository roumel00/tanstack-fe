import { post } from '@/lib/api'
import { GetImageUploadTokenRequest, GetImageUploadTokenResponse } from './types'

/**
 * Gets a presigned URL for uploading an image to S3
 * POST /media/image-upload-token
 */
export async function getImageUploadToken(
  data: GetImageUploadTokenRequest
): Promise<GetImageUploadTokenResponse> {
  return post<GetImageUploadTokenResponse>('/media/image-upload-token', data)
}
