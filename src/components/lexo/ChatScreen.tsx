import { ChevronLeft, MoreVertical, Hand, Mic } from "lucide-react";
import { Avatar } from "./Avatar";
import { ChatBubble } from "./ChatBubble";
import { VoiceBubble } from "./VoiceBubble";
import { BottomActionBar } from "./BottomActionBar";
import { IconButton } from "./IconButton";

export const ChatScreen = () => {
  return (
    <>
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

      {/* Sub bar */}
      <div className="flex items-center justify-between border-b border-glass-border/30 bg-card/40 px-4 py-2.5">
        <span className="rounded-full bg-success/15 px-2.5 py-1 text-[10px] font-semibold text-success">
          EN  English Only
        </span>
        <div className="flex items-center gap-2">
          <IconButton variant="default" size="sm">
            <Mic className="h-4 w-4 text-primary" />
          </IconButton>
          <button className="flex items-center gap-1.5 rounded-full bg-secondary/60 px-3 py-1 text-[10px]">
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
          text={"It was great! I went hiking with my friends 🌲"}
          time="10:21 AM"
          reactions={[{ emoji: "❤️", count: 1 }]}
        />
        <VoiceBubble duration="0:18" time="10:22 AM" side="right" />
        <ChatBubble author="James" text="📎 Useful Phrases.pdf · 1.2 MB" time="10:23 AM" />
        <ChatBubble
          author="Lina"
          text={"Let's talk about this picture! ☕"}
          time="10:28 AM"
          reactions={[{ emoji: "❤️", count: 3 }]}
        />
        <div className="mx-auto max-w-[80%] rounded-2xl border border-glass-border/40 bg-secondary/40 px-3 py-2 text-center text-[11px] text-muted-foreground">
          <span className="font-semibold text-foreground">System:</span> Please try to use English only 🙂
        </div>
      </div>

      <BottomActionBar />
    </>
  );
};

export default ChatScreen;