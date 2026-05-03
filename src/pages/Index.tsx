import { ReactNode } from "react";
import { Sparkles, MessageCircle, Mic, Languages, Trophy, User, ArrowLeft, Lightbulb, Snowflake, RotateCw, Image as ImageIcon } from "lucide-react";
import { MobileFrame } from "@/components/lexo/MobileFrame";
import { ChatScreen } from "@/components/lexo/ChatScreen";
import { RoomSelectionScreen } from "@/components/lexo/RoomSelectionScreen";
import { RoomDetailsScreen } from "@/components/lexo/RoomDetailsScreen";
import { VoiceOnlyScreen } from "@/components/lexo/VoiceOnlyScreen";
import { TopicGeneratorScreen } from "@/components/lexo/TopicGeneratorScreen";
import { ProfileScreen } from "@/components/lexo/ProfileScreen";
import { LeaderboardScreen } from "@/components/lexo/LeaderboardScreen";
import { SettingsScreen } from "@/components/lexo/SettingsScreen";
import { CourseSelectionScreen } from "@/components/lexo/CourseSelectionScreen";

const features = [
  { t: "غرف محادثة متعددة", d: "اختر الغرفة المناسبة لمستواك", Icon: MessageCircle },
  { t: "محادثة نصية وصوتية", d: "تواصل بحرية عبر النص أو الصوت", Icon: Mic },
  { t: "وضع إنجليزي فقط", d: "بيئة تعليمية تركز على اللغة", Icon: Languages },
  { t: "مواضيع تفاعلية", d: "أسئلة، تحدي الجليد والمزيد", Icon: Lightbulb },
  { t: "تحديات ولوحة متصدرين", d: "اكسب النقاط وارتقِ بالمستويات", Icon: Trophy },
  { t: "ملف شخصي متكامل", d: "تابع تقدمك وإحصاءاتك", Icon: User },
];

const levels = [
  { code: "A1", label: "Beginner" },
  { code: "A2", label: "Elementary" },
  { code: "B1", label: "Intermediate" },
  { code: "B1+", label: "Upper Intermediate" },
  { code: "C1", label: "Advanced" },
];

const Arrow = () => (
  <div className="hidden flex-col items-center justify-center self-center xl:flex">
    <div className="h-px w-12 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
    <ArrowLeft className="-mt-2 h-5 w-5 rotate-180 text-primary-glow drop-shadow-[0_0_8px_hsl(var(--primary)/0.8)]" />
  </div>
);

const FloatingFrame = ({
  children,
  label,
  caption,
  highlight,
  size = "md",
}: {
  children: ReactNode;
  label?: string;
  caption?: string;
  highlight?: boolean;
  size?: "sm" | "md";
}) => (
  <div className="group flex flex-col items-center gap-3">
    {label && (
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-primary text-[10px] font-bold text-white shadow-glow">
          {label}
        </span>
        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          {caption}
        </span>
      </div>
    )}
    <div
      className={
        "relative transition-transform duration-500 group-hover:-translate-y-1 " +
        (highlight ? "drop-shadow-[0_0_45px_hsl(var(--primary)/0.45)]" : "")
      }
    >
      <div className="absolute -bottom-6 left-1/2 h-8 w-[80%] -translate-x-1/2 rounded-[50%] bg-black/70 blur-2xl" />
      {highlight && (
        <div className="absolute -inset-3 -z-10 rounded-[3rem] bg-gradient-primary opacity-30 blur-2xl" />
      )}
      <MobileFrame size={size}>{children}</MobileFrame>
    </div>
    {!label && caption && (
      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {caption}
      </span>
    )}
  </div>
);

