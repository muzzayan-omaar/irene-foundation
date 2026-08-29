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
};

export default function CampaignCard({
  slug,
  title,
  coverImage,
  currency,
  goalAmount,
  raisedAmount,
  progressPercent,
  donorCount,
}: CampaignCardProps) {
  return (
    <Link
      href={`/campaigns/${slug}`}
      className="block rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
    >
      {coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={coverImage} alt={title} className="w-full h-48 object-cover" />
      )}
      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-lg">{title}</h3>
        <WaveformProgress percent={progressPercent} />
        <div className="flex justify-between text-sm text-gray-600">
          <span>
            {currency} {raisedAmount.toLocaleString()} raised
          </span>
          <span>of {currency} {goalAmount.toNumber().toLocaleString()}</span>
        </div>
        <p className="text-xs text-gray-400">{donorCount} donors</p>
      </div>
    </Link>
  );
}
