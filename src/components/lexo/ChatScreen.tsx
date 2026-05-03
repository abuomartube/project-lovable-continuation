import { ChevronLeft, MoreVertical, Hand, Mic, FileText, Download, Heart, Smile, Paperclip, Send, Lightbulb, Snowflake, RotateCw, Image as ImageIcon, VolumeX, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Avatar } from "./Avatar";
import { ChatBubble } from "./ChatBubble";
import { VoiceBubble } from "./VoiceBubble";
import { IconButton } from "./IconButton";
import { PushToTalk } from "./PushToTalk";
import { SpeakingIndicator } from "./SpeakingIndicator";
import { useVoice } from "@/hooks/useVoice";
import { useGamification } from "@/hooks/useGamification";
import cafeImg from "@/assets/cafe.jpg";

export const ChatScreen = () => {
  const [autoDuck, setAutoDuck] = useState(true);
  const [draft, setDraft] = useState("");
  const { award } = useGamification();
  const { level, speakers, pttActive, error, startTalking, stopTalking } = useVoice({
    roomId: "speaking-intermediate",
    identity: { id: "me", name: "You" },
    autoDuckOthers: autoDuck,
  });

  // Award XP on room join (mount once)
  const joined = useRef(false);
  useEffect(() => { if (!joined.current) { joined.current = true; award({ type: "join-room" }); } }, [award]);

  // Award XP for time held on PTT
  const pttStartRef = useRef<number | null>(null);
  useEffect(() => {
    if (pttActive) pttStartRef.current = performance.now();
    else if (pttStartRef.current != null) {
      const seconds = Math.round((performance.now() - pttStartRef.current) / 1000);
      pttStartRef.current = null;
      if (seconds > 0) award({ type: "speak", seconds });
    }
  }, [pttActive, award]);

  const sendMessage = () => {
    const text = draft.trim();
    if (!text) return;
    award({ type: "message", chars: text.length });
    setDraft("");
  };
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-glass-border/40 bg-card/60 px-4 pb-3 pt-10 backdrop-blur-xl">
        <IconButton variant="ghost" size="sm">
          <ChevronLeft className="h-5 w-5" />
        </IconButton>
        <div className="flex flex-1 flex-col items-center">
          <h2 className="text-sm font-semibold">Speaking Room — Intermediate</h2>
          <div className="mt-1 flex items-center gap-2">
            <span className="flex items-center gap-1 text-[10px] text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success" /> 18 online
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
        <IconButton variant="ghost" size="sm">
          <MoreVertical className="h-5 w-5" />
        </IconButton>
      </div>

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
          <button className="flex items-center gap-1.5 rounded-full border border-glass-border/40 bg-secondary/60 px-3 py-1.5 text-[10px] text-foreground hover:bg-secondary">
            <Hand className="h-3 w-3" /> رفع اليد
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-y-auto px-3 py-4">
        <ChatBubble
          author="Omar"
          text={"Hi everyone! 👋\nHow was your weekend?"}
          time="10:20 AM"
          reactions={[{ emoji: "❤️", count: 2 }]}
        />
        <ChatBubble
          author="Sara"
          text={"It was great! I went hiking\nwith my friends 😊"}
          time="10:21 AM"
          reactions={[{ emoji: "❤️", count: 1 }]}
        />

        {/* You: Voice */}
        <VoiceBubble duration="0:18" time="10:22 AM" side="right" />

        {/* James: File message */}
        <div className="flex w-full gap-2">
          <Avatar name="James" size="sm" />
          <div className="flex max-w-[75%] flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">James</span>
            <div className="flex items-center gap-3 rounded-2xl rounded-tl-md border border-glass-border/40 bg-secondary/70 px-3 py-2.5 shadow-card">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-[0_0_18px_hsl(0_75%_55%/0.4)]">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">Useful Phrases.pdf</p>
                <p className="text-[10px] text-muted-foreground">1.2 MB</p>
              </div>
              <button className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-primary hover:bg-primary/25">
                <Download className="h-3.5 w-3.5" />
              </button>
            </div>
            <span className="text-[10px] text-muted-foreground">10:23 AM</span>
          </div>
        </div>

        {/* Lina: Image with caption */}
        <div className="flex w-full gap-2">
          <Avatar name="Lina" size="sm" />
          <div className="flex max-w-[78%] flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">Lina</span>
            <div className="overflow-hidden rounded-2xl rounded-tl-md border border-glass-border/40 bg-secondary/70 shadow-card">
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
        <div className="mx-auto max-w-[85%] rounded-2xl border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-center text-[11px] text-amber-200 shadow-[0_0_18px_hsl(40_90%_55%/0.15)]">
          <span className="font-semibold">System:</span> Please try to use English only 😊
        </div>
      </div>

      {/* Bottom Action chips */}
      <div className="border-t border-glass-border/40 bg-card/60 px-3 pb-2 pt-3 backdrop-blur-xl">
        <div className="mb-2.5 flex items-center justify-between gap-2">
          {[
            { label: "Topic", Icon: Lightbulb, tint: "text-primary-glow", bg: "bg-primary/15" },
            { label: "Ice Breaker", Icon: Snowflake, tint: "text-cyan-400", bg: "bg-cyan-400/15" },
            { label: "Rotate", Icon: RotateCw, tint: "text-emerald-400", bg: "bg-emerald-400/15" },
            { label: "Image Talk", Icon: ImageIcon, tint: "text-pink-400", bg: "bg-pink-400/15" },
          ].map(({ label, Icon, tint, bg }) => (
            <button
              key={label}
              className="flex flex-1 flex-col items-center gap-1 rounded-2xl border border-glass-border/40 bg-secondary/30 px-2 py-2 text-[10px] text-muted-foreground transition-all hover:bg-secondary/60"
            >
              <span className={`flex h-7 w-7 items-center justify-center rounded-full ${bg} ${tint}`}>
                <Icon className="h-3.5 w-3.5" />
              </span>
              {label}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="flex items-center gap-2">
          <button className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:text-foreground">
            <Smile className="h-5 w-5" />
          </button>
          <div className="flex h-11 flex-1 items-center gap-2 rounded-full border border-glass-border/40 bg-secondary/50 px-4">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
              placeholder="Type a message..."
              className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
            />
            <Paperclip className="h-4 w-4 text-muted-foreground" />
          </div>
          <button onClick={sendMessage} className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary text-white shadow-glow transition-all hover:brightness-110 active:scale-95">
            <Send className="h-4 w-4" />
          </button>
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
  );
};

export default ChatScreen;