import { Button } from '@/components/ui/button'

export function ButtonVariations() {
  const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const

  return (
    <div className="flex flex-wrap items-center gap-4">
      {variants.map((variant) => (
        <Button key={variant} variant={variant}>
          {variant.charAt(0).toUpperCase() + variant.slice(1)}
        </Button>
      ))}
    </div>
  )
}
