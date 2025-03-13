import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/actions/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-9 w-full items-center justify-between",
      "px-3 py-2",
      "bg-white border border-gray-200",
      "text-sm text-gray-700",
      "rounded-md",
      "transition-all duration-200 ease-in-out",
      "hover:border-gray-300",
      "focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-300",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
    onKeyDown={(e) => {
      // Handle custom key events if needed
      props.onKeyDown?.(e)
    }}
    aria-haspopup="listbox"
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200 ease-in-out" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1 text-gray-500 hover:text-gray-900",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1 text-gray-500 hover:text-gray-900",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 min-w-[8rem]",
        "rounded-md border border-gray-200",
        "bg-white shadow-lg",
        "animate-in fade-in-80 zoom-in-95",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2",
        "data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2",
        "data-[side=top]:slide-in-from-bottom-2",
        "transition-all duration-100 ease-in-out",
        className,
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          "max-h-[280px]",
          "overflow-y-auto",
          "overscroll-contain",
          "scroll-smooth",
          "rounded-md",
          position === "popper" && "w-full min-w-[var(--radix-select-trigger-width)]",
        )}
        style={{
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-y',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          overflowY: 'auto',
          scrollBehavior: 'smooth',
        }}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5",
      "text-sm font-medium leading-none tracking-tight",
      "text-gray-500",
      "select-none",
      className,
    )}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full select-none items-center",
      "rounded-sm py-2.5 pl-2 pr-4",
      "text-sm leading-none",
      "cursor-pointer",
      "outline-none",
      "transition-colors duration-150 ease-in-out",
      "text-gray-700",
      "hover:bg-gray-50 active:bg-gray-100",
      "focus:bg-gray-50 focus:text-gray-900",
      "data-[state=checked]:bg-gray-50 data-[state=checked]:text-gray-900",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
    onKeyDown={(e) => {
      // Handle numeric keypad navigation
      const numericKeys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

      if (numericKeys.includes(e.key)) {
        // Find items that start with this number
        const items = Array.from(document.querySelectorAll('[role="option"]')) as HTMLElement[]

        const matchingItems = items.filter((item) =>
          item.textContent?.trim().toLowerCase().startsWith(e.key.toLowerCase()),
        )

        if (matchingItems.length > 0) {
          // Focus the first matching item
          matchingItems[0]?.focus()
          e.preventDefault()
        }
      }

      // Type-ahead functionality for letters
      const isAlphabetic = /^[a-z]$/i.test(e.key)
      if (isAlphabetic) {
        const items = Array.from(document.querySelectorAll('[role="option"]')) as HTMLElement[]

        const matchingItems = items.filter((item) =>
          item.textContent?.trim().toLowerCase().startsWith(e.key.toLowerCase()),
        )

        if (matchingItems.length > 0) {
          // Focus the first matching item
          matchingItems[0]?.focus()
          e.preventDefault()
        }
      }

      // Call the original onKeyDown handler if provided
      props.onKeyDown?.(e)
    }}
    role="option"
    tabIndex={0}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4 text-blue-500" />
      </SelectPrimitive.ItemIndicator>
    </span>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator ref={ref} className={cn("my-1 h-px bg-gray-200", className)} {...props} />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}

