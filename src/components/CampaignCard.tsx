import Link from "next/link";
import { WaveformProgress } from "./Waveform";

type CampaignCardProps = {
  slug: string;
  title: string;
  coverImage: string | null;
  currency: string;
  goalAmount: { toNumber: () => number };
  raisedAmount: number;
  progressPercent: number;
  donorCount: number;
  labels?: { raised: string; of: string; donors: string };
};

const DEFAULT_LABELS = { raised: "raised", of: "of", donors: "donors" };

export default function CampaignCard({
  slug,
  title,
  coverImage,
  currency,
  goalAmount,
  raisedAmount,
  progressPercent,
  donorCount,
  labels = DEFAULT_LABELS,
}: CampaignCardProps) {
  return (
    <Link
      href={`/campaigns/${slug}`}
      className="group block rounded-2xl overflow-hidden border border-ink/10 hover:shadow-lg transition-shadow"
    >
      <div className="aspect-[4/3] overflow-hidden bg-ink/5">
        {coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink/30 text-sm">
            No photo yet
          </div>
        )}
      </div>
      <div className="p-5 space-y-3">
        <h3 className="font-display font-semibold text-xl">{title}</h3>
        <WaveformProgress percent={progressPercent} />
        <div className="flex justify-between text-sm">
          <span className="font-mono font-medium text-clay">
            {currency} {raisedAmount.toLocaleString()} {labels.raised}
          </span>
          <span className="text-ink/40">
            {labels.of} {currency} {goalAmount.toNumber().toLocaleString()}
          </span>
        </div>
        <p className="text-xs text-ink/40">
          {donorCount} {labels.donors}
        </p>
      </div>
    </Link>
  );
}
