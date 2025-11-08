import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus:outline-none focus:ring-0 focus:border-0 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background/30 backdrop-blur-sm hover:bg-accent/30 hover:text-accent-foreground",
        secondary:
          "bg-secondary/30 backdrop-blur-sm text-secondary-foreground hover:bg-secondary/40",
        ghost: "hover:bg-accent/30 hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline", // Add link variant
        cosmic: "bg-gradient-to-r from-primary/30 to-secondary/30 backdrop-blur-sm text-foreground hover:from-primary/40 hover:to-secondary/40 border border-primary/30 cosmic-glow", // New cosmic variant
        shimmer: "relative overflow-hidden bg-gradient-to-r from-primary/30 to-secondary/30 border border-primary/30 hover:from-primary/40 hover:to-secondary/30 backdrop-blur-sm shimmer-effect", // Shimmer effect variant
        interactive: "relative overflow-hidden bg-gradient-to-r from-primary/30 to-secondary/30 backdrop-blur-sm text-foreground border border-primary/30 cosmic-glow transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95", // Interactive variant with scale and shadow effects
        floating: "relative bg-gradient-to-r from-primary/30 to-secondary/30 backdrop-blur-sm text-foreground border border-primary/30 float-3d transition-transform duration-300 hover:translate-y-[-5px] active:translate-y-0" // Floating 3D effect variant
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// Explicitly define the variant types
type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "cosmic" | "shimmer" | "interactive" | "floating"
type ButtonSize = "default" | "sm" | "lg" | "icon"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  variant?: ButtonVariant
  size?: ButtonSize
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }