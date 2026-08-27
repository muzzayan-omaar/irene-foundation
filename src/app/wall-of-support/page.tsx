import prisma from "@/lib/prisma";
import { SITE_HASHTAG } from "@/lib/config";

export default async function WallOfSupportPage() {
  const posts = await prisma.supportPost.findMany({
    where: { isFeatured: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-2">Wall of Support</h1>
      <p className="text-gray-600 mb-10">
        Real posts from real supporters using {SITE_HASHTAG}.
      </p>

      {posts.length === 0 ? (
        <p className="text-gray-500">
          Nothing here yet — be the first to share using {SITE_HASHTAG}!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="p-5 rounded-xl border border-gray-100">
              {post.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.imageUrl}
                  alt={post.authorName}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
              )}
              <p className="text-gray-700 text-sm mb-2">{post.content}</p>
              <p className="text-xs text-gray-400">
                — {post.authorName} on {post.platform}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}