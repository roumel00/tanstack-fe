import * as React from "react"
import { useDropzone, type DropzoneOptions } from "react-dropzone"
import { Upload, X } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface DropzoneProps extends Omit<DropzoneOptions, "onDrop"> {
  onDrop?: (acceptedFiles: File[]) => void
  onFilesChange?: (files: File[]) => void
  onError?: (error: Error) => void
  className?: string
  children?: React.ReactNode
  maxFiles: number
}

export function Dropzone({
  onDrop,
  onFilesChange,
  onError,
  className,
  children,
  maxFiles,
  ...dropzoneOptions
}: DropzoneProps) {
  const [files, setFiles] = React.useState<File[]>([])
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)

  const [previewUrls, setPreviewUrls] = React.useState<Map<File, string>>(new Map())

  const onDropInternal = React.useCallback(
    (acceptedFiles: File[]) => {
      let filesToProcess: File[]
      let excessFiles = 0
      
      if (maxFiles > 1) {
        // Append mode: add new files to existing ones (up to maxFiles total)
        const currentFileCount = files.length
        const availableSlots = maxFiles - currentFileCount
        
        if (availableSlots <= 0) {
          toast.error(`Maximum of ${maxFiles} file${maxFiles > 1 ? 's' : ''} allowed. Please remove some files first.`)
          return
        }
        
        const filesToAdd = acceptedFiles.slice(0, availableSlots)
        excessFiles = acceptedFiles.length - availableSlots
        
        if (excessFiles > 0) {
          toast.error(
            `Only ${availableSlots} more file${availableSlots > 1 ? 's' : ''} can be added (${maxFiles} total). ${excessFiles} file${excessFiles > 1 ? 's were' : ' was'} ignored.`
          )
        }
        
        filesToProcess = [...files, ...filesToAdd]
      } else {
        // Replace mode: replace all files (maxFiles === 1)
        filesToProcess = acceptedFiles.slice(0, maxFiles)
        excessFiles = acceptedFiles.length - maxFiles
        
        if (excessFiles > 0) {
          toast.error(
            `Only the first ${maxFiles} file${maxFiles > 1 ? 's' : ''} will be processed. ${excessFiles} file${excessFiles > 1 ? 's were' : ' was'} ignored.`
          )
        }
        
        // Cleanup old preview URLs when replacing
        setPreviewUrls((prevUrls) => {
          prevUrls.forEach((url) => {
            URL.revokeObjectURL(url)
          })
          return new Map()
        })
      }
      
      // Create preview URLs for new image files
      const newPreviewUrls = maxFiles > 1 
        ? new Map(previewUrls) // Keep existing preview URLs in append mode
        : new Map<File, string>() // Start fresh in replace mode
      
      const newFiles = maxFiles > 1 
        ? filesToProcess.slice(files.length) // Only new files in append mode
        : filesToProcess // All files in replace mode
      
      newFiles.forEach((file) => {
        if (file.type.startsWith('image/')) {
          const url = URL.createObjectURL(file)
          newPreviewUrls.set(file, url)
        }
      })
      
      setFiles(filesToProcess)
      setPreviewUrls(newPreviewUrls)
      onDrop?.(filesToProcess)
      onFilesChange?.(filesToProcess)
      
      // For single image, also set previewUrl for backward compatibility
      if (filesToProcess.length === 1 && filesToProcess[0].type.startsWith('image/')) {
        setPreviewUrl(newPreviewUrls.get(filesToProcess[0]) || null)
      } else {
        setPreviewUrl(null)
      }
    },
    [onDrop, onFilesChange, maxFiles, files, previewUrls]
  )

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      ...dropzoneOptions,
      onDrop: onDropInternal,
      onError,
    })

  const removeFile = (index: number) => {
    const fileToRemove = files[index]
    if (!fileToRemove) return
    
    // Cleanup preview URL for removed file
    const previewUrlToRemove = previewUrls.get(fileToRemove)
    if (previewUrlToRemove) {
      URL.revokeObjectURL(previewUrlToRemove)
    }
    
    const newFiles = files.filter((_, i) => i !== index)
    
    // Update preview URLs map - keep existing URLs for remaining files
    const newPreviewUrls = new Map<File, string>()
    newFiles.forEach((file) => {
      // Reuse existing preview URL if available, otherwise create new one
      if (previewUrls.has(file)) {
        newPreviewUrls.set(file, previewUrls.get(file)!)
      } else if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file)
        newPreviewUrls.set(file, url)
      }
    })
    
    setFiles(newFiles)
    setPreviewUrls(newPreviewUrls)
    onFilesChange?.(newFiles)
    
    // Update single preview URL for backward compatibility
    if (newFiles.length === 1 && newFiles[0].type.startsWith('image/')) {
      setPreviewUrl(newPreviewUrls.get(newFiles[0]) || null)
    } else {
      setPreviewUrl(null)
    }
  }

  // Cleanup preview URLs on unmount
  React.useEffect(() => {
    return () => {
      previewUrls.forEach((url) => {
        URL.revokeObjectURL(url)
      })
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrls, previewUrl])

  const hasSingleImagePreview = maxFiles === 1 && files.length === 1 && files[0].type.startsWith('image/') && previewUrl

  return (
    <div className={cn("w-full", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg cursor-pointer transition-colors relative overflow-hidden",
          hasSingleImagePreview ? "p-0 aspect-video" : "p-8 text-center",
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50",
          fileRejections.length > 0 && "border-destructive"
        )}
      >
        <input {...getInputProps()} />
        {hasSingleImagePreview ? (
          <div className="relative w-full h-full">
            <div className="relative w-full h-full group">
              <img
                src={previewUrl}
                alt={files[0].name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center pointer-events-none">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm font-medium pointer-events-none">
                  {isDragActive ? "Drop to replace" : "Click or drag to replace"}
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 bg-background/80 backdrop-blur-sm z-10"
              onClick={(e) => {
                e.stopPropagation()
                removeFile(0)
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          children || (
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <div className="text-sm">
                <span className="font-medium text-foreground">
                  {isDragActive
                    ? `Drop up to ${maxFiles} files here`
                    : `Drag and drop or click to upload up to ${maxFiles} files`}
                </span>
              </div>
              {dropzoneOptions.accept && (
                <p className="text-xs text-muted-foreground">
                  Accepts {Object.keys(dropzoneOptions.accept).join(", ")}
                </p>
              )}
              {dropzoneOptions.maxSize && (
                <p className="text-xs text-muted-foreground">
                  Max size: {(dropzoneOptions.maxSize / 1024 / 1024).toFixed(2)}MB
                </p>
              )}
            </div>
          )
        )}
      </div>
      {fileRejections.length > 0 && (
        <div className="mt-2 text-sm text-destructive">
          {fileRejections.map(({ errors }) =>
            errors.map((e) => (
              <div key={e.code}>
                {e.code === "file-too-large" && "File is too large"}
                {e.code === "file-too-small" && "File is too small"}
                {e.code === "too-many-files" && "Too many files"}
                {e.code === "file-invalid-type" && "Invalid file type"}
              </div>
            ))
          )}
        </div>
      )}
      {files.length > 0 && !hasSingleImagePreview && (
        <div className="mt-4 grid grid-cols-6 gap-2">
          {files.map((file, index) => {
            const previewUrl = previewUrls.get(file)
            const isImage = file.type.startsWith('image/')
            
            return (
              <div
                key={`${file.name}-${file.size}-${file.lastModified}`}
                className="relative aspect-square rounded-lg overflow-hidden border border-border bg-muted/50"
              >
                {isImage && previewUrl ? (
                  <>
                    <img
                      src={previewUrl}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 bg-background/80 backdrop-blur-sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFile(index)
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-2">
                    <span className="text-xs text-muted-foreground truncate text-center">
                      {file.name}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 bg-background/80 backdrop-blur-sm mt-2"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFile(index)
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
