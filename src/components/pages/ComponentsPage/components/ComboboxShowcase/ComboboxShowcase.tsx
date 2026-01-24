import * as React from 'react'
import { Combobox } from '@/components/ui/combobox'

const frameworks = [
  { value: 'next.js', label: 'Next.js' },
  { value: 'sveltekit', label: 'SvelteKit' },
  { value: 'nuxt', label: 'Nuxt' },
  { value: 'remix', label: 'Remix' },
  { value: 'astro', label: 'Astro' },
]

export function ComboboxShowcase() {
  const [value, setValue] = React.useState<string>('')

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Combobox
        options={frameworks}
        value={value}
        onValueChange={setValue}
        placeholder="Select framework..."
        searchPlaceholder="Search framework..."
      />
    </div>
  )
}
