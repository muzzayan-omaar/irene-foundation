import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function AdminWallOfSupportPage() {
  const posts = await prisma.supportPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Wall of Support</h1>
        <Link
          href="/admin/wall-of-support/new"
          className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          + New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-gray-500 text-sm">No posts curated yet.</p>
      ) : (
        <div className="space-y-2">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/admin/wall-of-support/${post.id}/edit`}
              className="flex justify-between items-center p-4 rounded-lg border border-gray-100 hover:bg-gray-50"
            >
              <div>
                <p className="font-medium">{post.authorName}</p>
                <p className="text-xs text-gray-400 truncate max-w-md">
                  {post.content}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  post.isFeatured
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {post.isFeatured ? "Live" : "Hidden"}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}