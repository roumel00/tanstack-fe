import { useMutation } from '@tanstack/react-query'
import { post } from '@/lib/api'
import { GetImageUploadTokensRequest, GetImageUploadTokensResponse } from './types'

/**
 * Gets presigned URLs for uploading images to S3
 * POST /media/image-upload-tokens
 */
export async function getImageUploadTokens(
  data: GetImageUploadTokensRequest
): Promise<GetImageUploadTokensResponse> {
  return post<GetImageUploadTokensResponse>('/media/image-upload-tokens', data)
}

/**
 * Mutation hook to get image upload tokens
 */
export function useGetImageUploadTokens() {
  return useMutation({
    mutationFn: getImageUploadTokens,
  })
}
