import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        // Gold chip — primary accent
        default:
          "border border-transparent bg-primary text-primary-foreground",
        // Subtle secondary chip
        secondary:
          "border border-transparent bg-secondary text-secondary-foreground",
        // Profit (green)
        profit:
          "border border-[var(--profit)] bg-[rgba(16,185,129,0.12)] text-[var(--profit)]",
        // Loss (red)
        loss:
          "border border-[var(--loss)] bg-[rgba(239,68,68,0.12)] text-[var(--loss)]",
        // Outline only
        outline:
          "border border-border text-foreground",
        // Destructive
        destructive:
          "border border-transparent bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
