import { notFound } from "next/navigation";
import { getCampaignBySlug } from "@/lib/campaigns";
import { WaveformProgress } from "@/components/Waveform";
import ShareButtons from "@/components/ShareButtons";
import DonateForm from "@/components/DonateForm";
import { getServerLocale } from "@/lib/i18n/getServerLocale";
import { translate } from "@/lib/i18n/translations";

type BudgetLine = { label: string; amount: number };

const BUDGET_COLORS = ["bg-clay", "bg-papyrus", "bg-sun", "bg-ink"];

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  const campaign = await getCampaignBySlug(slug);

  if (!campaign) notFound();

  const recentDonors = campaign.donations.slice(0, 8);
  const budgetLines = (campaign.budgetBreakdown as BudgetLine[] | null) ?? [];
  const budgetTotal = budgetLines.reduce((sum, line) => sum + line.amount, 0);

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
        <div className="md:col-span-2 space-y-10">
          <div>
            <p className="font-mono text-clay text-xs tracking-widest uppercase mb-4">
              {t("campaignDetail_activeLabel")}
            </p>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl mb-6">
              {campaign.title}
            </h1>
            <p className="text-ink/70 text-lg leading-relaxed whitespace-pre-line">
              {campaign.story}
            </p>
          </div>

          {/* Gallery — only if additional photos exist */}
          {campaign.galleryImages.length > 0 && (
            <div>
              <h2 className="font-display font-semibold text-xl mb-4">
                {t("campaignDetail_gallery")}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {campaign.galleryImages.map((url, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={url}
                    alt={`${campaign.title} photo ${i + 1}`}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Video — only if attached */}
          {campaign.videoUrl && (
            <div>
              <h2 className="font-display font-semibold text-xl mb-4">
                {t("campaignDetail_watchVideo")}
              </h2>
              <div className="aspect-video rounded-2xl overflow-hidden">
                <video controls className="w-full h-full" src={campaign.videoUrl} />
              </div>
            </div>
          )}

          {/* Budget breakdown — only if line items exist */}
          {budgetLines.length > 0 && budgetTotal > 0 && (
            <div>
              <h2 className="font-display font-semibold text-xl mb-4">
                {t("campaignDetail_budgetBreakdown")}
              </h2>
              <div className="space-y-3">
                {budgetLines.map((line, i) => {
                  const percent = (line.amount / budgetTotal) * 100;
                  return (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{line.label}</span>
                        <span className="font-mono text-ink/60">
                          {campaign.currency} {line.amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-ink/10 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${BUDGET_COLORS[i % BUDGET_COLORS.length]}`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Outcomes — shown whenever filled in, not gated to COMPLETED status */}
          {campaign.outcomes && (
            <div className="p-6 rounded-2xl bg-papyrus text-paper">
              <h2 className="font-display font-semibold text-xl mb-3">
                {t("campaignDetail_outcomes")}
              </h2>
              <p className="leading-relaxed whitespace-pre-line opacity-90">
                {campaign.outcomes}
              </p>
            </div>
          )}

          {recentDonors.length > 0 && (
            <div>
              <h2 className="font-display font-semibold text-xl mb-4">
                {t("campaignDetail_recentSupporters")}
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
                {t("label_of")} {campaign.currency} {campaign.goalAmount.toString()}
              </span>
            </div>
            <p className="text-xs text-ink/40">
              {campaign.donorCount} {t("label_donors")}
            </p>

            <ShareButtons
              title={campaign.title}
              url={`${process.env.NEXT_PUBLIC_SITE_URL}/campaigns/${campaign.slug}`}
            />

            {campaign.status === "COMPLETED" ? (
              <div className="pt-4 border-t border-ink/10 text-sm text-ink/60">
                {t("campaignDetail_completedNote")}
              </div>
            ) : (
              <div id="donate" className="pt-4 border-t border-ink/10">
                <DonateForm campaignId={campaign.id} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Closing panel — same dual-panel pattern used on the homepage */}
      <section className="grid grid-cols-1 sm:grid-cols-2 min-h-[45vh] -mx-6 sm:-mx-12">
        <div className="relative min-h-[35vh] sm:min-h-full">
          {(campaign.galleryImages[0] || campaign.coverImage) && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={campaign.galleryImages[0] || campaign.coverImage!}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
        </div>
        <div className="bg-ink text-paper flex flex-col justify-center px-8 sm:px-14 py-14">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl leading-tight tracking-tight mb-7">
            {campaign.status === "COMPLETED"
              ? "This campaign is closed — but the need continues."
              : `Every gift moves ${campaign.title} closer to its goal.`}
          </h2>
          <div className="flex flex-wrap gap-3">
            {campaign.status === "COMPLETED" ? (
              <a
                href="/campaigns"
                className="bg-sun text-ink px-6 py-3 rounded-full font-semibold text-sm hover:brightness-105 transition"
              >
                See Active Campaigns
              </a>
            ) : (
              <a
                href="#donate"
                className="bg-sun text-ink px-6 py-3 rounded-full font-semibold text-sm hover:brightness-105 transition"
              >
                Give Now
              </a>
            )}
            <a
              href="/campaigns"
              className="border border-paper/30 text-paper px-6 py-3 rounded-full font-semibold text-sm hover:bg-paper/10 transition"
            >
              See Other Campaigns
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}