import * as React from "react"
import { cn } from "@/lib/utils/cn"

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("glass-panel rounded-[var(--radius-lg)] p-6", className)} {...props} />
))
Card.displayName = "Card"

export { Card }
