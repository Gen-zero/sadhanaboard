import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-5 w-5 shrink-0 rounded-md border border-purple-500/50 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-fuchsia-500 data-[state=checked]:text-primary-foreground",
      "transition-all duration-300 hover:scale-110 active:scale-95",
      className
    )}
    {...props}
  >
    <motion.div
      animate={{ 
        scale: props.checked ? [0, 1.2, 1] : 1,
        rotate: props.checked ? [0, 15, 0] : 0
      }}
      transition={{ duration: 0.3 }}
    >
      <CheckboxPrimitive.Indicator
        className={cn("flex items-center justify-center text-current")}
        asChild
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
        >
          <Check className="h-4 w-4 text-white" />
        </motion.div>
      </CheckboxPrimitive.Indicator>
    </motion.div>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }