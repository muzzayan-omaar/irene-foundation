import { notFound } from "next/navigation";
import Link from "next/link";
import { getActivityBySlug } from "@/lib/activities";
import { CldImage } from "next-cloudinary";

export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const activity = await getActivityBySlug(slug);

  if (!activity || !activity.isPublished) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
          <span className="uppercase tracking-wide">{activity.type.replace("_", " ")}</span>
          {activity.campaign && (
            <>
              <span>·</span>
              <Link href={`/campaigns/${activity.campaign.slug}`} className="underline">
                {activity.campaign.title}
              </Link>
            </>
          )}
        </div>
        <h1 className="text-3xl font-bold">{activity.title}</h1>
      </div>

      {/* Media rendering varies by activity type */}
      {activity.type === "PHOTO_STORY" && activity.mediaUrls.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {activity.mediaUrls.map((url, i) => (
            <CldImage
              key={i}
              src={url}
              alt={`${activity.title} photo ${i + 1}`}
              width={600}
              height={400}
              className="rounded-lg object-cover w-full h-full"
            />
          ))}
        </div>
      )}

      {activity.type === "VIDEO" && activity.mediaUrls[0] && (
        <div className="aspect-video rounded-lg overflow-hidden">
          <video controls className="w-full h-full" src={activity.mediaUrls[0]} />
        </div>
      )}

      {activity.type === "POD" && activity.mediaUrls[0] && (
        <audio controls className="w-full">
          <source src={activity.mediaUrls[0]} />
        </audio>
      )}

      <p className="text-gray-700 whitespace-pre-line leading-relaxed">
        {activity.body}
      </p>

      {activity.author && (
        <p className="text-sm text-gray-400 pt-4 border-t border-gray-100">
          Posted by {activity.author.fullName}
        </p>
      )}
    </div>
  );
}
