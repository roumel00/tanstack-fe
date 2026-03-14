import { useMutation } from '@tanstack/react-query'
import { post } from '@/lib/api'
import { GetUploadTokensRequest, GetUploadTokensResponse } from './types'

export async function getUploadTokens(
  data: GetUploadTokensRequest
): Promise<GetUploadTokensResponse> {
  return post<GetUploadTokensResponse>('/media/upload-tokens', data)
}

export function useGetUploadTokens() {
  return useMutation({
    mutationFn: getUploadTokens,
  })
}
