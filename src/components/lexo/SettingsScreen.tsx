import { useState } from "react";
import { ChevronLeft, ChevronRight, LogOut, HelpCircle, Mail, Info } from "lucide-react";
import { IconButton } from "./IconButton";

const Toggle = ({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) => (
  <button onClick={() => onChange(!on)} className={"relative h-5 w-9 rounded-full transition-all " + (on ? "bg-gradient-primary shadow-glow" : "bg-secondary/70")}>
    <span className={"absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all " + (on ? "right-0.5" : "left-0.5")} />
  </button>
);

export const SettingsScreen = () => {
  const [enOnly, setEnOnly] = useState(true);
  const [notif, setNotif] = useState(true);
  const [dark, setDark] = useState(true);
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-glass-border/40 bg-card/60 px-4 pb-3 pt-10 backdrop-blur-xl">
        <IconButton variant="ghost" size="sm"><ChevronLeft className="h-5 w-5" /></IconButton>
        <h2 className="text-sm font-semibold">Settings</h2>
        <span className="h-8 w-8" />
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto px-3 py-4">
        <div>
          <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Preferences</p>
          <div className="glass divide-y divide-glass-border/30 overflow-hidden rounded-2xl">
            <div className="flex items-center justify-between px-3 py-3 text-xs"><span>English Only Mode</span><Toggle on={enOnly} onChange={setEnOnly} /></div>
            <div className="flex items-center justify-between px-3 py-3 text-xs"><span>Notifications</span><Toggle on={notif} onChange={setNotif} /></div>
            <div className="flex items-center justify-between px-3 py-3 text-xs"><span>Dark Mode</span><Toggle on={dark} onChange={setDark} /></div>
            <button className="flex w-full items-center justify-between px-3 py-3 text-xs hover:bg-secondary/40">
              <span>Language</span>
              <span className="flex items-center gap-1 text-muted-foreground">English <ChevronRight className="h-3 w-3" /></span>
            </button>
          </div>
        </div>
        <div>
          <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Support</p>
          <div className="glass divide-y divide-glass-border/30 overflow-hidden rounded-2xl">
            {[
              { label: "Help Center", Icon: HelpCircle },
              { label: "Contact Us", Icon: Mail },
              { label: "About App", Icon: Info },
            ].map((m) => (
              <button key={m.label} className="flex w-full items-center gap-3 px-3 py-3 text-left text-xs hover:bg-secondary/40">
                <m.Icon className="h-4 w-4 text-primary-glow" />
                <span className="flex-1">{m.label}</span>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
        <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/40 bg-destructive/10 py-3 text-xs font-semibold text-destructive hover:bg-destructive/20">
          <LogOut className="h-3.5 w-3.5" /> Logout
        </button>
      </div>
    </div>
  );
};

export default SettingsScreen;
