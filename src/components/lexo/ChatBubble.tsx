import { cn } from "@/lib/utils";
import { Avatar } from "./Avatar";
import { GraduationCap, Pin, Megaphone, CheckCircle2, Sparkles, Pencil, MoreHorizontal, Lightbulb, Wand2, Loader2 } from "lucide-react";
import { useState } from "react";
import type { SentenceAnalysis } from "@/hooks/useSentenceAnalysis";

export interface Correction {
  original: string;
  corrected: string;
  note?: string;
  by?: string;
}

interface ChatBubbleProps {
  author: string;
  text: string;
  time: string;
  side?: "left" | "right";
  reactions?: { emoji: string; count: number }[];
  avatarSrc?: string;
  authorRole?: "student" | "teacher";
  highlight?: boolean;        // teacher-highlighted message
  pinned?: boolean;
  broadcast?: boolean;        // big "broadcast to room" banner-style
  correction?: Correction;
  // Smart learning layer (AI suggestions for student's own messages)
  learning?: SentenceAnalysis | null;
  learningLoading?: boolean;
  onApplyImproved?: (improved: string) => void;
  // Teacher controls (only rendered when isTeacherViewer + author is student)
  isTeacherViewer?: boolean;
  onTogglePin?: () => void;
  onToggleHighlight?: () => void;
  onCorrect?: () => void;
}

const RoleBadge = ({ role }: { role: "student" | "teacher" }) =>
  role === "teacher" ? (
    <span className="inline-flex items-center gap-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-amber-950 shadow-[0_0_10px_hsl(35_95%_55%/0.45)]">
      <GraduationCap className="h-2.5 w-2.5" /> Teacher
    </span>
  ) : (
    <span className="inline-flex items-center gap-0.5 rounded-full border border-glass-border/40 bg-secondary/50 px-1.5 py-0.5 text-[8px] font-medium uppercase tracking-wide text-muted-foreground">
      Student
    </span>
  );

