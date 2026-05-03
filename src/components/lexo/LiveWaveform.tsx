interface LiveWaveformProps {
  /** 0..1 current voice activity */
  level: number;
  bars?: number;
  className?: string;
  active?: boolean;
}

/** Cheap deterministic waveform driven entirely by `level`. */
export const LiveWaveform = ({ level, bars = 14, className = "", active = true }: LiveWaveformProps) => {
  const amp = active ? Math.max(0.05, level) : 0.05;
  return (
    <div className={"flex items-center gap-0.5 " + className}>
      {Array.from({ length: bars }).map((_, i) => {
        // pseudo-random shape per bar, scaled by current level
        const wobble = 0.5 + Math.abs(Math.sin((i + 1) * 1.7 + level * 12)) * 0.5;
        const h = 3 + amp * 26 * wobble;
        return (
          <span
            key={i}
            className={
              "w-0.5 rounded-full transition-[height,background-color] duration-75 " +
              (active && level > 0.08 ? "bg-primary-glow" : "bg-primary/40")
            }
            style={{ height: `${h}px` }}
          />
        );
      })}
    </div>
  );
};

export default LiveWaveform;