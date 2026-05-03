import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MobileFrameProps {
  children: ReactNode;
  className?: string;
  label?: string;
  size?: "sm" | "md";
}

export const MobileFrame = ({ children, className, label, size = "md" }: MobileFrameProps) => {
  const w = size === "sm" ? "w-[260px]" : "w-[360px]";
  return (
    <div className="flex flex-col items-center gap-4">
      {label && (
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-primary text-xs font-bold text-primary-foreground shadow-glow">
          {label}
        </span>
      )}
      <div
        className={cn(
          "relative overflow-hidden rounded-[2.5rem] border border-glass-border/60",
          w,
          "bg-card/80 shadow-deep backdrop-blur-xl",
          className,
        )}
        style={{ aspectRatio: "9 / 19.5" }}
      >
        <div className="absolute left-1/2 top-2 z-20 h-5 w-28 -translate-x-1/2 rounded-full bg-background/80" />
        <div className="relative z-10 flex h-full flex-col">{children}</div>
      </div>
    </div>
  );
};

export default MobileFrame;