import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function AdminPressPage() {
  const mentions = await prisma.pressMention.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Press & Media</h1>
        <Link
          href="/admin/press/new"
          className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          + New Mention
        </Link>
      </div>

      {mentions.length === 0 ? (
        <p className="text-gray-500 text-sm">No press mentions yet.</p>
      ) : (
        <div className="space-y-2">
          {mentions.map((mention) => (
            <Link
              key={mention.id}
              href={`/admin/press/${mention.id}/edit`}
              className="flex justify-between items-center p-4 rounded-lg border border-gray-100 hover:bg-gray-50"
            >
              <div>
                <p className="font-medium">{mention.title}</p>
                <p className="text-xs text-gray-400">{mention.outletName}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}