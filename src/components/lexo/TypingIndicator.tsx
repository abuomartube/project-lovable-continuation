import { Avatar } from "./Avatar";

interface TypingIndicatorProps {
  users: string[];
}

export const TypingIndicator = ({ users }: TypingIndicatorProps) => {
  if (users.length === 0) return null;
  const label =
    users.length === 1 ? `${users[0]} is typing` :
    users.length === 2 ? `${users[0]} and ${users[1]} are typing` :
    `${users[0]} and ${users.length - 1} others are typing`;
  return (
    <div className="flex w-full animate-fade-in items-center gap-2 px-1">
      <div className="flex -space-x-1.5">
        {users.slice(0, 2).map((u) => <Avatar key={u} name={u} size="xs" />)}
      </div>
      <div className="flex items-center gap-2 rounded-2xl rounded-tl-md border border-glass-border/40 bg-secondary/60 px-3 py-2">
        <span className="flex h-1.5 w-1.5 rounded-full bg-primary-glow" style={{ animation: "typing-bounce 1.2s ease-in-out 0s infinite" }} />
        <span className="flex h-1.5 w-1.5 rounded-full bg-primary-glow" style={{ animation: "typing-bounce 1.2s ease-in-out 0.15s infinite" }} />
        <span className="flex h-1.5 w-1.5 rounded-full bg-primary-glow" style={{ animation: "typing-bounce 1.2s ease-in-out 0.3s infinite" }} />
      </div>
      <span className="text-[10px] text-muted-foreground">{label}…</span>
    </div>
  );
};

export default TypingIndicator;