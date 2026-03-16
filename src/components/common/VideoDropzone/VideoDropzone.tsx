import * as React from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Video, FileWarning } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useMultipartUpload } from '@/queries/media'
import { useGetCurrentWorkspace} from '@/queries/workspace/get-current-workspace'

const MAX_VIDEO_SIZE = 500 * 1024 * 1024 // 500 MB
const ACCEPTED_VIDEO_TYPES = {
  'video/mp4': ['.mp4'],
  'video/quicktime': ['.mov'],
  'video/webm': ['.webm'],
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export function VideoDropzone() {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
  const [posterUrl, setPosterUrl] = React.useState<string | null>(null)
  const { upload, abort, reset, progress, status, isUploading, isSuccess, isError, error } =
    useMultipartUpload()
  const { data: currentWorkspaceData } = useGetCurrentWorkspace()
  const workspaceId = currentWorkspaceData?.currentWorkspace?.workspace._id

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      // Clean up previous preview
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }

      const blobUrl = URL.createObjectURL(file)
      setSelectedFile(file)
      setPreviewUrl(blobUrl)
      setPosterUrl(null)
      reset()

      // Capture a poster frame from the video
      const video = document.createElement('video')
      video.preload = 'metadata'
      video.muted = true
      video.playsInline = true
      video.src = blobUrl
      video.currentTime = 0.1
      video.addEventListener('seeked', () => {
        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        canvas.getContext('2d')?.drawImage(video, 0, 0)
        setPosterUrl(canvas.toDataURL('image/jpeg', 0.8))
      }, { once: true })
    },
    [previewUrl, reset]
  )

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: ACCEPTED_VIDEO_TYPES,
    maxSize: MAX_VIDEO_SIZE,
    maxFiles: 1,
    disabled: isUploading,
  })

  const handleUpload = async () => {
    if (!selectedFile || !workspaceId) return

    try {
      await upload({
        file: selectedFile,
        fileType: 'video',
        workspaceId,
      })
      toast.success('Video uploaded successfully')
    } catch {
      toast.error('Video upload failed')
    }
  }

  const handleCancel = async () => {
    await abort()
    toast.info('Upload cancelled')
  }

  const handleRemove = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setSelectedFile(null)
    setPreviewUrl(null)
    setPosterUrl(null)
    reset()
  }

  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  return (
    <div className="w-full max-w-md">
      <h3 className="text-sm font-medium mb-2 text-muted-foreground">
        Video upload (multipart)
      </h3>

      {/* Dropzone area */}
      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed rounded-lg cursor-pointer transition-colors p-8 text-center',
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-muted-foreground/50',
            fileRejections.length > 0 && 'border-destructive'
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <div className="text-sm">
              <span className="font-medium text-foreground">
                {isDragActive
                  ? 'Drop video here'
                  : 'Drag and drop or click to select a video'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              MP4, MOV, or WebM up to {formatBytes(MAX_VIDEO_SIZE)}
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          {/* Video preview */}
          <div className="relative aspect-video bg-muted">
            {previewUrl && isSuccess ? (
              <video
                src={previewUrl}
                className="w-full h-full object-contain"
                controls
                muted
              />
            ) : posterUrl ? (
              <img
                src={posterUrl}
                className="w-full h-full object-contain"
                alt="Video thumbnail"
              />
            ) : previewUrl ? (
              <video
                src={previewUrl}
                className="w-full h-full object-contain"
                muted
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Video className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
            {!isUploading && (
              <Button
                variant="outline"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 bg-background/80 backdrop-blur-sm"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* File info + progress */}
          <div className="p-3 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium truncate mr-2">{selectedFile.name}</span>
              <span className="text-muted-foreground whitespace-nowrap">
                {formatBytes(selectedFile.size)}
              </span>
            </div>

            {/* Progress bar */}
            {(isUploading || isSuccess) && (
              <div className="space-y-1">
                <Progress value={progress.percentage} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {formatBytes(progress.loaded)} / {formatBytes(progress.total)}
                  </span>
                  <span>{progress.percentage}%</span>
                </div>
              </div>
            )}

            {/* Status messages */}
            {status === 'completing' && (
              <p className="text-xs text-muted-foreground">Finalizing upload...</p>
            )}
            {isSuccess && (
              <p className="text-xs text-green-600">Upload complete</p>
            )}
            {isError && (
              <div className="flex items-center gap-1 text-xs text-destructive">
                <FileWarning className="h-3 w-3" />
                <span>{error?.message || 'Upload failed'}</span>
              </div>
            )}
            {status === 'aborted' && (
              <p className="text-xs text-muted-foreground">Upload cancelled</p>
            )}
          </div>
        </div>
      )}

      {/* File rejection errors */}
      {fileRejections.length > 0 && (
        <div className="mt-2 text-sm text-destructive">
          {fileRejections.map(({ errors }) =>
            errors.map((e) => (
              <div key={e.code}>
                {e.code === 'file-too-large' &&
                  `File is too large (max ${formatBytes(MAX_VIDEO_SIZE)})`}
                {e.code === 'file-invalid-type' && 'Invalid file type'}
              </div>
            ))
          )}
        </div>
      )}

      {/* Action buttons */}
      {selectedFile && (
        <div className="flex justify-end gap-2 mt-4">
          {isUploading ? (
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          ) : isSuccess ? (
            <Button variant="outline" onClick={handleRemove}>
              Upload another
            </Button>
          ) : (
            <Button onClick={handleUpload} disabled={!selectedFile || !workspaceId}>
              Upload video
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
