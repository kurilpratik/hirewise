import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

/**
 * Provides tooltip context to descendant tooltip components.
 *
 * @param {Object} props - Component props.
 * @param {number} [props.delayDuration=0] - Delay in milliseconds before a tooltip opens.
 * @returns {import('react').ReactElement} The tooltip context provider element.
 */
function TooltipProvider({
  delayDuration = 0,
  ...props
}) {
  return (<TooltipPrimitive.Provider data-slot="tooltip-provider" delayDuration={delayDuration} {...props} />);
}

/**
 * Wraps a Radix tooltip root with a TooltipProvider to supply tooltip context.
 *
 * Forwards all received props to the underlying TooltipPrimitive.Root.
 *
 * @param {object} props - Props to pass through to TooltipPrimitive.Root (for example: children, open, defaultOpen, onOpenChange, etc.).
 * @returns {JSX.Element} A TooltipPrimitive.Root element wrapped by TooltipProvider.
 */
function Tooltip({
  ...props
}) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

/**
 * Renders the element that triggers the tooltip.
 * @param {object} props - Props forwarded to the underlying trigger element (e.g., event handlers, className, children).
 * @returns {JSX.Element} The trigger element for the tooltip.
 */
function TooltipTrigger({
  ...props
}) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

/**
 * Render the tooltip's content panel inside a portal.
 *
 * Renders Radix Tooltip content with default styling and a positioned arrow, supports a configurable
 * side offset, merges additional CSS classes, and forwards any other props to the content element.
 *
 * @param {string} [className] - Additional CSS classes to merge with the component's default styles.
 * @param {number} [sideOffset=0] - Distance in pixels between the tooltip content and its trigger.
 * @param {import('react').ReactNode} [children] - Content to display inside the tooltip.
 * @param {Object} [props] - Additional props forwarded to TooltipPrimitive.Content.
 * @returns {JSX.Element} The tooltip content element rendered within a portal.
 */
function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "bg-foreground text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
          className
        )}
        {...props}>
        {children}
        <TooltipPrimitive.Arrow
          className="bg-foreground fill-foreground z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }