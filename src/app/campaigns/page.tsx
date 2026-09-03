import { listActiveCampaigns } from "@/lib/campaigns";
import CampaignCard from "@/components/CampaignCard";
import { getServerLocale } from "@/lib/i18n/getServerLocale";
import { translate } from "@/lib/i18n/translations";

export default async function CampaignsPage() {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  const campaigns = await listActiveCampaigns();

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-12 py-20">
      <p className="font-mono text-clay text-sm tracking-widest uppercase mb-4">
        {t("campaigns_eyebrow")}
      </p>
      <h1 className="font-display font-extrabold text-5xl sm:text-6xl mb-4">
        {t("campaigns_title")}
      </h1>
      <p className="text-ink/60 text-lg max-w-xl mb-14">
        {t("campaigns_subtitle")}
      </p>

      {campaigns.length === 0 ? (
        <p className="text-ink/40">{t("campaigns_empty")}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              slug={campaign.slug}
              title={campaign.title}
              coverImage={campaign.coverImage}
              currency={campaign.currency}
              goalAmount={campaign.goalAmount}
              raisedAmount={campaign.raisedAmount}
              progressPercent={campaign.progressPercent}
              donorCount={campaign.donorCount}
              labels={{
                raised: t("label_raised"),
                of: t("label_of"),
                donors: t("label_donors"),
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
