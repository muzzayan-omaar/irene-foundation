import prisma from "@/lib/prisma";
import { WaveformDivider } from "@/components/Waveform";
import { SITE_HASHTAG } from "@/lib/config";

export default async function WallOfSupportPage() {
  const posts = await prisma.supportPost.findMany({
    where: { isFeatured: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-12 py-16 sm:py-20">
      <p className="font-mono text-clay text-xs tracking-[0.18em] uppercase mb-4">
        In their words
      </p>
      <h1 className="font-display font-extrabold text-4xl sm:text-6xl tracking-tight mb-6">
        Wall of Support
      </h1>
      <p className="text-ink/60 text-lg max-w-xl mb-14">
        Real posts from real supporters using {SITE_HASHTAG}.
      </p>

      {posts.length === 0 ? (
        <p className="text-ink/40">
          Nothing here yet — be the first to share using {SITE_HASHTAG}!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-ink text-paper rounded-2xl rounded-bl-md p-6">
              {post.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.imageUrl}
                  alt={post.authorName}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
              )}
              <div className="mb-3 opacity-40">
                <WaveformDivider className="!h-2.5" />
              </div>
              <p className="text-sm sm:text-base leading-relaxed mb-4">
                &ldquo;{post.content}&rdquo;
              </p>
              <p className="font-mono text-[11px] text-sun uppercase tracking-wide">
                {post.authorName} · {post.platform}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}