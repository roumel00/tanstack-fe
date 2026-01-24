import * as React from 'react'
import { Dropzone } from '@/components/ui/dropzone'
import { Button } from '@/components/ui/button'
import { useUploadFilesToS3 } from '@/queries/media/upload-file-to-s3'
import { useGetImageUploadTokens, ImageUploadToken } from '@/queries/media/get-image-upload-tokens'

export function DropzoneShowcase() {
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([])
  const [tokensData, setTokensData] = React.useState<ImageUploadToken[] | null>(null)
  const [dropzoneKey, setDropzoneKey] = React.useState(0)
  const prevFilesRef = React.useRef<File[]>([])
  const { mutate: uploadFiles, isPending: isUploading } = useUploadFilesToS3()
  const { mutate: getTokens } = useGetImageUploadTokens()

  const handleFilesChange = (files: File[]) => {
    const prevFiles = prevFilesRef.current
    const filesAdded = files.length > prevFiles.length
    const filesRemoved = files.length < prevFiles.length
    
    setSelectedFiles(files)
    
    if (files.length === 0) {
      // No files remaining, clear tokens
      setTokensData(null)
      prevFilesRef.current = files
      return
    }
    
    if (filesAdded) {
      // New files were added, fetch tokens for all files
      prevFilesRef.current = files
      getTokens(
        {
          files: files.map(f => ({ mimetype: f.type })),
          fileType: 'logo',
        },
        {
          onSuccess: (result) => {
            setTokensData(result.tokens)
          },
        }
      )
    } else if (filesRemoved && tokensData) {
      // Files were removed, filter tokens to match remaining files
      // Match files by reference to find corresponding tokens
      const remainingTokens = files
        .map(file => {
          const prevIndex = prevFiles.findIndex(prevFile => prevFile === file)
          return prevIndex !== -1 ? tokensData[prevIndex] : null
        })
        .filter((token): token is ImageUploadToken => token !== null)
      
      // Only update if we successfully matched all files
      if (remainingTokens.length === files.length) {
        setTokensData(remainingTokens)
      } else {
        // Fallback: fetch new tokens if matching failed
        prevFilesRef.current = files
        getTokens(
          {
            files: files.map(f => ({ mimetype: f.type })),
            fileType: 'logo',
          },
          {
            onSuccess: (result) => {
              setTokensData(result.tokens)
            },
          }
        )
      }
      prevFilesRef.current = files
    } else {
      // Files count unchanged but might be replaced, update ref
      prevFilesRef.current = files
    }
  }

  const handleUpload = () => {
    if (selectedFiles.length > 0 && tokensData && tokensData.length === selectedFiles.length) {
      uploadFiles(
        { files: selectedFiles, fileType: 'logo', tokensData },
        {
          onSuccess: () => {
            // Reset dropzone
            setSelectedFiles([])
            setTokensData(null)
            setDropzoneKey((prev) => prev + 1)
          },
        }
      )
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full max-w-md">
        <Dropzone
          key={dropzoneKey}
          accept={{
            'image/*': ['.png', '.jpg', '.jpeg'],
          }}
          maxSize={10 * 1024 * 1024}
          maxFiles={6}
          onFilesChange={handleFilesChange}
        />
        <div className="flex justify-end mt-4">
          <Button onClick={handleUpload} disabled={isUploading || selectedFiles.length === 0 || !tokensData || tokensData.length !== selectedFiles.length}>
            {isUploading ? 'Uploading...' : 'Upload to S3'}
          </Button>
        </div>
      </div>
    </div>
  )
}
