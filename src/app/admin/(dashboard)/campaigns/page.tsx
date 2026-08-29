import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function AdminCampaignsPage() {
  const campaigns = await prisma.campaign.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Campaigns</h1>
        <Link
          href="/admin/campaigns/new"
          className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          + New Campaign
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <p className="text-gray-500 text-sm">No campaigns yet.</p>
      ) : (
        <div className="space-y-2">
          {campaigns.map((campaign) => (
            <Link
              key={campaign.id}
              href={`/admin/campaigns/${campaign.id}/edit`}
              className="flex justify-between items-center p-4 rounded-lg border border-gray-100 hover:bg-gray-50"
            >
              <div>
                <p className="font-medium">{campaign.title}</p>
                <p className="text-xs text-gray-400">/{campaign.slug}</p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  campaign.status === "ACTIVE"
                    ? "bg-green-100 text-green-700"
                    : campaign.status === "DRAFT"
                    ? "bg-gray-100 text-gray-600"
                    : campaign.status === "COMPLETED"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {campaign.status}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}