import { cn } from "@/lib/utils";
import { Avatar } from "./Avatar";

interface ChatBubbleProps {
  author: string;
  text: string;
  time: string;
  side?: "left" | "right";
  reactions?: { emoji: string; count: number }[];
  avatarSrc?: string;
}

export const ChatBubble = ({ author, text, time, side = "left", reactions, avatarSrc }: ChatBubbleProps) => {
  const isMe = side === "right";
  return (
    <div className={cn("flex w-full gap-2", isMe ? "flex-row-reverse" : "flex-row")}>
      {!isMe && <Avatar name={author} size="sm" src={avatarSrc} />}
      <div className={cn("flex max-w-[75%] flex-col gap-1", isMe && "items-end")}>
        {!isMe && <span className="text-xs font-medium text-muted-foreground">{author}</span>}
        <div
          className={cn(
            "whitespace-pre-line rounded-[20px] px-3.5 py-2.5 text-sm transition-all",
            isMe ? "rounded-br-md bubble-out" : "rounded-tl-md bubble-in",
          )}
        >
          {text}
        </div>
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