import { notFound } from "next/navigation";
import Link from "next/link";
import { getActivityBySlug } from "@/lib/activities";
import CldImage from "@/components/CldImage";

export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const activity = await getActivityBySlug(slug);

  if (!activity || !activity.isPublished) notFound();

  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-12 py-16 sm:py-20 space-y-10">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <p className="font-mono text-clay text-xs tracking-[0.16em] uppercase">
            {activity.type.replace("_", " ")}
          </p>
          {activity.campaign && (
            <>
              <span className="opacity-30">·</span>
              <Link
                href={`/campaigns/${activity.campaign.slug}`}
                className="text-sm underline text-ink/50 hover:text-ink"
              >
                {activity.campaign.title}
              </Link>
            </>
          )}
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight leading-tight">
          {activity.title}
        </h1>
      </div>

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
        <div className="aspect-video rounded-2xl overflow-hidden">
          <video controls className="w-full h-full" src={activity.mediaUrls[0]} />
        </div>
      )}

      {activity.type === "POD" && activity.mediaUrls[0] && (
        <audio controls className="w-full">
          <source src={activity.mediaUrls[0]} />
        </audio>
      )}

      <p className="text-ink/70 text-lg whitespace-pre-line leading-relaxed">
        {activity.body}
      </p>

      {activity.author && (
        <p className="text-sm text-ink/40 pt-6 border-t border-ink/10">
          Posted by {activity.author.fullName}
        </p>
      )}
    </div>
  );
}