import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  FullScreenOverlay,
  FullScreenOverlayClose,
  FullScreenOverlayContent,
  FullScreenOverlayBody,
  FullScreenOverlayDescription,
  FullScreenOverlayHeader,
  FullScreenOverlayTitle,
  FullScreenOverlayTrigger,
} from '@/components/ui/full-screen-overlay'

export function FullScreenOverlayShowcase() {
  return (
    <div className="flex flex-wrap gap-4">
      <FullScreenOverlay>
        <FullScreenOverlayTrigger asChild>
          <Button variant="outline">Open Full Screen Overlay</Button>
        </FullScreenOverlayTrigger>
        <FullScreenOverlayContent>
          <FullScreenOverlayHeader
            actions={
              <>
                <FullScreenOverlayClose asChild>
                  <Button variant="ghost">Cancel</Button>
                </FullScreenOverlayClose>
                <FullScreenOverlayClose asChild>
                  <Button>Save</Button>
                </FullScreenOverlayClose>
              </>
            }
          >
            <div className="flex flex-col gap-1">
              <FullScreenOverlayTitle>Create New Item</FullScreenOverlayTitle>
              <FullScreenOverlayDescription>
                Fill out the form below to create a new item.
              </FullScreenOverlayDescription>
            </div>
          </FullScreenOverlayHeader>
          <FullScreenOverlayBody>
            <div className="mx-auto max-w-2xl space-y-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="fso-title">Title</Label>
                <Input id="fso-title" placeholder="Enter a title..." />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="fso-description">Description</Label>
                <Input
                  id="fso-description"
                  placeholder="Enter a description..."
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="fso-category">Category</Label>
                <Input id="fso-category" placeholder="Enter a category..." />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="fso-category">Category</Label>
                <Input id="fso-category" placeholder="Enter a category..." />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="fso-category">Category</Label>
                <Input id="fso-category" placeholder="Enter a category..." />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="fso-category">Category</Label>
                <Input id="fso-category" placeholder="Enter a category..." />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="fso-category">Category</Label>
                <Input id="fso-category" placeholder="Enter a category..." />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="fso-category">Category</Label>
                <Input id="fso-category" placeholder="Enter a category..." />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="fso-category">Category</Label>
                <Input id="fso-category" placeholder="Enter a category..." />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="fso-category">Category</Label>
                <Input id="fso-category" placeholder="Enter a category..." />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="fso-category">Category</Label>
                <Input id="fso-category" placeholder="Enter a category..." />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="fso-category">Category</Label>
                <Input id="fso-category" placeholder="Enter a category..." />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="fso-category">Category</Label>
                <Input id="fso-category" placeholder="Enter a category..." />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="fso-category">Category</Label>
                <Input id="fso-category" placeholder="Enter a category..." />
              </div>
            </div>
          </FullScreenOverlayBody>
        </FullScreenOverlayContent>
      </FullScreenOverlay>

      <FullScreenOverlay>
        <FullScreenOverlayTrigger asChild>
          <Button variant="outline">Minimal (No Actions)</Button>
        </FullScreenOverlayTrigger>
        <FullScreenOverlayContent>
          <FullScreenOverlayHeader>
            <FullScreenOverlayTitle>Preview</FullScreenOverlayTitle>
          </FullScreenOverlayHeader>
          <FullScreenOverlayBody className="flex items-center justify-center">
            <p className="text-muted-foreground">
              Full screen content area without header actions.
            </p>
          </FullScreenOverlayBody>
        </FullScreenOverlayContent>
      </FullScreenOverlay>
    </div>
  )
}
