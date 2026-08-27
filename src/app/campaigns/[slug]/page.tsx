import { notFound } from "next/navigation";
import { getCampaignBySlug } from "@/lib/campaigns";
import ProgressBar from "@/components/ProgressBar";
import DonateForm from "@/components/DonateForm";
import ShareButtons from "@/components/ShareButtons";

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
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-10">
      {campaign.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={campaign.coverImage}
          alt={campaign.title}
          className="w-full h-72 object-cover rounded-xl"
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-4">{campaign.title}</h1>
            <p className="text-gray-700 whitespace-pre-line">{campaign.story}</p>
          </div>

          {recentDonors.length > 0 && (
            <div>
              <h2 className="font-semibold text-lg mb-3">Recent Supporters</h2>
              <ul className="space-y-2">
                {recentDonors.map((donation) => (
                  <li
                    key={donation.id}
                    className="flex justify-between text-sm border-b border-gray-100 pb-2"
                  >
                    <span>
                      {donation.isAnonymous ? "Anonymous" : donation.donor.fullName}
                      {donation.message && (
                        <span className="text-gray-500 italic"> — &ldquo;{donation.message}&rdquo;</span>
                      )}
                    </span>
                    <span className="text-gray-500 whitespace-nowrap ml-4">
                      {donation.currency} {donation.amount.toString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="p-5 rounded-xl border border-gray-100 space-y-3 sticky top-6">
  <ProgressBar percent={campaign.progressPercent} />

  <ShareButtons
    title={campaign.title}
    url={`${process.env.NEXT_PUBLIC_SITE_URL}/campaigns/${campaign.slug}`}
  />

  <div className="flex justify-between text-sm">
        </div>
      </div>
    </div>
  );
}