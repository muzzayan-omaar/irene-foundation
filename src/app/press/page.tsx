import prisma from "@/lib/prisma";

export default async function PressPage() {
  const mentions = await prisma.pressMention.findMany({
    orderBy: { publishedDate: "desc" },
  });

  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-12 py-16 sm:py-20">
      <p className="font-mono text-clay text-xs tracking-[0.18em] uppercase mb-4">
        Coverage
      </p>
      <h1 className="font-display font-extrabold text-4xl sm:text-6xl tracking-tight mb-6">
        Press &amp; Media
      </h1>
      <p className="text-ink/60 text-lg max-w-xl mb-14">
        Coverage of Irene&apos;s work and the foundation&apos;s mission.
      </p>

      {mentions.length === 0 ? (
        <p className="text-ink/40">
          No press coverage listed yet — check back as the foundation grows.
        </p>
      ) : (
        <div className="space-y-3">
          {mentions.map((mention) => (
            <a
              key={mention.id}
              href={mention.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 rounded-xl border border-ink/10 hover:border-ink/25 transition"
            >
              {mention.logoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={mention.logoUrl}
                  alt={mention.outletName}
                  className="h-8 w-auto object-contain"
                />
              )}
              <div>
                <p className="font-mono text-xs text-clay uppercase tracking-wide mb-1">
                  {mention.outletName}
                </p>
                <p className="font-display font-semibold text-lg">{mention.title}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}