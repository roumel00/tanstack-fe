import * as React from 'react'
import { Dropzone } from '@/components/ui/dropzone'
import { Button } from '@/components/ui/button'
import { useUploadFilesToS3 } from '@/queries/media/upload-file-to-s3'
import { useGetImageUploadTokens, ImageUploadToken } from '@/queries/media/get-image-upload-tokens'

export function SingleFileDropzone() {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [tokenData, setTokenData] = React.useState<ImageUploadToken | null>(null)
  const [dropzoneKey, setDropzoneKey] = React.useState(0)
  const { mutate: uploadFiles, isPending: isUploading } = useUploadFilesToS3()
  const { mutate: getTokens } = useGetImageUploadTokens()

  const handleFilesChange = (files: File[]) => {
    const file = files[0] || null
    setSelectedFile(file)

    if (!file) {
      setTokenData(null)
      return
    }

    getTokens(
      {
        files: [{ mimetype: file.type }],
        fileType: 'logo',
      },
      {
        onSuccess: (result) => {
          setTokenData(result.tokens[0] || null)
        },
      }
    )
  }

  const handleUpload = () => {
    if (selectedFile && tokenData) {
      uploadFiles(
        { files: [selectedFile], tokens: [tokenData] },
        {
          onSuccess: () => {
            setSelectedFile(null)
            setTokenData(null)
            setDropzoneKey((prev) => prev + 1)
          },
        }
      )
    }
  }

  return (
    <div className="w-full max-w-md">
      <h3 className="text-sm font-medium mb-2 text-muted-foreground">Single file (replace mode)</h3>
      <Dropzone
        key={dropzoneKey}
        accept={{
          'image/*': ['.png', '.jpg', '.jpeg'],
        }}
        maxSize={10 * 1024 * 1024}
        maxFiles={1}
        onFilesChange={handleFilesChange}
      />
      <div className="flex justify-end mt-4">
        <Button
          onClick={handleUpload}
          disabled={isUploading || !selectedFile || !tokenData}
        >
          {isUploading ? 'Uploading...' : 'Upload to S3'}
        </Button>
      </div>
    </div>
  )
}
