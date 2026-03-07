import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

export function SideDrawerShowcase() {
  return (
    <div className="flex flex-wrap gap-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Open Right</Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Edit Profile</SheetTitle>
            <SheetDescription>
              Make changes to your profile here. Click save when you're done.
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-4 px-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="John Doe" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" defaultValue="john@example.com" />
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="ghost">Cancel</Button>
            </SheetClose>
            <SheetClose asChild>
              <Button>Save Changes</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Open Left</Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Navigation</SheetTitle>
            <SheetDescription>
              Side drawer opening from the left.
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-2 px-4">
            <Button variant="ghost" className="justify-start">
              Dashboard
            </Button>
            <Button variant="ghost" className="justify-start">
              Settings
            </Button>
            <Button variant="ghost" className="justify-start">
              Profile
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Open Top</Button>
        </SheetTrigger>
        <SheetContent side="top">
          <SheetHeader>
            <SheetTitle>Notifications</SheetTitle>
            <SheetDescription>
              Side drawer opening from the top.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Open Bottom</Button>
        </SheetTrigger>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>Details</SheetTitle>
            <SheetDescription>
              Side drawer opening from the bottom.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  )
}
