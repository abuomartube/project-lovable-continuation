import { ReactNode, useState } from "react";
import {
  Sparkles, MessageCircle, Mic, Trophy, User, Settings as SettingsIcon,
  Lightbulb, GraduationCap, Compass, Users,
} from "lucide-react";
import { ChatScreen } from "@/components/lexo/ChatScreen";
import { RoomSelectionScreen } from "@/components/lexo/RoomSelectionScreen";
import { RoomDetailsScreen } from "@/components/lexo/RoomDetailsScreen";
import { TopicGeneratorScreen } from "@/components/lexo/TopicGeneratorScreen";
import { ProfileScreen } from "@/components/lexo/ProfileScreen";
import { LeaderboardScreen } from "@/components/lexo/LeaderboardScreen";
import { SettingsScreen } from "@/components/lexo/SettingsScreen";
import { CourseSelectionScreen } from "@/components/lexo/CourseSelectionScreen";
import { useLivePresence } from "@/hooks/useLivePresence";
import { OnboardingScreen } from "@/components/lexo/OnboardingScreen";
import { useOnboarding } from "@/hooks/useOnboarding";

const NAV = [
  { id: "rooms", label: "Rooms", Icon: MessageCircle },
  { id: "courses", label: "Courses", Icon: GraduationCap },
  { id: "topics", label: "Topics", Icon: Lightbulb },
  { id: "leaderboard", label: "Leaderboard", Icon: Trophy },
  { id: "profile", label: "Profile", Icon: User },
  { id: "settings", label: "Settings", Icon: SettingsIcon },
] as const;

type NavId = (typeof NAV)[number]["id"];

const Panel = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`glass overflow-hidden ${className}`}>{children}</div>
);

const Index = () => {
  const [active, setActive] = useState<NavId>("rooms");
  const { online } = useLivePresence(24);
  const { completed, profile } = useOnboarding();
  const [recommended, setRecommended] = useState<string[]>([]);

  const renderCenterTop = () => {
    switch (active) {
      case "courses": return <CourseSelectionScreen />;
      case "topics": return <TopicGeneratorScreen />;
      case "leaderboard": return <LeaderboardScreen />;
      case "profile": return <ProfileScreen />;
      case "settings": return <SettingsScreen />;
      case "rooms":
      default: return <RoomSelectionScreen recommendedIds={recommended} />;
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-app-dark text-foreground">
      {!completed && (
        <OnboardingScreen
          onComplete={(rooms) => { setRecommended(rooms); setActive("rooms"); }}
        />
      )}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-app-dark" />
        <div className="absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/15 blur-[160px]" />
        <div className="absolute top-1/3 right-0 h-[600px] w-[600px] rounded-full bg-accent/15 blur-[180px]" />
        <div className="absolute bottom-0 left-1/3 h-[450px] w-[450px] rounded-full bg-primary-glow/10 blur-[160px]" />
      </div>

      <div className="relative z-10 flex h-screen w-full gap-4 p-4">
        {/* LEFT SIDEBAR */}
        <aside className="glass flex w-[240px] shrink-0 flex-col gap-6 p-5">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
              <Sparkles className="h-4 w-4 text-white" />
            </span>
            <div>
              <h1 className="text-lg font-bold leading-none">
                <span className="text-gradient">LEXO</span> Chat
              </h1>
              <p className="mt-1 text-[10px] text-muted-foreground">English Community</p>
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Navigation</p>
            {NAV.map((n) => {
              const isActive = active === n.id;
              return (
                <button
                  key={n.id}
                  onClick={() => setActive(n.id)}
                  className={
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all " +
                    (isActive
                      ? "bg-gradient-primary text-white shadow-glow"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground")
                  }
                >
                  <n.Icon className="h-4 w-4" />
                  {n.label}
                </button>
              );
            })}
          </nav>

          <div className="mt-auto glass rounded-2xl p-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary text-xs font-bold text-white shadow-glow">
                {(profile?.name ?? "Ahmed").slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold">{profile?.name ?? "Ahmed"}</p>
                <p className="text-[10px] text-muted-foreground">
                  Level {profile?.level ?? "B1+"} · Online
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* CENTER */}
        <main className="flex min-w-0 flex-1 flex-col gap-4">
          <header className="glass flex animate-fade-in items-center justify-between px-5 py-3">
            <div className="flex items-center gap-2 text-sm">
              <Compass className="h-4 w-4 text-primary-glow" />
              <span className="font-semibold capitalize">{active}</span>
              <span className="text-muted-foreground">/ Speaking Room – Intermediate</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex h-2 w-2 rounded-full bg-success shadow-[0_0_10px_hsl(var(--success))] animate-soft-pulse" />
              <span key={online} className="inline-block animate-fade-in tabular-nums">{online}</span> online
            </div>
          </header>

          <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_minmax(0,1.2fr)] gap-4">
            <Panel className="min-h-0 glass-hover">
              <div key={active} className="page-enter h-full overflow-y-auto">{renderCenterTop()}</div>
            </Panel>
            <Panel className="min-h-0">
              <div className="h-full">
                <ChatScreen />
              </div>
            </Panel>
          </div>
        </main>

        {/* RIGHT PANEL */}
        <aside className="hidden w-[340px] shrink-0 flex-col gap-4 xl:flex animate-slide-in-right">
          <Panel className="min-h-0 flex-1">
            <div className="h-full overflow-y-auto">
              <RoomDetailsScreen />
            </div>
          </Panel>

          <Panel className="p-4">
            <div className="mb-3 flex items-center gap-2">
              <Users className="h-4 w-4 text-primary-glow" />
              <h3 className="text-sm font-bold">Participants</h3>
              <span className="ml-auto text-[10px] text-muted-foreground">
                <span key={online} className="inline-block animate-fade-in tabular-nums">{online}</span> online
              </span>
            </div>
            <div className="flex -space-x-2">
              {["A", "M", "S", "K", "R", "L", "N"].map((c, i) => (
                <div
                  key={i}
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-gradient-primary text-[11px] font-bold text-white shadow-glow"
                >
                  {c}
                </div>
              ))}
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-secondary text-[10px] font-semibold text-muted-foreground">
                +19
              </div>
            </div>
          </Panel>

          <Panel className="min-h-0 max-h-[40%]">
            <div className="h-full overflow-y-auto">
              <LeaderboardScreen />
            </div>
          </Panel>
        </aside>
      </div>
    </div>
  );
};

export default Index;
