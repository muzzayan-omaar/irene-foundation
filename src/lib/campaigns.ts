import prisma from "@/lib/prisma";

export async function getCampaignBySlug(slug: string) {
  const campaign = await prisma.campaign.findUnique({
    where: { slug },
    include: {
      donations: {
        where: { status: "SUCCESSFUL" },
        include: { donor: true },
        orderBy: { createdAt: "desc" },
      },
      activities: {
        where: { isPublished: true },
        orderBy: { publishedAt: "desc" },
      },
    },
  });

  if (!campaign) return null;

  return {
    ...campaign,
    ...computeCampaignStats(campaign.goalAmount, campaign.donations),
  };
}

export async function listActiveCampaigns() {
  const campaigns = await prisma.campaign.findMany({
    where: { status: "ACTIVE" },
    include: {
      donations: {
        where: { status: "SUCCESSFUL" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return campaigns.map((campaign) => ({
    ...campaign,
    ...computeCampaignStats(campaign.goalAmount, campaign.donations),
  }));
}

function computeCampaignStats(
  goalAmount: { toNumber: () => number },
  donations: { amount: { toNumber: () => number } }[]
) {
  const raisedAmount = donations.reduce(
    (sum, d) => sum + d.amount.toNumber(),
    0
  );
  const goal = goalAmount.toNumber();
  const progressPercent = goal > 0 ? Math.min((raisedAmount / goal) * 100, 100) : 0;
  const donorCount = donations.length;

  return { raisedAmount, progressPercent, donorCount };
}