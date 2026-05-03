import { LogIn, LogOut } from "lucide-react";
import type { PresenceEvent } from "@/hooks/useLivePresence";

export const PresenceToasts = ({ events }: { events: PresenceEvent[] }) => {
  if (events.length === 0) return null;
  return (
    <div className="pointer-events-none absolute left-1/2 top-3 z-30 flex -translate-x-1/2 flex-col items-center gap-1.5">
      {events.map((e) => (
        <div
          key={e.id}
          className={
            "glass flex animate-slide-in-up items-center gap-2 rounded-full px-3 py-1 text-[10px] font-medium shadow-glow " +
            (e.type === "join" ? "text-success" : "text-muted-foreground")
          }
        >
          {e.type === "join" ? <LogIn className="h-3 w-3" /> : <LogOut className="h-3 w-3" />}
          <span className="font-semibold">{e.name}</span>
          <span className="opacity-70">{e.type === "join" ? "joined the room" : "left"}</span>
        </div>
      ))}
    </div>
  );
};

export default PresenceToasts;