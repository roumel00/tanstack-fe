import { useMutation } from '@tanstack/react-query'
import { post } from '@/lib/api'
import type {
  AbortMultipartUploadRequest,
  AbortMultipartUploadResponse,
} from './types'

export async function abortMultipartUpload(
  data: AbortMultipartUploadRequest
): Promise<AbortMultipartUploadResponse> {
  return post<AbortMultipartUploadResponse>('/media/multipart/abort', data)
}

export function useAbortMultipartUpload() {
  return useMutation({
    mutationFn: abortMultipartUpload,
  })
}
