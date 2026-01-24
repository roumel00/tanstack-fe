import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function InputShowcase() {
  return (
    <div className="flex flex-wrap gap-6">
      <div className="space-y-2 w-[300px]">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="Enter your email" />
      </div>
      <div className="space-y-2 w-[300px]">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" placeholder="Enter your password" />
      </div>
      <div className="space-y-2 w-[300px]">
        <Label htmlFor="disabled">Disabled Input</Label>
        <Input id="disabled" disabled placeholder="Disabled input" />
      </div>
    </div>
  )
}
