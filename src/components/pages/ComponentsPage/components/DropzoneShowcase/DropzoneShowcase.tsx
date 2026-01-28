import { SingleFileDropzone, MultiFileDropzone } from './components'

export function DropzoneShowcase() {
  return (
    <div className="flex flex-col gap-8">
      <SingleFileDropzone />
      <MultiFileDropzone />
    </div>
  )
}
