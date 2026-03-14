import { useMutation } from '@tanstack/react-query'
import { post } from '@/lib/api'
import type {
  CompleteMultipartUploadRequest,
  CompleteMultipartUploadResponse,
} from './types'

export async function completeMultipartUpload(
  data: CompleteMultipartUploadRequest
): Promise<CompleteMultipartUploadResponse> {
  return post<CompleteMultipartUploadResponse>('/media/multipart/complete', data)
}

export function useCompleteMultipartUpload() {
  return useMutation({
    mutationFn: completeMultipartUpload,
  })
}
