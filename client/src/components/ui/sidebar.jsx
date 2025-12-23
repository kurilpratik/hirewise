import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { PanelLeftIcon } from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "17rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

const SidebarContext = React.createContext(null);

/**
 * Access the current sidebar context for components rendered inside a SidebarProvider.
 *
 * @returns {object} The sidebar context object with keys: `state`, `open`, `setOpen`, `isMobile`, `openMobile`, `setOpenMobile`, and `toggleSidebar`.
 * @throws {Error} If called outside of a SidebarProvider (throws "useSidebar must be used within a SidebarProvider.").
 */
function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
}

/**
 * Provides sidebar state and controls to descendant components and renders a sidebar wrapper.
 *
 * The provider manages controlled and uncontrolled open state, mobile open state, and exposes
 * toggle and setter helpers via context. It persists the desktop open state to a cookie
 * and registers a global keyboard shortcut (Ctrl/Cmd + B) to toggle the sidebar. Renders
 * a TooltipProvider and a wrapper element that defines CSS variables used by sidebar children.
 *
 * @param {Object} props
 * @param {boolean} [props.defaultOpen=true] - Initial open state when the component is used uncontrolled.
 * @param {boolean} [props.open] - Controlled open state; when provided, the component becomes controlled.
 * @param {(open: boolean) => void} [props.onOpenChange] - Callback invoked when the open state changes.
 * @param {string} [props.className] - Additional className applied to the wrapper element.
 * @param {Object} [props.style] - Inline styles applied to the wrapper; CSS variables for sidebar widths are merged here.
 * @param {React.ReactNode} [props.children] - Child elements rendered inside the provider.
 * @param {Object} [props.props] - Additional props spread onto the wrapper element.
 * @returns {JSX.Element} The SidebarProvider element that supplies sidebar context to its descendants.
 */
