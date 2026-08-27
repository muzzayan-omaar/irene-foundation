import Link from "next/link";
import { listPublishedActivities, type ActivityTypeFilter } from "@/lib/activities";

const FILTERS: { label: string; value: ActivityTypeFilter }[] = [
  { label: "All", value: "ALL" },
  { label: "Updates", value: "UPDATE" },
  { label: "Photo Stories", value: "PHOTO_STORY" },
  { label: "Video", value: "VIDEO" },
  { label: "Pods", value: "POD" },
];

export default async function FieldNotesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;
  const activeType = (params.type as ActivityTypeFilter) || "ALL";
  const activities = await listPublishedActivities(activeType);

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-2">Field Notes</h1>
      <p className="text-gray-600 mb-8">
        Real updates from real work — see exactly what your support makes possible.
      </p>

      <div className="flex gap-2 mb-10 flex-wrap">
        {FILTERS.map((f) => (
          <Link
            key={f.value}
            href={f.value === "ALL" ? "/field-notes" : `/field-notes?type=${f.value}`}
            className={`px-4 py-1.5 rounded-full text-sm border ${
              activeType === f.value
                ? "bg-gray-900 text-white border-gray-900"
                : "border-gray-200 text-gray-600"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {activities.length === 0 ? (
        <p className="text-gray-500">Nothing here yet — check back soon.</p>
      ) : (
        <div className="space-y-6">
          {activities.map((activity) => (
            <Link
              key={activity.id}
              href={`/field-notes/${activity.slug}`}
              className="block p-5 rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                <span className="uppercase tracking-wide">{activity.type.replace("_", " ")}</span>
                {activity.campaign && (
                  <>
                    <span>·</span>
                    <span>{activity.campaign.title}</span>
                  </>
                )}
              </div>
              <h2 className="font-semibold text-lg mb-1">{activity.title}</h2>
              <p className="text-gray-600 text-sm line-clamp-2">
                {activity.body.slice(0, 160)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
