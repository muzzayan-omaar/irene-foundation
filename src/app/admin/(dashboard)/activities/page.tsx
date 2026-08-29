import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function AdminActivitiesPage() {
  const activities = await prisma.activity.findMany({
    include: { campaign: { select: { title: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Activities</h1>
        <Link
          href="/admin/activities/new"
          className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          + New Activity
        </Link>
      </div>

      {activities.length === 0 ? (
        <p className="text-gray-500 text-sm">No activities yet.</p>
      ) : (
        <div className="space-y-2">
          {activities.map((activity) => (
            <Link
              key={activity.id}
              href={`/admin/activities/${activity.id}/edit`}
              className="flex justify-between items-center p-4 rounded-lg border border-gray-100 hover:bg-gray-50"
            >
              <div>
                <p className="font-medium">{activity.title}</p>
                <p className="text-xs text-gray-400">
                  {activity.type.replace("_", " ")}
                  {activity.campaign && ` · ${activity.campaign.title}`}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  activity.isPublished
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {activity.isPublished ? "Published" : "Draft"}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}