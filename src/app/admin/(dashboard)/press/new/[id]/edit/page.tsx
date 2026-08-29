import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import PressMentionForm from "@/components/admin/PressMentionForm";

export default async function EditPressMentionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const mention = await prisma.pressMention.findUnique({ where: { id } });

  if (!mention) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Press Mention</h1>
      <PressMentionForm
        initialValues={{
          id: mention.id,
          outletName: mention.outletName,
          title: mention.title,
          url: mention.url,
          logoUrl: mention.logoUrl ?? "",
          publishedDate: mention.publishedDate
            ? mention.publishedDate.toISOString().split("T")[0]
            : "",
        }}
      />
    </div>
  );
}