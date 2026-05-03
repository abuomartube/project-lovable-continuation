import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: ReactNode;
  className?: string;
}

export const AppShell = ({ children, className }: AppShellProps) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full bg-primary/20 blur-[140px]" />
      <div className="pointer-events-none absolute top-1/3 -right-40 h-[520px] w-[520px] rounded-full bg-accent/20 blur-[160px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-primary-glow/15 blur-[140px]" />

      <div className={cn("relative z-10 mx-auto w-full max-w-7xl px-6 py-10", className)}>
        {children}
      </div>
    </div>
  );
};

export default AppShell;