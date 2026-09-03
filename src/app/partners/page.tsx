import prisma from "@/lib/prisma";

export default async function PartnersPage() {
  const partners = await prisma.partner.findMany({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-12 py-16 sm:py-20">
      <p className="font-mono text-clay text-xs tracking-[0.18em] uppercase mb-4">
  With love and support
        </p>
        <h1 className="font-display font-extrabold text-4xl sm:text-6xl tracking-tight mb-6">
        Our Friends
        </h1>
        <p className="text-ink/60 text-lg max-w-xl mb-14">
        The organizations and people standing behind this work, alongside everyone else.
        </p>

      {partners.length === 0 ? (
        <p className="text-ink/40">
          No partners listed yet — interested in partnering?{" "}
          <a href="/get-involved#partner" className="underline">
            Get in touch
          </a>
          .
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="flex items-center gap-4 p-5 rounded-xl border border-ink/10"
            >
              {partner.logoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={partner.logoUrl}
                  alt={partner.name}
                  className="h-10 w-auto object-contain"
                />
              )}
              <div>
                <p className="font-display font-semibold">{partner.name}</p>
                {partner.website && (
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-ink/50 hover:text-ink underline"
                  >
                    Visit website
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
