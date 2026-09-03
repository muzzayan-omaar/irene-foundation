import { getSupporterCount } from "@/lib/supporters";
import prisma from "@/lib/prisma";

export default async function TransparencyPage() {
  const totalRaised = await prisma.donation.aggregate({
    where: { status: "SUCCESSFUL" },
    _sum: { amount: true },
  });
  const supporterCount = await getSupporterCount();

  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-12 py-16 sm:py-20 space-y-12">
      <div>
        <p className="font-mono text-clay text-xs tracking-[0.18em] uppercase mb-4">
          Open by default
        </p>
        <h1 className="font-display font-extrabold text-4xl sm:text-6xl tracking-tight mb-6">
          Transparency
        </h1>
        <p className="text-ink/60 text-lg max-w-lg">
          We believe donors deserve to see exactly where their support goes.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-6 rounded-2xl border border-ink/10 text-center">
          <p className="font-mono text-3xl font-semibold text-clay">
            USD {(totalRaised._sum.amount?.toNumber() ?? 0).toLocaleString()}
          </p>
          <p className="text-sm text-ink/50 mt-1">Total raised to date</p>
        </div>
        <div className="p-6 rounded-2xl border border-ink/10 text-center">
          <p className="font-mono text-3xl font-semibold text-clay">
            {supporterCount.toLocaleString()}
          </p>
          <p className="text-sm text-ink/50 mt-1">Supporters</p>
        </div>
      </div>

      {/* TODO: Replace this entire section with Irene's real financial
          breakdown once available — registration status, audited figures,
          or a simple annual income/expense summary. This is placeholder
          structure only, not real data. */}
      <div className="p-6 rounded-2xl border border-dashed border-ink/20 text-ink/50 text-sm">
        <p className="font-medium mb-2 text-ink/70">⚠️ Placeholder — pending real data</p>
        <p>
          A full financial breakdown (income sources, program spend, admin
          costs) will be published here once the foundation&apos;s registration
          and first reporting period are complete.
        </p>
      </div>
    </div>
  );
}