import {
  ButtonVariations,
  CardShowcase,
  DropdownMenuShowcase,
  InputShowcase,
  InputOTPShowcase,
  FormShowcase,
} from './components'

export function ComponentsPage() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-lg font-semibold mb-4">Button Variations</h2>
        <ButtonVariations />
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-4">Card</h2>
        <CardShowcase />
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-4">Dropdown Menu</h2>
        <DropdownMenuShowcase />
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-4">Input with Label</h2>
        <InputShowcase />
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-4">Input OTP</h2>
        <InputOTPShowcase />
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-4">Form</h2>
        <FormShowcase />
      </div>
    </div>
  )
}
