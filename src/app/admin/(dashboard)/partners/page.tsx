import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function AdminPartnersPage() {
  const partners = await prisma.partner.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Partners</h1>
        <Link
          href="/admin/partners/new"
          className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          + New Partner
        </Link>
      </div>

      {partners.length === 0 ? (
        <p className="text-gray-500 text-sm">No partners yet.</p>
      ) : (
        <div className="space-y-2">
          {partners.map((partner) => (
            <Link
              key={partner.id}
              href={`/admin/partners/${partner.id}/edit`}
              className="flex justify-between items-center p-4 rounded-lg border border-gray-100 hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                {partner.logoUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={partner.logoUrl} alt={partner.name} className="h-8 w-auto" />
                )}
                <p className="font-medium">{partner.name}</p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  partner.status === "ACTIVE"
                    ? "bg-green-100 text-green-700"
                    : partner.status === "PROSPECTIVE"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {partner.status}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
