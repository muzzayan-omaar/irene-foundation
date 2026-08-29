import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import CampaignForm from "@/components/admin/CampaignForm";

export default async function EditCampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const campaign = await prisma.campaign.findUnique({ where: { id } });

  if (!campaign) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Campaign</h1>
      <CampaignForm
        initialValues={{
          id: campaign.id,
          title: campaign.title,
          slug: campaign.slug,
          story: campaign.story,
          coverImage: campaign.coverImage ?? "",
          goalAmount: campaign.goalAmount.toString(),
          currency: campaign.currency,
          status: campaign.status,
        }}
      />
    </div>
  );
}