import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        cosmic: "border border-primary/30 bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm text-foreground",
        premium: "border border-accent/30 bg-gradient-to-r from-accent/20 to-secondary/20 backdrop-blur-sm text-foreground shadow-[0_0_10px_rgba(var(--accent-rgb),0.2)]"
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
    <div 
      className={cn(badgeVariants({ variant }), className, "transition-all duration-300 hover:scale-110 active:scale-95")}
      {...props}
    />
  )
}

export { Badge, badgeVariants }