import Link from "next/link";
import { listPublishedActivities, type ActivityTypeFilter } from "@/lib/activities";
import { getServerLocale } from "@/lib/i18n/getServerLocale";
import { translate } from "@/lib/i18n/translations";

export default async function FieldNotesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);

  const FILTERS: { key: string; value: ActivityTypeFilter }[] = [
    { key: "filter_all", value: "ALL" },
    { key: "filter_updates", value: "UPDATE" },
    { key: "filter_photoStories", value: "PHOTO_STORY" },
    { key: "filter_video", value: "VIDEO" },
    { key: "filter_pods", value: "POD" },
  ];

  const params = await searchParams;
  const activeType = (params.type as ActivityTypeFilter) || "ALL";
  const activities = await listPublishedActivities(activeType);

  return (
    <div>
      <div className="px-6 sm:px-12 py-16 sm:py-20 max-w-5xl mx-auto">
        <p className="font-mono text-clay text-xs tracking-[0.18em] uppercase mb-4">
          {t("fieldNotes_eyebrow")}
        </p>
        <h1 className="font-display font-extrabold text-4xl sm:text-6xl tracking-tight mb-6">
          {t("fieldNotes_title")}
        </h1>
        <p className="text-ink/60 text-lg max-w-xl mb-10">
          {t("fieldNotes_subtitle")}
        </p>

        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <Link
              key={f.value}
              href={f.value === "ALL" ? "/field-notes" : `/field-notes?type=${f.value}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeType === f.value
                  ? "bg-ink text-paper"
                  : "border border-ink/15 text-ink/60 hover:border-ink/30"
              }`}
            >
              {t(f.key)}
            </Link>
          ))}
        </div>
      </div>

      {activities.length === 0 ? (
        <p className="text-ink/40 px-6 sm:px-12 pb-20">{t("fieldNotes_empty")}</p>
      ) : (
        <div className="bg-paper pb-16 sm:pb-24 space-y-8 sm:space-y-12">
          {activities.map((activity, i) => {
            const isLeft = i % 2 === 0;

            return (
              <Link
                key={activity.id}
                href={`/field-notes/${activity.slug}`}
                className={`group flex flex-col sm:flex-row items-stretch overflow-hidden ${
                  isLeft
                    ? "sm:mr-[12%] lg:mr-[18%]"
                    : "sm:ml-[12%] lg:ml-[18%] sm:flex-row-reverse"
                }`}
              >
                <div className="relative w-full sm:w-[48%] aspect-[16/10] sm:aspect-auto sm:min-h-[280px] overflow-hidden">
                  {activity.mediaUrls[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={activity.mediaUrls[0]}
                      alt={activity.title}
                      className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-papyrus flex items-center justify-center text-paper/40 text-sm">
                      {activity.type.replace("_", " ")}
                    </div>
                  )}
                </div>

                <div
                  className={`w-full sm:w-[52%] flex flex-col justify-center px-6 sm:px-10 py-8 sm:py-10 ${
                    isLeft ? "bg-paper text-ink border border-ink/10" : "bg-papyrus text-paper"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <p
                      className={`font-mono text-[11px] tracking-[0.16em] uppercase ${
                        isLeft ? "text-clay" : "text-sun"
                      }`}
                    >
                      {activity.type.replace("_", " ")}
                    </p>
                    {activity.campaign && (
                      <>
                        <span className="opacity-30">·</span>
                        <span className={`text-xs ${isLeft ? "text-ink/50" : "text-paper/60"}`}>
                          {activity.campaign.title}
                        </span>
                      </>
                    )}
                  </div>
                  <h2 className="font-display font-bold text-xl sm:text-2xl lg:text-3xl leading-snug tracking-tight mb-3">
                    {activity.title}
                  </h2>
                  <p
                    className={`text-sm leading-relaxed mb-5 line-clamp-2 ${
                      isLeft ? "text-ink/60" : "text-paper/70"
                    }`}
                  >
                    {activity.body.slice(0, 140)}
                    {activity.body.length > 140 ? "…" : ""}
                  </p>
                  <span
                    className={`inline-flex items-center gap-1.5 text-sm font-semibold ${
                      isLeft ? "text-ink" : "text-sun"
                    }`}
                  >
                    {t("fieldNotes_readNote")}
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
