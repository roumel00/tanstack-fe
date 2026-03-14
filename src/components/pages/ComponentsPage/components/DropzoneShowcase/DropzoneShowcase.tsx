import { SingleFileDropzone, MultiFileDropzone } from './components'
import { VideoDropzone } from '@/components/common'

export function DropzoneShowcase() {
  return (
    <div className="flex flex-col gap-8">
      <SingleFileDropzone />
      <MultiFileDropzone />
      <VideoDropzone />
    </div>
  )
}
