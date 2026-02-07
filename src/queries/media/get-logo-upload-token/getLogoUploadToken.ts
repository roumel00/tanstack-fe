import { useMutation } from '@tanstack/react-query'
import { post } from '@/lib/api'
import { GetLogoUploadTokenRequest, GetLogoUploadTokenResponse } from './types'

export async function getLogoUploadToken(
  data: GetLogoUploadTokenRequest
): Promise<GetLogoUploadTokenResponse> {
  return post<GetLogoUploadTokenResponse>('/media/logo-upload-token', data)
}

export function useGetLogoUploadToken() {
  return useMutation({
    mutationFn: getLogoUploadToken,
  })
}
