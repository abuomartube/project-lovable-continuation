import { useState } from "react";
import { Sparkles, ChevronRight, Check, GraduationCap, Plane, Briefcase, MessageCircle, Coffee } from "lucide-react";
import { GradientButton } from "./GradientButton";
import { useOnboarding, type EnglishLevel, type LearningGoal, recommendedRoomIds } from "@/hooks/useOnboarding";

const LEVELS: { id: EnglishLevel; label: string; sub: string }[] = [
  { id: "A1", label: "A1 — Beginner", sub: "Just starting" },
  { id: "A2", label: "A2 — Elementary", sub: "Basic phrases" },
  { id: "B1", label: "B1 — Intermediate", sub: "Everyday topics" },
  { id: "B2", label: "B2 — Upper Int.", sub: "Confident speaker" },
  { id: "C1", label: "C1 — Advanced", sub: "Fluent & nuanced" },
];

const GOALS: { id: LearningGoal; label: string; sub: string; Icon: typeof GraduationCap }[] = [
  { id: "ielts",   label: "IELTS",       sub: "Score 6.5+",          Icon: GraduationCap },
  { id: "fluency", label: "Fluency",     sub: "Speak naturally",     Icon: Sparkles },
  { id: "travel",  label: "Travel",      sub: "Survive abroad",      Icon: Plane },
  { id: "work",    label: "Work",        sub: "Career English",      Icon: Briefcase },
  { id: "casual",  label: "Casual chat", sub: "Make friends",        Icon: Coffee },
];

const MINUTES = [5, 15, 30, 60];

interface Props { onComplete?: (rooms: string[]) => void }

export const OnboardingScreen = ({ onComplete }: Props) => {
  const { complete } = useOnboarding();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [level, setLevel] = useState<EnglishLevel | null>(null);
  const [goal, setGoal] = useState<LearningGoal | null>(null);
  const [minutes, setMinutes] = useState(15);

  const canNext =
    (step === 0 && name.trim().length > 0) ||
    (step === 1 && !!level) ||
    (step === 2 && !!goal) ||
    step === 3;

  const finish = () => {
    if (!level || !goal) return;
    complete({ name: name.trim() || "Friend", level, goal, minutesPerDay: minutes });
    onComplete?.(recommendedRoomIds(level, goal));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-app-dark/90 p-4 backdrop-blur-2xl animate-fade-in">
      <div className="glass relative w-full max-w-md overflow-hidden rounded-3xl p-6">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />

        <div className="relative mb-5 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow">
            <Sparkles className="h-5 w-5 text-white" />
          </span>
          <div>
            <h2 className="text-base font-bold">Welcome to <span className="text-gradient">LEXO</span></h2>
            <p className="text-[11px] text-muted-foreground">Let's personalize your practice</p>
          </div>
        </div>

        {/* Stepper */}
        <div className="relative mb-5 flex gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={
                "h-1.5 flex-1 rounded-full transition-all " +
                (i <= step ? "bg-gradient-primary shadow-glow" : "bg-secondary/60")
              }
            />
          ))}
        </div>

        <div className="relative min-h-[260px]">
          {step === 0 && (
            <div className="animate-fade-in space-y-3">
              <label className="block text-xs font-semibold">What should we call you?</label>
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-2xl border border-glass-border/40 bg-secondary/40 px-4 py-3 text-sm focus:border-primary/60 focus:outline-none"
              />
              <p className="text-[11px] text-muted-foreground">We use this to greet you and on the leaderboard.</p>
            </div>
          )}

          {step === 1 && (
            <div className="animate-fade-in space-y-2">
              <p className="mb-1 text-xs font-semibold">Pick your English level</p>
              {LEVELS.map((l) => {
                const active = level === l.id;
                return (
                  <button
                    key={l.id}
                    onClick={() => setLevel(l.id)}
                    className={
                      "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition-all " +
                      (active
                        ? "border-primary/60 bg-primary/10 shadow-glow"
                        : "border-glass-border/40 bg-secondary/30 hover:border-primary/30")
                    }
                  >
                    <div>
                      <p className="text-sm font-semibold">{l.label}</p>
                      <p className="text-[10px] text-muted-foreground">{l.sub}</p>
                    </div>
                    {active && <Check className="h-4 w-4 text-primary-glow" />}
                  </button>
                );
              })}
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in space-y-2">
              <p className="mb-1 text-xs font-semibold">What's your main goal?</p>
              <div className="grid grid-cols-2 gap-2">
                {GOALS.map((g) => {
                  const active = goal === g.id;
                  return (
                    <button
                      key={g.id}
                      onClick={() => setGoal(g.id)}
                      className={
                        "flex flex-col items-start gap-1.5 rounded-2xl border p-3 text-left transition-all " +
                        (active
                          ? "border-primary/60 bg-primary/10 shadow-glow"
                          : "border-glass-border/40 bg-secondary/30 hover:border-primary/30")
                      }
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-primary text-white">
                        <g.Icon className="h-3.5 w-3.5" />
                      </span>
                      <p className="text-sm font-semibold">{g.label}</p>
                      <p className="text-[10px] text-muted-foreground">{g.sub}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in space-y-3">
              <p className="text-xs font-semibold">Daily practice goal</p>
              <div className="grid grid-cols-4 gap-2">
                {MINUTES.map((m) => {
                  const active = minutes === m;
                  return (
                    <button
                      key={m}
                      onClick={() => setMinutes(m)}
                      className={
                        "rounded-2xl border py-3 text-sm font-bold transition-all " +
                        (active
                          ? "border-primary/60 bg-gradient-primary text-white shadow-glow"
                          : "border-glass-border/40 bg-secondary/30 text-muted-foreground hover:border-primary/30")
                      }
                    >
                      {m}m
                    </button>
                  );
                })}
              </div>
              <div className="rounded-2xl border border-primary/30 bg-primary/5 p-3 text-[11px] text-muted-foreground">
                <p className="mb-1 font-semibold text-foreground">We'll set you up with:</p>
                <ul className="space-y-1">
                  <li className="flex items-center gap-1.5">
                    <MessageCircle className="h-3 w-3 text-primary-glow" />
                    Recommended rooms for your level & goal
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3 text-primary-glow" />
                    Daily speaking topics
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="h-3 w-3 text-primary-glow" />
                    XP, badges & streak tracking
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="relative mt-5 flex items-center justify-between gap-3">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="text-xs text-muted-foreground transition-opacity disabled:opacity-30"
          >
            Back
          </button>
          {step < 3 ? (
            <GradientButton
              onClick={() => canNext && setStep((s) => s + 1)}
              className={"flex items-center gap-1 px-5 py-2.5 text-sm " + (!canNext ? "pointer-events-none opacity-40" : "")}
            >
              Continue <ChevronRight className="h-4 w-4" />
            </GradientButton>
          ) : (
            <GradientButton onClick={finish} className="flex items-center gap-1 px-5 py-2.5 text-sm">
              Start practicing <ChevronRight className="h-4 w-4" />
            </GradientButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen;
