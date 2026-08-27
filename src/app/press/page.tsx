import prisma from "@/lib/prisma";

export default async function PressPage() {
  const mentions = await prisma.pressMention.findMany({
    orderBy: { publishedDate: "desc" },
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-2">Press & Media</h1>
      <p className="text-gray-600 mb-10">
        Coverage of Irene&apos;s work and the foundation&apos;s mission.
      </p>

      {mentions.length === 0 ? (
        <p className="text-gray-500">
          No press coverage listed yet — check back as the foundation grows.
        </p>
      ) : (
        <div className="space-y-4">
          {mentions.map((mention) => (
            <a
              key={mention.id}
              href={mention.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                {mention.logoUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mention.logoUrl}
                    alt={mention.outletName}
                    className="h-8 w-auto object-contain"
                  />
                )}
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">
                    {mention.outletName}
                  </p>
                  <p className="font-medium">{mention.title}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}