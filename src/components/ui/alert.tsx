"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full p-4 border rounded-lg",
  {
    variants: {
      variant: {
        default: "bg-background border-border text-foreground",
        destructive: "border-destructive/50 bg-destructive/10 text-destructive dark:border-destructive [&>svg]:text-destructive",
        success: "border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400 [&>svg]:text-green-700 dark:[&>svg]:text-green-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))

Alert.displayName = "Alert"

export { Alert, alertVariants }
