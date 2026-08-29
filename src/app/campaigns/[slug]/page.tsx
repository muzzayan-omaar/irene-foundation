import { notFound } from "next/navigation";
import { getCampaignBySlug } from "@/lib/campaigns";
import { WaveformProgress } from "@/components/Waveform";
import ShareButtons from "@/components/ShareButtons";
import DonateForm from "@/components/DonateForm";

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const campaign = await getCampaignBySlug(slug);

  if (!campaign) notFound();

  const recentDonors = campaign.donations.slice(0, 8);

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-12 py-16 space-y-12">
      {campaign.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={campaign.coverImage}
          alt={campaign.title}
          className="w-full h-80 sm:h-96 object-cover rounded-2xl"
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-8">
          <div>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl mb-6">
              {campaign.title}
            </h1>
            <p className="text-ink/70 text-lg leading-relaxed whitespace-pre-line">
              {campaign.story}
            </p>
          </div>

          {recentDonors.length > 0 && (
            <div>
              <h2 className="font-display font-semibold text-xl mb-4">
                Recent Supporters
              </h2>
              <ul className="space-y-3">
                {recentDonors.map((donation) => (
                  <li
                    key={donation.id}
                    className="flex justify-between text-sm border-b border-ink/10 pb-3"
                  >
                    <span>
                      <span className="font-medium">
                        {donation.isAnonymous ? "Anonymous" : donation.donor.fullName}
                      </span>
                      {donation.message && (
                        <span className="text-ink/50 italic">
                          {" "}
                          — &ldquo;{donation.message}&rdquo;
                        </span>
                      )}
                    </span>
                    <span className="font-mono text-ink/60 whitespace-nowrap ml-4">
                      {donation.currency} {donation.amount.toString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div>
          <div className="p-6 rounded-2xl border border-ink/10 space-y-4 sticky top-6">
            <WaveformProgress percent={campaign.progressPercent} />
            <div className="flex justify-between text-sm">
              <span className="font-mono font-semibold text-clay">
                {campaign.currency} {campaign.raisedAmount.toLocaleString()}
              </span>
              <span className="text-ink/40">
                of {campaign.currency} {campaign.goalAmount.toString()}
              </span>
            </div>
            <p className="text-xs text-ink/40">{campaign.donorCount} donors</p>

            <ShareButtons
              title={campaign.title}
              url={`${process.env.NEXT_PUBLIC_SITE_URL}/campaigns/${campaign.slug}`}
            />

            {campaign.status === "COMPLETED" ? (
              <div className="pt-4 border-t border-ink/10 text-sm text-ink/60">
                This campaign has been completed — thank you to everyone who
                gave. Check Field Notes for what your support made possible.
              </div>
            ) : (
              <div className="pt-4 border-t border-ink/10">
                <DonateForm campaignId={campaign.id} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}