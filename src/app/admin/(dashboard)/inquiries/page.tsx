import prisma from "@/lib/prisma";
import AdminInquiriesClient from "@/components/admin/AdminInquiriesClient";

export default async function AdminInquiriesPage() {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Inquiries</h1>
      <AdminInquiriesClient
        initialInquiries={inquiries.map((i) => ({
          ...i,
          createdAt: i.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}