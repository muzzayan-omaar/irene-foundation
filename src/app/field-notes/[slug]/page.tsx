import { notFound } from "next/navigation";
import Link from "next/link";
import { getActivityBySlug } from "@/lib/activities";
import ShareButtons from "@/components/ShareButtons";
import CampaignGallery from "@/components/CampaignGallery";

export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const activity = await getActivityBySlug(slug);

  if (!activity || !activity.isPublished) notFound();

  const activityUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/field-notes/${activity.slug}`;
  const publishedDate = activity.publishedAt
    ? new Date(activity.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-12 py-16 space-y-10">
      <div>
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
          <span className="uppercase tracking-wide font-mono text-clay">
            {activity.type.replace("_", " ")}
          </span>
          {publishedDate && (
            <>
              <span>·</span>
              <span>{publishedDate}</span>
            </>
          )}
          {activity.campaign && (
            <>
              <span>·</span>
              <Link href={`/campaigns/${activity.campaign.slug}`} className="underline">
                {activity.campaign.title}
              </Link>
            </>
          )}
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl">
          {activity.title}
        </h1>
      </div>

      {/* Photo Story — your masonry gallery with lightbox */}
      {activity.type === "PHOTO_STORY" && activity.mediaUrls.length > 0 && (
        <CampaignGallery images={activity.mediaUrls} campaignUrl={activityUrl} />
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

      <div className="flex items-center justify-between pt-6 border-t border-ink/10">
        {activity.author && (
          <p className="text-sm text-gray-400">Posted by {activity.author.fullName}</p>
        )}
        <ShareButtons title={activity.title} url={activityUrl} />
      </div>

      {/* Participate CTA — reuses the existing Get Involved volunteer form */}
      <div className="p-6 rounded-2xl bg-papyrus text-paper text-center">
        <h2 className="font-display font-bold text-xl mb-2">
          Want to be part of what happens next?
        </h2>
        <p className="text-paper/80 text-sm mb-5 max-w-md mx-auto">
          We're always looking for people to help with activities like this
          one — on the ground, remotely, or with a specific skill.
        </p>
        <Link
          href="/get-involved#volunteer"
          className="inline-block bg-sun text-ink px-6 py-3 rounded-full font-semibold text-sm hover:brightness-105 transition"
        >
          Join an Upcoming Activity
        </Link>
      </div>
    </div>
  );
}