export const ChatBubble = ({
  author, text, time, side = "left", reactions, avatarSrc,
  authorRole = "student", highlight, pinned, broadcast, correction,
  learning, learningLoading, onApplyImproved,
  isTeacherViewer, onTogglePin, onToggleHighlight, onCorrect,
}: ChatBubbleProps) => {
  const isMe = side === "right";
  const [hover, setHover] = useState(false);

  if (broadcast) {
    return (
      <div className="mx-auto w-full max-w-[92%] animate-bubble-in-l">
        <div className="relative overflow-hidden rounded-[20px] border border-amber-400/40 bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-transparent px-4 py-3 shadow-[0_0_24px_hsl(35_95%_55%/0.25)]">
          <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-amber-400/20 blur-2xl" />
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-amber-950 shadow-glow">
              <Megaphone className="h-4 w-4" />
            </span>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">Broadcast</span>
                <RoleBadge role="teacher" />
                <span className="ml-auto text-[10px] text-muted-foreground">{time}</span>
              </div>
              <p className="mt-1 text-sm font-semibold text-amber-50">{text}</p>
              <p className="mt-0.5 text-[10px] text-amber-200/70">— {author}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={cn(
        "group flex w-full gap-2",
        isMe ? "flex-row-reverse animate-bubble-in-r" : "flex-row animate-bubble-in-l",
      )}
    >
      {!isMe && <Avatar name={author} size="sm" src={avatarSrc} />}
      <div className={cn("flex max-w-[78%] flex-col gap-1", isMe && "items-end")}>
        {!isMe && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">{author}</span>
            <RoleBadge role={authorRole} />
            {pinned && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-primary/15 px-1.5 py-0.5 text-[8px] font-semibold text-primary-glow">
                <Pin className="h-2.5 w-2.5" /> Pinned
              </span>
            )}
          </div>
        )}

        <div className="relative">
          <div
            className={cn(
              "whitespace-pre-line rounded-[20px] px-3.5 py-2.5 text-sm transition-all hover:scale-[1.005] hover:-translate-y-0.5",
              isMe ? "rounded-br-md bubble-out" : "rounded-tl-md bubble-in",
              authorRole === "teacher" && !isMe && "border border-amber-400/40 bg-amber-400/10 shadow-[0_0_18px_hsl(35_95%_55%/0.18)]",
              highlight && "ring-2 ring-primary/60 shadow-glow",
              pinned && "ring-1 ring-primary/40",
            )}
          >
            {text}
          </div>

          {/* Teacher quick-actions */}
          {isTeacherViewer && !isMe && hover && (
            <div className={cn(
              "absolute -top-3 right-2 z-10 flex items-center gap-1 rounded-full border border-glass-border/40 bg-card/90 px-1 py-0.5 shadow-deep backdrop-blur-xl animate-fade-in",
            )}>
              <button
                onClick={onCorrect}
                title="Correct sentence"
                className="press flex h-6 w-6 items-center justify-center rounded-full text-emerald-300 hover:bg-emerald-400/15"
              >
                <Pencil className="h-3 w-3" />
              </button>
              <button
                onClick={onToggleHighlight}
                title={highlight ? "Remove highlight" : "Highlight"}
                className={cn("press flex h-6 w-6 items-center justify-center rounded-full hover:bg-primary/15",
                  highlight ? "text-primary-glow" : "text-muted-foreground")}
              >
                <Sparkles className="h-3 w-3" />
              </button>
              <button
                onClick={onTogglePin}
                title={pinned ? "Unpin" : "Pin"}
                className={cn("press flex h-6 w-6 items-center justify-center rounded-full hover:bg-primary/15",
                  pinned ? "text-primary-glow" : "text-muted-foreground")}
              >
                <Pin className="h-3 w-3" />
              </button>
              <span className="px-0.5 text-muted-foreground"><MoreHorizontal className="h-3 w-3" /></span>
            </div>
          )}
        </div>

        {/* Correction panel */}
        {correction && (
          <div className="animate-fade-in mt-1 rounded-2xl border border-emerald-400/40 bg-emerald-400/10 px-3 py-2 text-xs shadow-[0_0_18px_hsl(150_70%_45%/0.18)]">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
              <CheckCircle2 className="h-3 w-3" /> Correction
              {correction.by && <span className="ml-1 font-normal normal-case text-emerald-200/70">by {correction.by}</span>}
            </div>
            <p className="mt-1 text-emerald-50/90">
              <span className="text-emerald-200/60 line-through">{correction.original}</span>
              <span className="mx-1.5 text-emerald-300">→</span>
              <span className="font-semibold text-emerald-50">{correction.corrected}</span>
            </p>
            {correction.note && (
              <p className="mt-1 text-[10px] text-emerald-200/70">💡 {correction.note}</p>
            )}
          </div>
        )}

        {/* Smart learning suggestions (student self-feedback) */}
        {(learning || learningLoading) && (
          <div className={cn("mt-1 w-full", isMe && "flex justify-end")}>
            {learningLoading && !learning && (
              <div className="inline-flex items-center gap-1.5 rounded-full border border-glass-border/40 bg-secondary/40 px-2.5 py-1 text-[10px] text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" /> Checking your sentence...
              </div>
            )}
            {learning && (
              <div className="animate-fade-in max-w-full rounded-2xl border border-primary/30 bg-primary/5 px-3 py-2 text-xs shadow-[0_0_16px_hsl(250_80%_60%/0.15)]">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-primary-glow">
                  <Sparkles className="h-3 w-3" /> Smart suggestion
                </div>

                {learning.mistakes && learning.mistakes.length > 0 ? (
                  <p className={cn("mt-1 leading-snug", isMe ? "text-right" : "text-left")}>
                    {renderHighlighted(text, learning.mistakes)}
                  </p>
                ) : null}

                {learning.corrected && learning.corrected.trim() !== text.trim() && (
                  <p className="mt-1 text-foreground/90">
                    <span className="text-muted-foreground line-through">{text}</span>
                    <span className="mx-1.5 text-primary-glow">→</span>
                    <span className="font-medium">{learning.corrected}</span>
                  </p>
                )}

                {learning.mistakes && learning.mistakes.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {learning.mistakes.map((m, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 rounded-full border border-rose-400/30 bg-rose-400/10 px-1.5 py-0.5 text-[9px] text-rose-200"
                      >
                        <span className="line-through opacity-70">{m.wrong}</span>
                        <span className="opacity-50">→</span>
                        <span className="font-semibold">{m.right}</span>
                        <span className="ml-0.5 rounded-sm bg-rose-400/20 px-1 text-[8px] uppercase tracking-wide">
                          {m.type}
                        </span>
                      </span>
                    ))}
                  </div>
                )}

                {learning.hint && (
                  <p className="mt-1.5 flex items-start gap-1 text-[11px] text-amber-200/90">
                    <Lightbulb className="mt-0.5 h-3 w-3 shrink-0 text-amber-300" />
                    <span>{learning.hint}</span>
                  </p>
                )}

                {learning.improved && learning.improved.trim() !== text.trim() && onApplyImproved && (
                  <button
                    onClick={() => onApplyImproved(learning.improved)}
                    className="press mt-2 inline-flex items-center gap-1.5 rounded-full bg-gradient-primary px-2.5 py-1 text-[10px] font-semibold text-white shadow-glow"
                  >
                    <Wand2 className="h-3 w-3" /> Improve sentence
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        <div className={cn("flex items-center gap-2 text-[10px] text-muted-foreground", isMe && "flex-row-reverse")}>
          <span>{time}</span>
          {reactions?.map((r, i) => (
            <span key={i} className="rounded-full bg-secondary/60 px-1.5 py-0.5">
              {r.emoji} {r.count}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
