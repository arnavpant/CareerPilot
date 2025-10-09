import * as React from "react"
import { cn } from "@/lib/utils/cn"

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(({ className, ...props }, ref) => {
  return <label ref={ref} className={cn("block text-sm font-medium text-slate-300 mb-2", className)} {...props} />
})
Label.displayName = "Label"

export { Label }
