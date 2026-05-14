"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"
import { cn } from "@/lib/utils"
import { ChevronDownIcon, ChevronUpIcon, CheckIcon } from "lucide-react"

const Select = SelectPrimitive.Root

function SelectGroup({ className, ...props }: SelectPrimitive.Group.Props) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("px-1 py-1", className)}
      {...props}
    />
  )
}

function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn("flex flex-1 text-left truncate", className)}
      {...props}
    />
  )
}

function SelectTrigger({
  className,
  children,
  ...props
}: Omit<SelectPrimitive.Trigger.Props, "size">) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        // layout
        "flex w-full items-center justify-between gap-2 px-3",
        "h-11 rounded-sm",
        // border & bg
        "border border-gray-200 bg-white",
        // typography
        "text-sm text-gray-900",
        // placeholder
        "data-placeholder:text-gray-400",
        // interaction
        "cursor-default select-none outline-none transition-all duration-150",
        "hover:border-gray-300",
        "focus-visible:border-brand-terracotta focus-visible:ring-2 focus-visible:ring-brand-terracotta/20",
        // disabled
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon render={<ChevronDownIcon className="h-4 w-4 text-gray-400 shrink-0" />} />
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  side = "bottom",
  sideOffset = 6,
  align = "start",
  alignOffset = 0,
  alignItemWithTrigger = false,
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<SelectPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset" | "alignItemWithTrigger">) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        className="isolate z-50 w-(--anchor-width)"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          className={cn(
            "relative z-50 overflow-hidden",
            "bg-white rounded-xl shadow-xl ring-1 ring-black/10",
            "py-1.5 min-w-40 max-h-(--available-height) overflow-y-auto",
            "origin-(--transform-origin)",
            "duration-150 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          )}
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.List>{children}</SelectPrimitive.List>
          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({ className, ...props }: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn("px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider", className)}
      {...props}
    />
  )
}

function SelectItem({ className, children, ...props }: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full items-center gap-2 px-3 py-2.5 mx-1 rounded-lg",
        "text-sm text-gray-700 cursor-default select-none",
        "transition-colors duration-75 outline-none",
        "focus:bg-gray-50 focus:text-gray-900",
        "data-disabled:pointer-events-none data-disabled:opacity-40",
        // width correction for mx-1
        "w-[calc(100%-0.5rem)]",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText className="flex-1 truncate">
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="flex items-center justify-center w-4 shrink-0">
        <CheckIcon className="h-3.5 w-3.5 text-brand-terracotta" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({ className, ...props }: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("my-1.5 h-px bg-gray-100 mx-3", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn("flex w-full items-center justify-center py-1 text-gray-400", className)}
      {...props}
    >
      <ChevronUpIcon className="h-4 w-4" />
    </SelectPrimitive.ScrollUpArrow>
  )
}

function SelectScrollDownButton({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn("flex w-full items-center justify-center py-1 text-gray-400", className)}
      {...props}
    >
      <ChevronDownIcon className="h-4 w-4" />
    </SelectPrimitive.ScrollDownArrow>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
