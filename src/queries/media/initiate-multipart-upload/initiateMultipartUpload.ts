import { useMutation } from '@tanstack/react-query'
import { post } from '@/lib/api'
import type {
  InitiateMultipartUploadRequest,
  InitiateMultipartUploadResponse,
} from './types'

export async function initiateMultipartUpload(
  data: InitiateMultipartUploadRequest
): Promise<InitiateMultipartUploadResponse> {
  return post<InitiateMultipartUploadResponse>('/media/multipart/initiate', data)
}

export function useInitiateMultipartUpload() {
  return useMutation({
    mutationFn: initiateMultipartUpload,
  })
}
