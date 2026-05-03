import { cn } from "@/lib/utils";

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("skeleton", className)} aria-hidden />
);

export const RoomCardSkeleton = () => (
  <div className="glass flex items-center gap-3 rounded-[20px] p-3">
    <Skeleton className="h-12 w-12 rounded-2xl" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-3 w-2/3" />
      <Skeleton className="h-2.5 w-1/3" />
    </div>
    <Skeleton className="h-8 w-20 rounded-full" />
  </div>
);

export const MessageSkeleton = ({ side = "left" }: { side?: "left" | "right" }) => (
  <div className={"flex w-full gap-2 " + (side === "right" ? "flex-row-reverse" : "")}>
    <Skeleton className="h-8 w-8 rounded-full" />
    <div className={"flex max-w-[60%] flex-col gap-1.5 " + (side === "right" ? "items-end" : "")}>
      <Skeleton className="h-2.5 w-16" />
      <Skeleton className="h-9 w-48 rounded-2xl" />
    </div>
  </div>
);

export default Skeleton;
