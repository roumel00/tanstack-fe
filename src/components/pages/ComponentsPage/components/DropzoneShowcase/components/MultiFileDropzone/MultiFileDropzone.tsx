import * as React from 'react'
import { Dropzone } from '@/components/ui/dropzone'
import { Button } from '@/components/ui/button'
import { useUploadFilesToS3 } from '@/queries/media/upload-file-to-s3'
import { useGetImageUploadTokens, ImageUploadToken } from '@/queries/media/get-image-upload-tokens'

export function MultiFileDropzone() {
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
      setTokensData(null)
      prevFilesRef.current = files
      return
    }

    if (filesAdded) {
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
      const remainingTokens = files
        .map(file => {
          const prevIndex = prevFiles.findIndex(prevFile => prevFile === file)
          return prevIndex !== -1 ? tokensData[prevIndex] : null
        })
        .filter((token): token is ImageUploadToken => token !== null)

      if (remainingTokens.length === files.length) {
        setTokensData(remainingTokens)
      } else {
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
      prevFilesRef.current = files
    }
  }

  const handleUpload = () => {
    if (selectedFiles.length > 0 && tokensData && tokensData.length === selectedFiles.length) {
      uploadFiles(
        { files: selectedFiles, tokens: tokensData },
        {
          onSuccess: () => {
            setSelectedFiles([])
            setTokensData(null)
            setDropzoneKey((prev) => prev + 1)
          },
        }
      )
    }
  }

  return (
    <div className="w-full max-w-md">
      <h3 className="text-sm font-medium mb-2 text-muted-foreground">Multi-file (append mode)</h3>
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
        <Button
          onClick={handleUpload}
          disabled={isUploading || selectedFiles.length === 0 || !tokensData || tokensData.length !== selectedFiles.length}
        >
          {isUploading ? 'Uploading...' : 'Upload to S3'}
        </Button>
      </div>
    </div>
  )
}
