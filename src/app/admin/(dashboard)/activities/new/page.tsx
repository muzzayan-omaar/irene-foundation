import prisma from "@/lib/prisma";
import ActivityForm from "@/components/admin/ActivityForm";

export default async function NewActivityPage() {
  const campaigns = await prisma.campaign.findMany({
    select: { id: true, title: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">New Activity</h1>
      <ActivityForm campaigns={campaigns} />
    </div>
  );
}