import { listActiveCampaigns } from "@/lib/campaigns";
import CampaignCard from "@/components/CampaignCard";

export default async function CampaignsPage() {
  const campaigns = await listActiveCampaigns();

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-2">Active Campaigns</h1>
      <p className="text-gray-600 mb-10">
        Every campaign below is a real, ongoing need — see exactly what your
        gift supports.
      </p>

      {campaigns.length === 0 ? (
        <p className="text-gray-500">No active campaigns right now — check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
            />
          ))}
        </div>
      )}
    </div>
  );
}