import { ChevronLeft, Mic, FileText, Download, Heart, Smile, Paperclip, Send, Lightbulb, Snowflake, RotateCw, Image as ImageIcon, VolumeX, Volume2, GraduationCap, Megaphone, Pin, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { MessageSkeleton } from "./Skeleton";
import { Avatar } from "./Avatar";
import { ChatBubble, type Correction } from "./ChatBubble";
import { VoiceBubble } from "./VoiceBubble";
import { IconButton } from "./IconButton";
import { PushToTalk } from "./PushToTalk";
import { SpeakingIndicator } from "./SpeakingIndicator";
import { TypingIndicator } from "./TypingIndicator";
import { PresenceToasts } from "./PresenceToasts";
import { RaiseHandButton } from "./RaiseHandButton";
import { CorrectionDialog } from "./CorrectionDialog";
import { useVoice } from "@/hooks/useVoice";
import { useGamification } from "@/hooks/useGamification";
import { useLivePresence } from "@/hooks/useLivePresence";
import { useRole } from "@/hooks/useRole";
import { containsArabic, arabicRatio } from "@/lib/language";
import { AlertTriangle } from "lucide-react";
import cafeImg from "@/assets/cafe.jpg";
import { SUGGESTED_PROMPTS, ICE_BREAKERS, QUESTIONS, pickDailyTopic } from "@/lib/prompts";
import { pickRandom } from "@/lib/topics";

interface TextMsg {
  id: string;
  author: string;
  authorRole: "student" | "teacher";
  text: string;
  time: string;
  reactions?: { emoji: string; count: number }[];
  side?: "left" | "right";
  highlight?: boolean;
  pinned?: boolean;
  broadcast?: boolean;
  correction?: Correction;
}

const SEED_MESSAGES: TextMsg[] = [
  { id: "m1", author: "Omar",  authorRole: "student", text: "Hi everyone! 👋\nHow was your weekend?", time: "10:20 AM", reactions: [{ emoji: "❤️", count: 2 }] },
  { id: "m2", author: "Sara",  authorRole: "student", text: "It was great! I went hiking\nwith my friends 😊", time: "10:21 AM", reactions: [{ emoji: "❤️", count: 1 }] },
  { id: "m3", author: "Ms. Reem", authorRole: "teacher", text: "Welcome everyone! Let's start with introductions.", time: "10:24 AM" },
];

export const ChatScreen = () => {
  const [autoDuck, setAutoDuck] = useState(true);
  const [draft, setDraft] = useState("");
  const { award } = useGamification();
  const { isTeacher, toggle: toggleRole } = useRole();
  const [messages, setMessages] = useState<TextMsg[]>(SEED_MESSAGES);
  const [correcting, setCorrecting] = useState<TextMsg | null>(null);
  const [broadcasting, setBroadcasting] = useState(false);
  const [broadcastText, setBroadcastText] = useState("");

  const updateMsg = (id: string, patch: Partial<TextMsg>) =>
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));

  const pinned = messages.find((m) => m.pinned);

  // Auto-post today's topic as a system message when the room opens
  const seededTopic = useRef(false);
  useEffect(() => {
    if (seededTopic.current) return;
    seededTopic.current = true;
    const topic = pickDailyTopic();
    const time = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    setMessages((prev) => [
      {
        id: "system-daily-topic",
        author: "Room",
        authorRole: "teacher",
        text: `Today's topic: ${topic.text}`,
        time,
        broadcast: true,
      },
      ...prev,
    ]);
  }, []);
  const { level, speakers, pttActive, error, startTalking, stopTalking } = useVoice({
    roomId: "speaking-intermediate",
    identity: { id: "me", name: "You" },
    autoDuckOthers: autoDuck,
  });

  // Award XP on room join (mount once)
  const joined = useRef(false);
  useEffect(() => { if (!joined.current) { joined.current = true; award({ type: "join-room" }); } }, [award]);

  const [xpBurst, setXpBurst] = useState<{ id: number; amount: number } | null>(null);
  const burstId = useRef(0);
  const triggerXpBurst = useCallback((amount: number) => {
    burstId.current += 1;
    const id = burstId.current;
    setXpBurst({ id, amount });
    setTimeout(() => {
      setXpBurst((b) => (b && b.id === id ? null : b));
    }, 1100);
  }, []);

  // Award XP for time held on PTT
  const pttStartRef = useRef<number | null>(null);
  useEffect(() => {
    if (pttActive) pttStartRef.current = performance.now();
    else if (pttStartRef.current != null) {
      const seconds = Math.round((performance.now() - pttStartRef.current) / 1000);
      pttStartRef.current = null;
      if (seconds > 0) {
        award({ type: "speak", seconds });
        award({ type: "voice-message" });
        triggerXpBurst(20);
      }
    }
  }, [pttActive, award, triggerXpBurst]);

  const sendMessage = () => {
    const text = draft.trim();
    if (!text) return;
    if (containsArabic(text)) {
      setLangWarning(true);
      return;
    }
    const time = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    setMessages((prev) => [...prev, {
      id: `me-${Date.now()}`,
      author: isTeacher ? "Ms. Reem" : "You",
      authorRole: isTeacher ? "teacher" : "student",
      text,
      time,
      side: "right",
    }]);
    award({ type: "message", chars: text.length });
    triggerXpBurst(10);
    setDraft("");
    setLangWarning(false);
  };

  const sendBroadcast = () => {
    const text = broadcastText.trim();
    if (!text || !isTeacher) return;
    const time = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    setMessages((prev) => [...prev, {
      id: `bc-${Date.now()}`,
      author: "Ms. Reem",
      authorRole: "teacher",
      text,
      time,
      broadcast: true,
    }]);
    setBroadcastText("");
    setBroadcasting(false);
  };

  const { online, typing, events } = useLivePresence(18);

  const [langWarning, setLangWarning] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(t);
  }, []);
  const arabicNow = containsArabic(draft);
  const ratio = arabicRatio(draft);

  return (
    <>
    <div className="relative flex h-full flex-col">
      <PresenceToasts events={events} />
      {/* Header */}
      <div className="flex items-center justify-between border-b border-glass-border/40 bg-card/60 px-4 pb-3 pt-10 backdrop-blur-xl">
        <IconButton variant="ghost" size="sm">
          <ChevronLeft className="h-5 w-5" />
        </IconButton>
        <div className="flex flex-1 flex-col items-center">
          <h2 className="text-sm font-semibold">Speaking Room — Intermediate</h2>
          <div className="mt-1 flex items-center gap-2">
            <span className="flex items-center gap-1 text-[10px] text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-soft-pulse" />
              <span key={online} className="inline-block animate-fade-in tabular-nums">{online}</span> online
            </span>
            <div className="flex -space-x-1.5">
              {["Sara", "Omar", "Lina"].map((n) => (
                <Avatar key={n} name={n} size="xs" />
              ))}
              <span className="ml-2 rounded-full bg-secondary/60 px-1.5 py-0.5 text-[9px] text-muted-foreground">
                +13
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={toggleRole}
          title="Toggle role (demo)"
          className={
            "press flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide transition-all " +
            (isTeacher
              ? "bg-gradient-to-r from-amber-400 to-orange-500 text-amber-950 shadow-[0_0_14px_hsl(35_95%_55%/0.5)]"
              : "border border-glass-border/40 bg-secondary/50 text-muted-foreground")
          }
        >
          <GraduationCap className="h-3 w-3" />
          {isTeacher ? "Teacher" : "Student"}
        </button>
      </div>

      {/* Pinned banner */}
      {pinned && (
        <div className="flex items-center gap-2 border-b border-primary/30 bg-primary/5 px-4 py-2 text-[11px] animate-fade-in">
          <Pin className="h-3 w-3 text-primary-glow" />
          <span className="font-semibold text-primary-glow">Pinned</span>
          <span className="truncate text-muted-foreground">— {pinned.author}: {pinned.text}</span>
          {isTeacher && (
            <button
              onClick={() => updateMsg(pinned.id, { pinned: false })}
              className="ml-auto rounded-full p-1 text-muted-foreground hover:bg-white/5"
              title="Unpin"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      )}

      {/* Control Bar */}
      <div className="flex items-center justify-between gap-2 border-b border-glass-border/30 bg-card/40 px-4 py-2.5">
        <span className="flex items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-1 text-[10px] font-semibold text-success">
          <span className="rounded-md bg-success/20 px-1 py-0.5 text-[9px]">EN</span>
          English Only
        </span>
        <SpeakingIndicator speakers={speakers} />
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setAutoDuck((v) => !v)}
            title="Auto-mute others while you speak"
            className={
              "flex h-8 w-8 items-center justify-center rounded-full border border-glass-border/40 transition-colors " +
              (autoDuck ? "bg-primary/20 text-primary-glow" : "bg-secondary/60 text-muted-foreground")
            }
          >
            {autoDuck ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
          </button>
          <RaiseHandButton variant="pill" label="Raise Hand" raisedCount={1} />
        </div>
      </div>

      {/* Suggested prompts strip */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-glass-border/30 bg-card/30 px-3 py-2">
        <span className="shrink-0 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
          Try saying
        </span>
        {SUGGESTED_PROMPTS.map((p) => (
          <button
            key={p}
            onClick={() => setDraft(p)}
            className="press shrink-0 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] text-primary-glow hover:bg-primary/15"
          >
            “{p}”
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-y-auto px-3 py-4">
        {loading ? (
          <div className="space-y-3">
            <MessageSkeleton side="left" />
            <MessageSkeleton side="left" />
            <MessageSkeleton side="right" />
            <MessageSkeleton side="left" />
          </div>
        ) : (
          <>
        {messages.map((m) => (
          <ChatBubble
            key={m.id}
            author={m.author}
            authorRole={m.authorRole}
            text={m.text}
            time={m.time}
            side={m.side}
            reactions={m.reactions}
            highlight={m.highlight}
            pinned={m.pinned}
            broadcast={m.broadcast}
            correction={m.correction}
            isTeacherViewer={isTeacher && m.authorRole === "student" && m.side !== "right"}
            onCorrect={() => setCorrecting(m)}
            onTogglePin={() => setMessages((prev) => prev.map((x) =>
              x.id === m.id ? { ...x, pinned: !x.pinned } : { ...x, pinned: false }
            ))}
            onToggleHighlight={() => updateMsg(m.id, { highlight: !m.highlight })}
          />
        ))}

        {/* You: Voice */}
        <VoiceBubble duration="0:18" time="10:22 AM" side="right" />

        {/* James: File message */}
        <div className="flex w-full gap-2 animate-bubble-in-l">
          <Avatar name="James" size="sm" />
          <div className="flex max-w-[75%] flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">James</span>
            <div className="flex items-center gap-3 rounded-2xl rounded-tl-md bubble-in px-3 py-2.5 transition-all hover:-translate-y-0.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-[0_0_18px_hsl(0_75%_55%/0.4)]">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">Useful Phrases.pdf</p>
                <p className="text-[10px] text-muted-foreground">1.2 MB</p>
              </div>
              <button className="press flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-primary hover:bg-primary/25">
                <Download className="h-3.5 w-3.5" />
              </button>
            </div>
            <span className="text-[10px] text-muted-foreground">10:23 AM</span>
          </div>
        </div>

        {/* Lina: Image with caption */}
        <div className="flex w-full gap-2 animate-bubble-in-l">
          <Avatar name="Lina" size="sm" />
          <div className="flex max-w-[78%] flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">Lina</span>
            <div className="overflow-hidden rounded-2xl rounded-tl-md bubble-in transition-all hover:-translate-y-0.5">
              <img
                src={cafeImg}
                alt="Cozy cafe"
                loading="lazy"
                width={768}
                height={512}
                className="h-36 w-full object-cover"
              />
              <p className="px-3 py-2 text-sm">Let's talk about this picture! ☕</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <span>10:28 AM</span>
              <span className="flex items-center gap-1 rounded-full bg-secondary/60 px-1.5 py-0.5">
                <Heart className="h-2.5 w-2.5 fill-rose-500 text-rose-500" /> 3
              </span>
            </div>
          </div>
        </div>

        {/* System (amber) */}
        <div className="bubble-system mx-auto max-w-[85%] animate-fade-in rounded-2xl px-3 py-2 text-center text-[11px]">
          <span className="font-semibold">System:</span> Please try to use English only 😊
        </div>

        <TypingIndicator users={typing} />
          </>
        )}
      </div>

      {/* Bottom Action chips */}
      <div className="border-t border-glass-border/40 bg-card/60 px-3 pb-2 pt-3 backdrop-blur-xl">
        {isTeacher && (
          <div className="mb-2.5 animate-fade-in">
            {!broadcasting ? (
              <button
                onClick={() => setBroadcasting(true)}
                className="press flex w-full items-center justify-center gap-2 rounded-2xl border border-amber-400/40 bg-amber-400/10 px-3 py-2 text-xs font-semibold text-amber-200 hover:bg-amber-400/15"
              >
                <Megaphone className="h-3.5 w-3.5" /> Broadcast to room
              </button>
            ) : (
              <div className="flex items-center gap-2 rounded-2xl border border-amber-400/40 bg-amber-400/10 p-2">
                <Megaphone className="h-4 w-4 shrink-0 text-amber-300" />
                <input
                  autoFocus
                  value={broadcastText}
                  onChange={(e) => setBroadcastText(e.target.value.slice(0, 240))}
                  onKeyDown={(e) => { if (e.key === "Enter") sendBroadcast(); }}
                  placeholder="Announce something to everyone..."
                  className="flex-1 bg-transparent text-xs text-amber-50 placeholder:text-amber-200/50 focus:outline-none"
                />
                <button
                  onClick={sendBroadcast}
                  className="press rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-1 text-[10px] font-bold text-amber-950"
                >
                  Send
                </button>
                <button
                  onClick={() => { setBroadcasting(false); setBroadcastText(""); }}
                  className="rounded-full p-1 text-amber-200 hover:bg-white/5"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        )}

        <div className="mb-2.5 flex items-center justify-between gap-2">
          {[
            { label: "Topic", Icon: Lightbulb, tint: "text-primary-glow", bg: "bg-primary/15" },
            { label: "Ice Breaker", Icon: Snowflake, tint: "text-cyan-400", bg: "bg-cyan-400/15" },
            { label: "Rotate", Icon: RotateCw, tint: "text-emerald-400", bg: "bg-emerald-400/15" },
            { label: "Image Talk", Icon: ImageIcon, tint: "text-pink-400", bg: "bg-pink-400/15" },
          ].map(({ label, Icon, tint, bg }) => (
            <button
              key={label}
              className="press flex flex-1 flex-col items-center gap-1 rounded-2xl border border-glass-border/40 bg-secondary/30 px-2 py-2 text-[10px] text-muted-foreground hover:bg-secondary/60 hover:-translate-y-0.5 hover:border-primary/30"
            >
              <span className={`flex h-7 w-7 items-center justify-center rounded-full ${bg} ${tint}`}>
                <Icon className="h-3.5 w-3.5" />
              </span>
              {label}
            </button>
          ))}
        </div>

        {/* Input */}
        {(langWarning || arabicNow) && (
          <div
            role="alert"
            className="mb-2 flex animate-fade-in items-center gap-2 rounded-2xl border border-amber-400/40 bg-amber-400/10 px-3 py-2 text-[11px] text-amber-200 shadow-[0_0_18px_hsl(40_90%_55%/0.2)]"
          >
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            <span className="flex-1">
              <strong className="font-semibold">Try in English.</strong>{" "}
              {ratio > 0.5
                ? "This room is English Only — practice helps you progress faster."
                : "We detected Arabic letters. Switch to English to keep practicing."}
            </span>
            <button
              onClick={() => { setDraft(""); setLangWarning(false); }}
              className="rounded-full bg-amber-400/20 px-2 py-0.5 text-[10px] font-semibold text-amber-100 hover:bg-amber-400/30"
            >
              Clear
            </button>
          </div>
        )}
        <div className="flex items-center gap-2">
          <button className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:text-foreground">
            <Smile className="h-5 w-5" />
          </button>
          <div
            className={
              "flex h-11 flex-1 items-center gap-2 rounded-full border bg-secondary/50 px-4 transition-colors " +
              (arabicNow
                ? "border-amber-400/60 shadow-[0_0_18px_hsl(40_90%_55%/0.25)]"
                : "border-glass-border/40")
            }
          >
            <input
              value={draft}
              onChange={(e) => { setDraft(e.target.value); if (langWarning) setLangWarning(false); }}
              onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
              placeholder="Type a message..."
              className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
            />
            <Paperclip className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="relative">
            <button
              onClick={sendMessage}
              className="press flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary text-white shadow-glow"
            >
              <Send className="h-4 w-4" />
            </button>
            {xpBurst && (
              <span
                key={xpBurst.id}
                className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 animate-xp-burst rounded-full bg-gradient-primary px-2 py-0.5 text-[10px] font-bold text-white shadow-glow"
              >
                +{xpBurst.amount} XP
              </span>
            )}
          </div>
        </div>

        <div className="mt-3">
          <PushToTalk
            level={level}
            active={pttActive}
            onStart={startTalking}
            onStop={stopTalking}
            error={error}
          />
        </div>
      </div>
    </div>
    <CorrectionDialog
      open={!!correcting}
      original={correcting?.text ?? ""}
      author={correcting?.author ?? ""}
      onCancel={() => setCorrecting(null)}
      onSave={(corrected, note) => {
        if (!correcting) return;
        updateMsg(correcting.id, {
          correction: { original: correcting.text, corrected, note, by: "Ms. Reem" },
        });
        setCorrecting(null);
      }}
    />
    </>
  );
};

export default ChatScreen;