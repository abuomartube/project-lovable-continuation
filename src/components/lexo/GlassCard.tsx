import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const GlassCard = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("glass rounded-3xl", className)}
      {...props}
    />
  ),
);
GlassCard.displayName = "GlassCard";

export default GlassCard;