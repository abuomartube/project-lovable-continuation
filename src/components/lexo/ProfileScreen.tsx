import { ChevronLeft, Edit3, Trophy, BarChart3, Award, Settings, ChevronRight, MessageCircle, Mic, DoorOpen } from "lucide-react";
import { IconButton } from "./IconButton";
import { Avatar } from "./Avatar";

const stats = [
  { label: "Messages", value: "320", Icon: MessageCircle, tint: "text-cyan-400 bg-cyan-400/15" },
  { label: "Voice Time", value: "85 min", Icon: Mic, tint: "text-pink-400 bg-pink-400/15" },
  { label: "Rooms Joined", value: "24", Icon: DoorOpen, tint: "text-emerald-400 bg-emerald-400/15" },
];

const menu = [
  { label: "Achievements", Icon: Trophy },
  { label: "Statistics", Icon: BarChart3 },
  { label: "Badges", Icon: Award },
  { label: "Settings", Icon: Settings },
];

export const ProfileScreen = () => {
  const xp = 750;
  const max = 1200;
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-glass-border/40 bg-card/60 px-4 pb-3 pt-10 backdrop-blur-xl">
        <IconButton variant="ghost" size="sm"><ChevronLeft className="h-5 w-5" /></IconButton>
        <h2 className="text-sm font-semibold">Profile</h2>
        <IconButton variant="ghost" size="sm"><Edit3 className="h-4 w-4" /></IconButton>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto px-3 py-4">
        <div className="flex flex-col items-center text-center">
          <Avatar name="Omar" size="lg" online />
          <h3 className="mt-3 text-base font-bold">Omar</h3>
          <span className="mt-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[10px] font-medium text-primary-glow">Intermediate</span>
        </div>
        <div className="glass rounded-2xl p-4">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="font-semibold">Level 12</span>
            <span className="text-muted-foreground">{xp} / {max} XP</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary/60">
            <div className="h-full rounded-full bg-gradient-primary shadow-glow" style={{ width: `${(xp / max) * 100}%` }} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {stats.map((s) => (
            <div key={s.label} className="glass flex flex-col items-center gap-1 rounded-2xl p-2.5">
              <span className={`flex h-7 w-7 items-center justify-center rounded-full ${s.tint}`}><s.Icon className="h-3.5 w-3.5" /></span>
              <span className="text-sm font-bold">{s.value}</span>
              <span className="text-[9px] text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>
        <div className="glass divide-y divide-glass-border/30 overflow-hidden rounded-2xl">
          {menu.map((m) => (
            <button key={m.label} className="flex w-full items-center gap-3 px-3 py-3 text-left text-xs hover:bg-secondary/40">
              <m.Icon className="h-4 w-4 text-primary-glow" />
              <span className="flex-1 font-medium">{m.label}</span>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
