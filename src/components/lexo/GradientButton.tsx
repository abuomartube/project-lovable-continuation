import { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
}

export const GradientButton = forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, size = "md", ...props }, ref) => {
    const sizes = {
      sm: "h-9 px-4 text-sm",
      md: "h-11 px-6 text-sm",
      lg: "h-14 px-8 text-base",
    };
    return (
      <button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 rounded-2xl font-semibold text-primary-foreground",
          "bg-gradient-primary shadow-glow transition-all duration-300",
          "hover:brightness-110 active:scale-[0.96]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:pointer-events-none disabled:opacity-50",
          sizes[size],
          className,
        )}
        {...props}
      />
    );
  },
);
GradientButton.displayName = "GradientButton";

export default GradientButton;