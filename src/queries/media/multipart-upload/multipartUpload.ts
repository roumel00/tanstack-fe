import { useState, useCallback, useRef } from 'react'
import axios from 'axios'
import { initiateMultipartUpload } from '../initiate-multipart-upload'
import { completeMultipartUpload } from '../complete-multipart-upload'
import { abortMultipartUpload } from '../abort-multipart-upload'
import type { CompletedPart } from '../complete-multipart-upload'
import type {
  MultipartUploadRequest,
  MultipartUploadResponse,
  MultipartUploadProgress,
} from './types'

const PART_SIZE = 10 * 1024 * 1024 // 10 MB
const MAX_CONCURRENT = 4
const MAX_RETRIES = 3

type UploadStatus = 'idle' | 'uploading' | 'completing' | 'success' | 'error' | 'aborted'

async function uploadPartWithRetry(
  url: string,
  blob: Blob,
  onProgress: (loaded: number) => void,
  abortSignal: AbortSignal,
): Promise<string> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await axios.put(url, blob, {
        headers: { 'Content-Type': 'application/octet-stream' },
        signal: abortSignal,
        onUploadProgress: (event) => {
          if (event.loaded) {
            onProgress(event.loaded)
          }
        },
      })

      const etag = response.headers['etag']
      if (!etag) {
        throw new Error('Missing ETag in response')
      }

      return etag
    } catch (error) {
      if (axios.isCancel(error)) {
        throw error
      }
      lastError = error instanceof Error ? error : new Error(String(error))
    }
  }

  throw lastError ?? new Error('Upload failed after retries')
}

export function useMultipartUpload() {
  const [progress, setProgress] = useState<MultipartUploadProgress>({
    loaded: 0,
    total: 0,
    percentage: 0,
  })
  const [status, setStatus] = useState<UploadStatus>('idle')
  const [error, setError] = useState<Error | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const uploadInfoRef = useRef<{ uploadId: string; key: string } | null>(null)

  const abort = useCallback(async () => {
    abortControllerRef.current?.abort()

    if (uploadInfoRef.current) {
      try {
        await abortMultipartUpload(uploadInfoRef.current)
      } catch {
        // Best-effort cleanup
      }
      uploadInfoRef.current = null
    }

    setStatus('aborted')
  }, [])

  const reset = useCallback(() => {
    setStatus('idle')
    setError(null)
    setProgress({ loaded: 0, total: 0, percentage: 0 })
    uploadInfoRef.current = null
  }, [])

  const upload = useCallback(
    async (request: MultipartUploadRequest): Promise<MultipartUploadResponse> => {
      const { file, fileType, workspaceId } = request

      setStatus('uploading')
      setError(null)
      setProgress({ loaded: 0, total: file.size, percentage: 0 })

      const abortController = new AbortController()
      abortControllerRef.current = abortController

      try {
        // 1. Initiate multipart upload
        const { uploadId, key, parts } = await initiateMultipartUpload({
          mimetype: file.type,
          fileSize: file.size,
          fileType,
          workspaceId,
        })

        uploadInfoRef.current = { uploadId, key }

        // 2. Upload parts with concurrency control
        const partProgress = new Map<number, number>()
        const completedParts: CompletedPart[] = []

        const updateProgress = () => {
          let loaded = 0
          for (const bytes of partProgress.values()) {
            loaded += bytes
          }
          const percentage = Math.round((loaded / file.size) * 100)
          setProgress({ loaded, total: file.size, percentage })
        }

        // Process parts with concurrency limit
        let partIndex = 0
        const uploadNext = async (): Promise<void> => {
          while (partIndex < parts.length) {
            const currentIndex = partIndex++
            const part = parts[currentIndex]
            const start = (part.partNumber - 1) * PART_SIZE
            const end = Math.min(start + PART_SIZE, file.size)
            const blob = file.slice(start, end)

            const etag = await uploadPartWithRetry(
              part.url,
              blob,
              (loaded) => {
                partProgress.set(part.partNumber, loaded)
                updateProgress()
              },
              abortController.signal,
            )

            // Mark part as fully uploaded
            partProgress.set(part.partNumber, end - start)
            updateProgress()

            completedParts.push({
              partNumber: part.partNumber,
              etag,
            })
          }
        }

        const workers = Array.from(
          { length: Math.min(MAX_CONCURRENT, parts.length) },
          () => uploadNext(),
        )

        await Promise.all(workers)

        // 3. Complete multipart upload
        setStatus('completing')

        const result = await completeMultipartUpload({
          uploadId,
          key,
          parts: completedParts,
        })

        uploadInfoRef.current = null
        setStatus('success')
        setProgress({ loaded: file.size, total: file.size, percentage: 100 })

        return result
      } catch (err) {
        if (axios.isCancel(err)) {
          setStatus('aborted')
          throw err
        }

        const uploadError = err instanceof Error ? err : new Error(String(err))
        setError(uploadError)
        setStatus('error')

        // Abort the S3 multipart upload on failure
        if (uploadInfoRef.current) {
          try {
            await abortMultipartUpload(uploadInfoRef.current)
          } catch {
            // Best-effort cleanup
          }
          uploadInfoRef.current = null
        }

        throw uploadError
      }
    },
    [],
  )

  return {
    upload,
    abort,
    reset,
    progress,
    status,
    error,
    isUploading: status === 'uploading' || status === 'completing',
    isSuccess: status === 'success',
    isError: status === 'error',
    isAborted: status === 'aborted',
  }
}
