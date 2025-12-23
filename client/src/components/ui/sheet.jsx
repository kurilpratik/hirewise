"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Root wrapper component for the sheet that renders a Radix Dialog Root with a data-slot attribute.
 *
 * @param {object} props - Props to apply to the underlying Radix Dialog Root (e.g., children, open, onOpenChange, and other Radix Dialog props).
 * @returns {JSX.Element} The sheet root element.
 */
function Sheet({
  ...props
}) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

/**
 * Trigger element that opens the sheet and is marked with `data-slot="sheet-trigger"`.
 *
 * Forwards all received props to the underlying trigger element.
 * @returns {JSX.Element} The sheet trigger element.
 */
function SheetTrigger({
  ...props
}) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

/**
 * Render the sheet's close control.
 *
 * Forwards provided props to the underlying Radix close primitive and sets the `data-slot="sheet-close"` attribute.
 * @param {Object} props - Props passed through to the underlying close component (e.g., event handlers, className, aria attributes).
 * @returns {import('react').ReactElement} A React element that acts as the sheet's close control.
 */
function SheetClose({
  ...props
}) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

/**
 * Renders a Radix Portal for sheet content and marks it with data-slot="sheet-portal".
 *
 * @returns {JSX.Element} The sheet portal element.
 */
function SheetPortal({
  ...props
}) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

/**
 * Render the sheet overlay element with default backdrop styling and any additional classes.
 *
 * @param {Object} props - Props forwarded to the underlying Radix Overlay.
 * @param {string} [props.className] - Additional CSS classes to merge with the overlay's default classes.
 * @returns {JSX.Element} The overlay element with `data-slot="sheet-overlay"` and composed class names.
 */
function SheetOverlay({
  className,
  ...props
}) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props} />
  );
}

/**
 * Render the sheet content container inside a portal, including the overlay, side-specific positioning/animations, and an accessible close button.
 *
 * @param {Object} props
 * @param {string} [props.className] - Additional CSS classes merged with the component's default classes.
 * @param {import('react').ReactNode} [props.children] - Content to render inside the sheet.
 * @param {'right'|'left'|'top'|'bottom'} [props.side="right"] - Side of the viewport the sheet should appear from; affects inset, border placement, and open/close animations.
 * @returns {JSX.Element} The rendered sheet content wrapped in a portal and overlay.
 */
function SheetContent({
  className,
  children,
  side = "right",
  ...props
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          side === "right" &&
            "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
          side === "left" &&
            "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
          side === "top" &&
            "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
          side === "bottom" &&
            "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
          className
        )}
        {...props}>
        {children}
        <SheetPrimitive.Close
          className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
          <XIcon className="size-4" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}

/**
 * Header container for sheet content.
 *
 * Renders a div with data-slot="sheet-header", merges the base layout classes with any
 * provided `className`, and forwards remaining props to the element.
 * @param {object} props
 * @param {string} [props.className] - Additional CSS classes to apply.
 * @returns {JSX.Element} The rendered header element for the sheet.
 */
function SheetHeader({
  className,
  ...props
}) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 p-4", className)}
      {...props} />
  );
}

/**
 * Footer container for sheet content.
 *
 * Renders a div with data-slot="sheet-footer" and default layout padding and spacing,
 * merging any provided `className`. Additional props are forwarded to the element.
 *
 * @param {string} [className] - Additional class names to merge with the default footer classes.
 * @param {object} [props] - Additional props forwarded to the footer div.
 * @returns {JSX.Element} The sheet footer element.
 */
function SheetFooter({
  className,
  ...props
}) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props} />
  );
}

/**
 * Renders the sheet's title element with default styling and a data-slot for composition.
 *
 * @param {string} [className] - Additional class names appended to the default title classes.
 * @param {object} [props] - Additional props forwarded to the underlying SheetPrimitive.Title element.
 * @returns {JSX.Element} The rendered sheet title element.
 */
function SheetTitle({
  className,
  ...props
}) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-foreground font-semibold", className)}
      {...props} />
  );
}

/**
 * Renders the sheet's description element used to convey supplementary information.
 * @param {string} [className] - Additional CSS class names to apply to the description element.
 * @param {Object} [props] - Additional props forwarded to the underlying Radix Description component.
 * @returns {JSX.Element} The sheet description element.
 */
function SheetDescription({
  className,
  ...props
}) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props} />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}