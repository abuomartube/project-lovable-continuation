import { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "primary";
  size?: "sm" | "md" | "lg";
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const sizes = { sm: "h-8 w-8", md: "h-10 w-10", lg: "h-12 w-12" };
    const variants = {
      default: "bg-secondary/60 text-foreground hover:bg-secondary border border-glass-border/40",
      ghost: "bg-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/40",
      primary: "bg-gradient-primary text-primary-foreground shadow-glow",
    };
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          sizes[size],
          variants[variant],
          className,
        )}
        {...props}
      />
    );
  },
);
IconButton.displayName = "IconButton";

export default IconButton;