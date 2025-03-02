import * as React from "react"
import { cn } from "@/lib/actions/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  variant?: "default" | "filled";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, variant = "default", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full text-sm",
          "px-3 py-2",
          "bg-transparent",
          "placeholder:text-muted-foreground/60 text-base",
          "selection:bg-primary/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "transition-all duration-200 ease-in-out",
          "motion-safe:transition-[background,border,shadow]",
          "motion-safe:duration-200",

          // Default variant
          variant === "default" && [
            "border border-input/50",
            "shadow-sm",
            "hover:border-input/80 hover:bg-background/80",
            "focus:border-primary/50 focus:bg-background",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/20 focus-visible:ring-offset-0",
          ],

          // Filled variant
          variant === "filled" && [
            "border border-transparent",
            "bg-muted/40",
            "hover:bg-muted/60",
            "focus:bg-muted/80",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/20 focus-visible:ring-offset-0",
          ],

          // Error state
          error && [
            "border-destructive/50",
            "focus:border-destructive",
            "focus-visible:ring-destructive/20",
          ],

          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
