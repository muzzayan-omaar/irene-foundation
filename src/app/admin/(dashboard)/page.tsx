import prisma from "@/lib/prisma";

export default async function AdminOverviewPage() {
  const [
    totalRaised,
    donorCount,
    subscriberCount,
    activeCampaignCount,
    pendingDonationCount,
    recentDonations,
  ] = await Promise.all([
    prisma.donation.aggregate({
      where: { status: "SUCCESSFUL" },
      _sum: { amount: true },
    }),
    prisma.donor.count(),
    prisma.newsletterSubscriber.count(),
    prisma.campaign.count({ where: { status: "ACTIVE" } }),
    prisma.donation.count({ where: { status: "PENDING" } }),
    prisma.donation.findMany({
      where: { status: "SUCCESSFUL" },
      include: { donor: true, campaign: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const stats = [
    {
      label: "Total Raised",
      value: `USD ${(totalRaised._sum.amount?.toNumber() ?? 0).toLocaleString()}`,
    },
    { label: "Donors", value: donorCount },
    { label: "Newsletter Subscribers", value: subscriberCount },
    { label: "Active Campaigns", value: activeCampaignCount },
    { label: "Pending Donations", value: pendingDonationCount },
  ];

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-bold">Overview</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="p-4 rounded-xl border border-gray-100">
            <div className="text-xl font-bold">{stat.value}</div>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="font-semibold mb-3">Recent Successful Donations</h2>
        {recentDonations.length === 0 ? (
          <p className="text-gray-500 text-sm">No donations yet.</p>
        ) : (
          <div className="space-y-2">
            {recentDonations.map((donation) => (
              <div
                key={donation.id}
                className="flex justify-between text-sm p-3 rounded-lg border border-gray-100"
              >
                <span>
                  {donation.isAnonymous ? "Anonymous" : donation.donor.fullName}
                  {donation.campaign && (
                    <span className="text-gray-400"> → {donation.campaign.title}</span>
                  )}
                </span>
                <span className="font-medium">
                  {donation.currency} {donation.amount.toString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {pendingDonationCount > 0 && (
        <div className="p-4 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 text-sm">
          {pendingDonationCount} donation(s) are stuck in PENDING — since the
          payment gateway is currently frozen, this is expected for now. Once
          a gateway is live, new donations should resolve automatically via
          the webhook.
        </div>
      )}
    </div>
  );
}