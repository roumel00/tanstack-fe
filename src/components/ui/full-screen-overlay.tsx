import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function FullScreenOverlay({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="full-screen-overlay" {...props} />
}

function FullScreenOverlayTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return (
    <DialogPrimitive.Trigger
      data-slot="full-screen-overlay-trigger"
      {...props}
    />
  )
}

function FullScreenOverlayClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return (
    <DialogPrimitive.Close data-slot="full-screen-overlay-close" {...props} />
  )
}

function FullScreenOverlayContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal data-slot="full-screen-overlay-portal">
      <DialogPrimitive.Overlay
        data-slot="full-screen-overlay-backdrop"
        className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0"
      />
      <DialogPrimitive.Content
        data-slot="full-screen-overlay-content"
        className={cn(
          "fixed inset-0 z-50 flex flex-col bg-background",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
          "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
          "duration-200 outline-none",
          className
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

function FullScreenOverlayHeader({
  className,
  children,
  actions,
  ...props
}: React.ComponentProps<"div"> & {
  actions?: React.ReactNode
}) {
  return (
    <div
      data-slot="full-screen-overlay-header"
      className={cn(
        "flex items-center gap-4 px-6 py-4",
        className
      )}
      {...props}
    >
      <DialogPrimitive.Close className="rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none cursor-pointer">
        <XIcon className="size-5 mr-2" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
      <div className="flex-1">{children}</div>
      {actions && (
        <div className="flex items-center gap-2">{actions}</div>
      )}
    </div>
  )
}

function FullScreenOverlayBody({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="full-screen-overlay-body"
      className={cn("flex-1 overflow-y-auto rounded-lg bg-card p-6 mx-4", className)}
      {...props}
    />
  )
}

function FullScreenOverlayTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="full-screen-overlay-title"
      className={cn("text-lg font-semibold leading-none", className)}
      {...props}
    />
  )
}

function FullScreenOverlayDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="full-screen-overlay-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  FullScreenOverlay,
  FullScreenOverlayTrigger,
  FullScreenOverlayClose,
  FullScreenOverlayContent,
  FullScreenOverlayHeader,
  FullScreenOverlayBody,
  FullScreenOverlayTitle,
  FullScreenOverlayDescription,
}
