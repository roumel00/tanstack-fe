import { useState } from 'react'
import { getStorageUrl } from '@/lib/utils'
import { authClient } from '@/lib/auth-client'
import { useGetUploadTokens, type UploadToken } from '@/queries/media/get-upload-tokens'
import { useUploadFilesToS3 } from '@/queries/media/upload-file-to-s3'
import { toast } from 'sonner'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Dropzone } from '@/components/ui/dropzone'
import { Upload } from 'lucide-react'

type User = {
  firstName?: string
  lastName?: string
  email: string
  name?: string
  image?: string
}

interface ProfileDrawerProps {
  user: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProfileDrawer({ user, open, onOpenChange }: ProfileDrawerProps) {
  const displayName = user.name || [user.firstName, user.lastName].filter(Boolean).join(' ') || ''
  const [name, setName] = useState(displayName)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarToken, setAvatarToken] = useState<UploadToken | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const { mutate: getUploadTokens } = useGetUploadTokens()
  const { mutateAsync: uploadFiles } = useUploadFilesToS3()

  const hasNameChanged = name !== displayName
  const hasChanges = hasNameChanged || avatarFile !== null

  const handleSave = async () => {
    if (!hasChanges) return

    setIsSaving(true)

    try {
      const updates: Record<string, string> = {}

      if (hasNameChanged) updates.name = name

      if (avatarFile && avatarToken) {
        const { results } = await uploadFiles({
          files: [avatarFile],
          tokens: [avatarToken],
        })
        updates.image = results[0].urlPath
      }

      await authClient.updateUser(updates)

      setAvatarFile(null)
      setAvatarToken(null)
      onOpenChange(false)
      toast.success('Profile updated')
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setName(displayName)
      setAvatarFile(null)
      setAvatarToken(null)
    }
    onOpenChange(nextOpen)
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Edit Profile</SheetTitle>
          <SheetDescription>
            Update your name and profile picture
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="profile-name">Name</Label>
            <Input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div className="space-y-2">
            <Label>Profile Picture</Label>
            <Dropzone
              maxFiles={1}
              accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
              onFilesChange={(files) => {
                const file = files[0] ?? null
                setAvatarFile(file)

                if (!file) {
                  setAvatarToken(null)
                  return
                }

                getUploadTokens(
                  { files: [{ mimetype: file.type }], fileType: 'avatar' },
                  {
                    onSuccess: (data) => setAvatarToken(data.tokens[0]),
                  },
                )
              }}
            >
              {user.image ? (
                <div className="-m-8 aspect-video group">
                  <img
                    src={user.image.startsWith('http') ? user.image : getStorageUrl(user.image)}
                    alt={user.name ?? 'Profile'}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center pointer-events-none">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm font-medium">
                      Click or drag to replace
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    Drag and drop or click to upload
                  </span>
                  <p className="text-xs text-muted-foreground">
                    Accepts image/*
                  </p>
                </div>
              )}
            </Dropzone>
          </div>
        </div>
        <SheetFooter>
          <Button
            disabled={!hasChanges || isSaving}
            onClick={handleSave}
            className="w-full"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
