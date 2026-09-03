import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import PartnerForm from "@/components/admin/PartnerForm";

export default async function EditPartnerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const partner = await prisma.partner.findUnique({ where: { id } });

  if (!partner) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Partner</h1>
      <PartnerForm
        initialValues={{
          id: partner.id,
          name: partner.name,
          logoUrl: partner.logoUrl ?? "",
          website: partner.website ?? "",
          contactName: partner.contactName ?? "",
          contactEmail: partner.contactEmail ?? "",
          status: partner.status,
          notes: partner.notes ?? "",
        }}
      />
    </div>
  );
}
