import { cn } from "@/lib/utils"

/**
 * Render a visual skeleton placeholder used to indicate loading state.
 *
 * @param {string} [className] - Additional CSS classes to merge with the default skeleton styles.
 * @param {Object} props - Additional props forwarded to the root <div> (e.g., id, style, aria attributes).
 * @returns {JSX.Element} The rendered skeleton <div> element.
 */
function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props} />
  );
}

export { Skeleton }