const ToolsCard = () => {
  const tools = [
    { label: "Topic", Icon: Lightbulb, tint: "text-primary-glow bg-primary/15" },
    { label: "Ice Breaker", Icon: Snowflake, tint: "text-cyan-400 bg-cyan-400/15" },
    { label: "Rotate", Icon: RotateCw, tint: "text-emerald-400 bg-emerald-400/15" },
    { label: "Image Talk", Icon: ImageIcon, tint: "text-pink-400 bg-pink-400/15" },
  ];
  return (
    <div className="flex w-[260px] flex-col gap-3">
      <span className="text-center text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        Toolbar
      </span>
      <div className="glass rounded-3xl p-4">
        <div className="grid grid-cols-2 gap-2.5">
          {tools.map((t) => (
            <div key={t.label} className="flex flex-col items-center gap-1.5 rounded-2xl border border-glass-border/30 bg-secondary/30 p-3">
              <span className={`flex h-9 w-9 items-center justify-center rounded-full ${t.tint}`}>
                <t.Icon className="h-4 w-4" />
              </span>
              <span className="text-[10px] font-medium">{t.label}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-center gap-3 rounded-2xl border border-glass-border/30 bg-secondary/30 p-3">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="w-0.5 rounded-full bg-primary/50" style={{ height: `${4 + Math.abs(Math.sin(i)) * 14}px` }} />
            ))}
          </div>
          <button className="animate-mic-pulse flex h-12 w-12 items-center justify-center rounded-full bg-gradient-mic shadow-mic">
            <Mic className="h-5 w-5 text-white" />
          </button>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="w-0.5 rounded-full bg-primary/50" style={{ height: `${4 + Math.abs(Math.cos(i)) * 14}px` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0">
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 80% 50% at 50% 0%, hsl(258 60% 22% / 0.65) 0%, hsl(230 40% 6%) 60%)" }}
        />
        <div className="absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/15 blur-[160px]" />
        <div className="absolute top-1/3 right-0 h-[600px] w-[600px] rounded-full bg-accent/15 blur-[180px]" />
        <div className="absolute bottom-0 left-1/3 h-[450px] w-[450px] rounded-full bg-primary-glow/10 blur-[160px]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1800px] gap-8 px-6 py-12 lg:px-10">
        {/* LEFT SIDEBAR */}
        <aside className="hidden w-[280px] shrink-0 space-y-5 lg:block">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-glass-border/40 bg-secondary/40 px-2.5 py-0.5 text-[10px] text-muted-foreground backdrop-blur">
              <Sparkles className="h-3 w-3 text-primary" /> v1.0
            </div>
            <h1 className="text-4xl font-bold tracking-tight">
              <span className="text-gradient">LEXO</span> Chat
            </h1>
            <p className="mt-1 text-xs font-medium text-muted-foreground">English Practice Community</p>
            <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
              منصة تفاعلية لممارسة اللغة الإنجليزية عبر الشات الصوتي والكتابي مع متعلمين من جميع أنحاء العالم.
            </p>
          </div>

          <div className="glass rounded-2xl p-4">
            <h3 className="mb-3 text-xs font-bold">المميزات الرئيسية</h3>
            <div className="space-y-2.5">
              {features.map((f) => (
                <div key={f.t} className="flex items-start gap-2.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary-glow">
                    <f.Icon className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold">{f.t}</p>
                    <p className="text-[10px] text-muted-foreground">{f.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-4">
            <h3 className="mb-3 text-xs font-bold">مستويات اللغة</h3>
            <div className="space-y-1.5">
              {levels.map((l) => (
                <div key={l.code} className="flex items-center gap-2 text-[11px]">
                  <span className="flex h-6 w-7 items-center justify-center rounded-md bg-gradient-primary text-[9px] font-bold text-white shadow-glow">
                    {l.code}
                  </span>
                  <span className="text-muted-foreground">{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-4">
            <h3 className="mb-3 text-xs font-bold">باقاتنا التدريبية</h3>
            <div className="space-y-3 text-[11px]">
              <div>
                <p className="mb-1 text-[9px] font-bold tracking-wider text-primary-glow">LEXO FOR ENGLISH</p>
                <ul className="space-y-0.5 text-muted-foreground">
                  <li>A1 → B1</li>
                  <li>B1+ → C1</li>
                  <li>A1 → C1</li>
                </ul>
              </div>
              <div>
                <p className="mb-1 text-[9px] font-bold tracking-wider text-primary-glow">LEXO FOR IELTS</p>
                <ul className="space-y-0.5 text-muted-foreground">
                  <li>Lexo for Intro</li>
                  <li>Lexo for Advanced</li>
                  <li>Lexo for All-in-one</li>
                </ul>
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT BOARD */}
        <main className="min-w-0 flex-1 space-y-16">
          <section>
            <div className="mb-6 flex items-end justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-glow">User Flow</p>
                <h2 className="mt-1 text-2xl font-bold">Main Screens</h2>
              </div>
              <p className="hidden text-xs text-muted-foreground md:block">Onboarding → Chat experience</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-12">
              <FloatingFrame label="1" caption="Course Selection"><CourseSelectionScreen /></FloatingFrame>
              <Arrow />
              <FloatingFrame label="2" caption="Room Selection"><RoomSelectionScreen /></FloatingFrame>
              <Arrow />
              <FloatingFrame label="3" caption="Room Details"><RoomDetailsScreen /></FloatingFrame>
              <Arrow />
              <FloatingFrame label="4" caption="Chat Screen" highlight><ChatScreen /></FloatingFrame>
            </div>
          </section>

          <section>
            <div className="mb-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-glow">Supporting</p>
              <h2 className="mt-1 text-2xl font-bold">Secondary Screens</h2>
            </div>

            <div className="flex flex-wrap items-start justify-center gap-6">
              <FloatingFrame size="sm" caption="Voice Room"><VoiceOnlyScreen /></FloatingFrame>
              <FloatingFrame size="sm" caption="Topic Generator"><TopicGeneratorScreen /></FloatingFrame>
              <FloatingFrame size="sm" caption="Profile"><ProfileScreen /></FloatingFrame>
              <FloatingFrame size="sm" caption="Leaderboard"><LeaderboardScreen /></FloatingFrame>
              <FloatingFrame size="sm" caption="Settings"><SettingsScreen /></FloatingFrame>
              <ToolsCard />
            </div>
          </section>

          <footer className="pt-4 text-center text-[10px] text-muted-foreground">
            LEXO Chat · Product Showcase · © 2026
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Index;