function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = React.useCallback(
    (value) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }

      // This sets the cookie to keep the sidebar state.
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open],
  );

  // Helper to toggle the sidebar.
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
  }, [isMobile, setOpen, setOpenMobile]);

  // Adds a keyboard shortcut to toggle the sidebar.
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state = open ? "expanded" : "collapsed";

  const contextValue = React.useMemo(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          data-slot="sidebar-wrapper"
          style={{
            "--sidebar-width": SIDEBAR_WIDTH,
            "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
            ...style,
          }}
          className={cn(
            "group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full",
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
}

/**
 * Render a responsive, variant-configurable sidebar container.
 *
 * Renders as a full-height static sidebar when `collapsible` is "none", as a mobile sheet on small screens, or as a desktop sidebar with a gap and positioned container. Visual layout and sizing adapt to `variant`, `side`, and the provider-managed sidebar state.
 *
 * @param {{side?: "left" | "right", variant?: "sidebar" | "floating" | "inset" | string, collapsible?: "offcanvas" | "icon" | "none" | string, className?: string, children?: React.ReactNode}} props - Component props.
 * @param {"left" | "right"} [props.side="left"] - Horizontal position of the sidebar.
 * @param {"sidebar" | "floating" | "inset" | string} [props.variant="sidebar"] - Visual/layout variant that affects padding, borders, and shadow.
 * @param {"offcanvas" | "icon" | "none" | string} [props.collapsible="offcanvas"] - Collapsibility mode; "none" disables collapsing, "offcanvas" hides the sidebar off-canvas, "icon" reduces to an icon rail.
 * @param {string} [props.className] - Additional CSS classes applied to the outer container.
 * @param {React.ReactNode} [props.children] - Sidebar content (header, menu, footer, etc.).
 * @returns {JSX.Element} A React element representing the configured sidebar. 
 */
function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  ...props
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  if (collapsible === "none") {
    return (
      <div
        data-slot="sidebar"
        className={cn(
          "bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col bg-linear-to-b from-[#faf9f6] to-[#fcfbf8]",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          data-sidebar="sidebar"
          data-slot="sidebar"
          data-mobile="true"
          className="bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden"
          style={{
            "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
          }}
          side={side}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      className="group peer text-sidebar-foreground hidden md:block"
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
      data-slot="sidebar"
    >
      {/* This is what handles the sidebar gap on desktop */}
      <div
        data-slot="sidebar-gap"
        className={cn(
          "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
          "group-data-[collapsible=offcanvas]:w-0",
          "group-data-[side=right]:rotate-180",
          variant === "floating" || variant === "inset"
            ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)",
        )}
      />
      <div
        data-slot="sidebar-container"
        className={cn(
          "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex",
          side === "left"
            ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
            : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
          // Adjust the padding for floating and inset variants.
          variant === "floating" || variant === "inset"
            ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
          className,
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          className="bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm"
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Renders a button that toggles the sidebar when activated.
 *
 * The button renders a panel icon, includes hidden screen-reader text "Toggle Sidebar",
 * forwards remaining props to the underlying Button, and calls the optional `onClick`
 * handler before toggling the sidebar state.
 *
 * @param {Object} props
 * @param {string} [props.className] - Additional CSS class names to apply to the trigger.
 * @param {(event: MouseEvent) => void} [props.onClick] - Optional click handler invoked before the sidebar toggle.
 * @returns {JSX.Element} A React element representing the sidebar trigger button.
 */
function SidebarTrigger({ className, onClick, ...props }) {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      className={cn("size-7", className)}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <PanelLeftIcon />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}

/**
 * Renders a narrow rail button that toggles the sidebar's open/collapsed state.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional CSS class names to apply to the button.
 * @returns {JSX.Element} A button element that toggles the sidebar when clicked; remaining props are forwarded to the underlying button.
 */
function SidebarRail({ className, ...props }) {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      data-sidebar="rail"
      data-slot="sidebar-rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        "hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] sm:flex",
        "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Render the page's inset content area aligned with the sidebar and styled responsively for the `inset` variant.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional class names applied to the root element.
 * @returns {JSX.Element} The main element used as the inset content area for layout alignment with the sidebar.
 */
function SidebarInset({ className, ...props }) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn(
        "bg-background relative flex w-full flex-1 flex-col",
        "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Renders a sidebar-styled text input element.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional CSS classes to apply to the input.
 * @returns {JSX.Element} The rendered Input element configured for use inside the sidebar.
 */
function SidebarInput({ className, ...props }) {
  return (
    <Input
      data-slot="sidebar-input"
      data-sidebar="input"
      className={cn("bg-background h-8 w-full shadow-none", className)}
      {...props}
    />
  );
}

/**
 * Renders a styled header container for sidebar content.
 * @param {Object} props
 * @param {string} [props.className] - Additional class names to apply to the header container.
 * @returns {JSX.Element} The header container element for sidebar content.
 */
function SidebarHeader({ className, ...props }) {
  return (
    <div
      data-slot="sidebar-header"
      data-sidebar="header"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  );
}

/**
 * Renders the sidebar's footer area as a vertically stacked container with spacing and padding.
 * @param {object} props - Component props.
 * @param {string} [props.className] - Additional CSS classes to apply to the footer container.
 * @returns {JSX.Element} The sidebar footer element.
 */
function SidebarFooter({ className, ...props }) {
  return (
    <div
      data-slot="sidebar-footer"
      data-sidebar="footer"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  );
}

/**
 * Render a themed separator used within the Sidebar layout.
 * @returns {JSX.Element} A Separator element configured with sidebar-specific data attributes and styling.
 */
function SidebarSeparator({ className, ...props }) {
  return (
    <Separator
      data-slot="sidebar-separator"
      data-sidebar="separator"
      className={cn("bg-sidebar-border mx-2 w-auto", className)}
      {...props}
    />
  );
}

/**
 * Scrollable flex column container used as the main content area inside a sidebar.
 *
 * @param {object} props - Component props.
 * @param {string} [props.className] - Additional CSS class names to apply to the container.
 * @returns {JSX.Element} A div element serving as the sidebar's scrollable content area.
 */
function SidebarContent({ className, ...props }) {
  return (
    <div
      data-slot="sidebar-content"
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Renders a vertical container for grouping related sidebar items.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional CSS classes to apply to the container.
 * @returns {JSX.Element} The sidebar group container element.
 */
function SidebarGroup({ className, ...props }) {
  return (
    <div
      data-slot="sidebar-group"
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
      {...props}
    />
  );
}

/**
 * Render a styled label for a sidebar group.
 *
 * Renders either a div or a Slot (when `asChild` is true) with the proper data attributes and sidebar-specific
 * utility classes. When an ancestor sets `data-collapsible="icon"`, the label's margin and opacity are adjusted
 * to hide it for icon-only collapsed sidebars.
 *
 * @param {Object} props
 * @param {string} [props.className] - Additional class names to apply to the label container.
 * @param {boolean} [props.asChild=false] - If true, render a `Slot` so the caller can pass a custom element as the label.
 * @returns {import('react').ReactElement} A React element representing the group label.
 */
function SidebarGroupLabel({ className, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      data-slot="sidebar-group-label"
      data-sidebar="group-label"
      className={cn(
        "text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Render a positioned action control for a sidebar group.
 *
 * Renders a small square action button fixed to the top-right of a sidebar group; when `asChild` is true the provided child is rendered via a `Slot` instead of a native `button`. Additional props are forwarded to the rendered element.
 *
 * @param {object} props
 * @param {string} [props.className] - Additional CSS classes to apply to the control.
 * @param {boolean} [props.asChild=false] - If true, render the passed child element via `Slot` instead of a `button`.
 * @returns {JSX.Element} The sidebar group action element.
 */
function SidebarGroupAction({ className, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="sidebar-group-action"
      data-sidebar="group-action"
      className={cn(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 md:after:hidden",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Renders a container for group content inside the sidebar, applying sidebar-specific slots and default styling.
 * @param {object} props - Props passed to the component.
 * @param {string} [props.className] - Additional CSS classes to apply to the container.
 * @returns {JSX.Element} The sidebar group content container element.
 */
function SidebarGroupContent({ className, ...props }) {
  return (
    <div
      data-slot="sidebar-group-content"
      data-sidebar="group-content"
      className={cn("w-full text-sm", className)}
      {...props}
    />
  );
}

/**
 * Render a vertical list container for sidebar menu items.
 *
 * Renders a <ul> with sidebar-specific data attributes and layout classes; accepts additional
 * props (e.g., children, id, aria attributes) and merges an optional `className`.
 * @returns The rendered sidebar menu list element.
 */
function SidebarMenu({ className, ...props }) {
  return (
    <ul
      data-slot="sidebar-menu"
      data-sidebar="menu"
      className={cn("flex w-full min-w-0 flex-col gap-1", className)}
      {...props}
    />
  );
}

/**
 * Render a list item that serves as a sidebar menu item container.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional CSS classes to apply to the list item.
 * @param {Object} [props.] - Additional props are spread onto the rendered `<li>` element.
 * @returns {JSX.Element} The rendered `<li>` element configured as a sidebar menu item.
 */
function SidebarMenuItem({ className, ...props }) {
  return (
    <li
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      className={cn("group/menu-item relative", className)}
      {...props}
    />
  );
}

const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

/**
 * Renders a sidebar menu button that can be an inline element or a Slot, optionally wrapped with a tooltip that only appears when the sidebar is collapsed on non-mobile view.
 *
 * @param {Object} props - Component props.
 * @param {boolean} [props.asChild=false] - If true, renders a Slot instead of a native button to allow the parent to supply the element.
 * @param {boolean} [props.isActive=false] - Marks the button as active for styling and state attributes.
 * @param {'default'|'outline'} [props.variant='default'] - Visual variant of the button.
 * @param {'default'|'sm'|'lg'} [props.size='default'] - Size variant of the button.
 * @param {string|Object} [props.tooltip] - Tooltip content or Tooltip props. If a string, it is used as the tooltip text. Tooltip is shown only when the sidebar state is "collapsed" and the device is not mobile.
 * @param {string} [props.className] - Additional CSS classes applied to the button.
 * @returns {import('react').ReactElement} A button element (or a Slot) with sidebar-specific data attributes, optionally wrapped in a Tooltip.
 */
function SidebarMenuButton({
  asChild = false,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  ...props
}) {
  const Comp = asChild ? Slot : "button";
  const { isMobile, state } = useSidebar();

  const button = (
    <Comp
      data-slot="sidebar-menu-button"
      data-sidebar="menu-button"
      data-size={size}
      data-active={isActive}
      className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
      {...props}
    />
  );

  if (!tooltip) {
    return button;
  }

  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip,
    };
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent
        side="right"
        align="center"
        hidden={state !== "collapsed" || isMobile}
        {...tooltip}
      />
    </Tooltip>
  );
}

/**
 * Renders a positioned action control for a sidebar menu item (e.g., an overflow or contextual action).
 *
 * @param {object} props - Component props.
 * @param {string} [props.className] - Additional CSS classes to apply to the action control.
 * @param {boolean} [props.asChild=false] - If true, renders a Slot so the action can inherit markup from a parent; otherwise renders a native `button`.
 * @param {boolean} [props.showOnHover=false] - If true, hides the action by default and reveals it when the parent menu item is hovered, focused, or active.
 * @returns {JSX.Element} A button-like element positioned inside a sidebar menu item for secondary actions.
 */
function SidebarMenuAction({
  className,
  asChild = false,
  showOnHover = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="sidebar-menu-action"
      data-sidebar="menu-action"
      className={cn(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground peer-hover/menu-button:text-sidebar-accent-foreground absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 md:after:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        showOnHover &&
          "peer-data-[active=true]/menu-button:text-sidebar-accent-foreground group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Render a badge positioned at the right side of a sidebar menu item.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional CSS class names to apply to the badge container.
 * @returns {JSX.Element} A div element used to display a badge at the right side of a sidebar menu item; additional props are forwarded to the element.
 */
function SidebarMenuBadge({ className, ...props }) {
  return (
    <div
      data-slot="sidebar-menu-badge"
      data-sidebar="menu-badge"
      className={cn(
        "text-sidebar-foreground pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums select-none",
        "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Renders a skeleton placeholder for a sidebar menu item.
 *
 * Renders an optional icon skeleton and a text skeleton with a variable width to simulate loading state.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional class names applied to the root container.
 * @param {boolean} [props.showIcon=false] - If `true`, display an icon-shaped skeleton at the start of the item.
 * @param {Object} [props.*] - Additional props are spread onto the root div.
 * @returns {JSX.Element} A skeleton DOM structure representing a loading sidebar menu item.
 */
function SidebarMenuSkeleton({ className, showIcon = false, ...props }) {
  // Random width between 50 to 90%.
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`;
  }, []);

  return (
    <div
      data-slot="sidebar-menu-skeleton"
      data-sidebar="menu-skeleton"
      className={cn("flex h-8 items-center gap-2 rounded-md px-2", className)}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="size-4 rounded-md"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        className="h-4 max-w-(--skeleton-width) flex-1"
        data-sidebar="menu-skeleton-text"
        style={{
          "--skeleton-width": width,
        }}
      />
    </div>
  );
}

/**
 * Renders a nested sidebar submenu container.
 *
 * @param {Object} props
 * @param {string} [props.className] - Additional CSS classes applied to the submenu container.
 * @param {import('react').HTMLAttributes<HTMLUListElement>} [props.props] - Additional props spread to the underlying `<ul>`.
 * @returns {JSX.Element} A `<ul>` element that groups submenu items and applies sidebar-specific layout and styling.
 */
function SidebarMenuSub({ className, ...props }) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      className={cn(
        "border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Render a list item that serves as a wrapper for a sidebar submenu item.
 *
 * Adds the appropriate data-slot and data-sidebar attributes and accepts
 * additional CSS classes and any standard list item props which are spread onto the element.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional CSS classes to apply to the list item.
 * @returns {JSX.Element} The rendered `<li>` element for a sidebar submenu item.
 */
function SidebarMenuSubItem({ className, ...props }) {
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      data-sidebar="menu-sub-item"
      className={cn("group/menu-sub-item relative", className)}
      {...props}
    />
  );
}

/**
 * Renders a submenu link/button used inside a sidebar submenu.
 *
 * Renders an anchor by default or a provided child component via `asChild`, applies size and active styling, and exposes data attributes for sidebar composition.
 *
 * @param {Object} props - Component props.
 * @param {boolean} [props.asChild=false] - If true, renders the passed child element instead of an anchor.
 * @param {'sm'|'md'} [props.size='md'] - Visual size variant for spacing and typography.
 * @param {boolean} [props.isActive=false] - Whether the button is in an active state (applies active styles).
 * @param {string} [props.className] - Additional CSS classes to apply.
 * @returns {JSX.Element} The rendered submenu button element with sidebar-specific data attributes and styling.
 */
function SidebarMenuSubButton({
  asChild = false,
  size = "md",
  isActive = false,
  className,
  ...props
}) {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      data-slot="sidebar-menu-sub-button"
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 outline-hidden focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};