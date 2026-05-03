import { useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import { GradientButton } from "./GradientButton";

interface Props {
  open: boolean;
  original: string;
  author: string;
  onCancel: () => void;
  onSave: (corrected: string, note: string) => void;
}

export const CorrectionDialog = ({ open, original, author, onCancel, onSave }: Props) => {
  const [text, setText] = useState(original);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (open) { setText(original); setNote(""); }
  }, [open, original]);

  if (!open) return null;
  const trimmed = text.trim();
  const canSave = trimmed.length > 0 && trimmed.length <= 500 && trimmed !== original.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-app-dark/80 p-4 backdrop-blur-xl animate-fade-in">
      <div className="glass relative w-full max-w-md overflow-hidden rounded-[20px] p-5">
        <button
          onClick={onCancel}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/5"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-glow">
            <CheckCircle2 className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-bold">Correct sentence</h3>
            <p className="text-[11px] text-muted-foreground">Help {author} learn the right form</p>
          </div>
        </div>

        <div className="mb-3 rounded-2xl border border-glass-border/40 bg-secondary/30 p-3 text-xs text-muted-foreground">
          <span className="text-[9px] font-bold uppercase tracking-wider">Original</span>
          <p className="mt-1 text-foreground/80">{original}</p>
        </div>

        <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-emerald-300">
          Corrected version
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 500))}
          rows={3}
          autoFocus
          className="w-full resize-none rounded-2xl border border-emerald-400/30 bg-emerald-400/5 px-3 py-2 text-sm focus:border-emerald-400/60 focus:outline-none"
        />

        <label className="mb-1 mt-3 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Teaching note (optional)
        </label>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value.slice(0, 140))}
          placeholder="e.g. Use past tense for completed actions"
          className="w-full rounded-2xl border border-glass-border/40 bg-secondary/30 px-3 py-2 text-xs focus:border-primary/60 focus:outline-none"
        />

        <div className="mt-5 flex items-center justify-end gap-2">
          <button onClick={onCancel} className="rounded-full px-4 py-2 text-xs text-muted-foreground hover:bg-white/5">
            Cancel
          </button>
          <GradientButton
            onClick={() => canSave && onSave(trimmed, note.trim())}
            className={"px-4 py-2 text-xs " + (!canSave ? "pointer-events-none opacity-40" : "")}
          >
            Send correction
          </GradientButton>
        </div>
      </div>
    </div>
  );
};

export default CorrectionDialog;
