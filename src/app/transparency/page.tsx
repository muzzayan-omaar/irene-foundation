import { getSupporterCount } from "@/lib/supporters";
import prisma from "@/lib/prisma";

export default async function TransparencyPage() {
  const totalRaised = await prisma.donation.aggregate({
    where: { status: "SUCCESSFUL" },
    _sum: { amount: true },
  });
  const supporterCount = await getSupporterCount();

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-10">
      <div>
        <h1 className="text-3xl font-bold mb-2">Transparency</h1>
        <p className="text-gray-600">
          We believe donors deserve to see exactly where their support goes.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="p-5 rounded-xl border border-gray-100 text-center">
          <div className="text-2xl font-bold">
            USD {(totalRaised._sum.amount?.toNumber() ?? 0).toLocaleString()}
          </div>
          <p className="text-sm text-gray-500">Total raised to date</p>
        </div>
        <div className="p-5 rounded-xl border border-gray-100 text-center">
          <div className="text-2xl font-bold">{supporterCount.toLocaleString()}</div>
          <p className="text-sm text-gray-500">Supporters</p>
        </div>
      </div>

      {/* TODO: Replace this entire section with Irene's real financial
          breakdown once available — registration status, audited figures,
          or a simple annual income/expense summary. This is placeholder
          structure only, not real data. */}
      <div className="p-5 rounded-xl border border-dashed border-gray-300 text-gray-500 text-sm">
        <p className="font-medium mb-2">⚠️ Placeholder — pending real data</p>
        <p>
          A full financial breakdown (income sources, program spend, admin
          costs) will be published here once the foundation&apos;s registration
          and first reporting period are complete.
        </p>
      </div>
    </div>
  );
}