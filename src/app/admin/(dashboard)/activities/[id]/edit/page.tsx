import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ActivityForm from "@/components/admin/ActivityForm";

export default async function EditActivityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [activity, campaigns] = await Promise.all([
    prisma.activity.findUnique({ where: { id } }),
    prisma.campaign.findMany({
      select: { id: true, title: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!activity) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Activity</h1>
      <ActivityForm
        campaigns={campaigns}
        initialValues={{
          id: activity.id,
          title: activity.title,
          slug: activity.slug,
          type: activity.type,
          body: activity.body,
          mediaUrls: activity.mediaUrls.join(", "),
          campaignId: activity.campaignId ?? "",
          isPublished: activity.isPublished,
        }}
      />
    </div>
  );
}