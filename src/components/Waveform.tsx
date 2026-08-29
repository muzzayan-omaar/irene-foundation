"use client";

// A deterministic pseudo-random bar-height pattern, seeded so it's stable
// across server/client renders (no hydration mismatch) and always looks
// like a natural, non-repeating waveform rather than a uniform pattern.
function generateBarHeights(count: number, seed = 7): number[] {
  const heights: number[] = [];
  let value = seed;
  for (let i = 0; i < count; i++) {
    value = (value * 9301 + 49297) % 233280;
    const rand = value / 233280;
    heights.push(0.25 + rand * 0.75); // between 25% and 100% height
  }
  return heights;
}

export function WaveformProgress({
  percent,
  barCount = 40,
}: {
  percent: number;
  barCount?: number;
}) {
  const heights = generateBarHeights(barCount);
  const filledBars = Math.round((percent / 100) * barCount);

  return (
    <div className="flex items-end gap-[2px] h-8 w-full">
      {heights.map((h, i) => (
        <div
          key={i}
          className={`flex-1 rounded-full transition-colors duration-300 ${
            i < filledBars ? "bg-clay" : "bg-ink/10"
          }`}
          style={{ height: `${h * 100}%` }}
        />
      ))}
    </div>
  );
}

export function WaveformDivider({ className = "" }: { className?: string }) {
  const heights = generateBarHeights(60, 3);

  return (
    <div className={`flex items-end gap-[2px] h-4 w-full opacity-30 ${className}`}>
      {heights.map((h, i) => (
        <div
          key={i}
          className="flex-1 bg-ink rounded-full"
          style={{ height: `${h * 100}%` }}
        />
      ))}
    </div>
  );
}