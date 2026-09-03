import Link from "next/link";
import { SITE_TAGLINE, SITE_HASHTAG } from "@/lib/config";
import { listActiveCampaigns } from "@/lib/campaigns";
import { listPublishedActivities } from "@/lib/activities";
import { getSupporterCount } from "@/lib/supporters";
import { WaveformProgress, WaveformDivider } from "@/components/Waveform";
import NewsletterForm from "@/components/NewsletterForm";
import prisma from "@/lib/prisma";
import { BookOpen, Utensils, HeartPulse, ShieldCheck, Heart } from "lucide-react";

import FeaturedVideoSection from "@/components/FeaturedVideoSection";
import CampaignShowcase from "@/components/CampignShowcase";
import JoinMovementCTA from "@/components/JoinMovementCTA";

const HERO_IMAGE_URL =
  "https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=1600";
const HERO_VIDEO_URL: string | null =
  "https://res.cloudinary.com/diszilwhc/video/upload/v1788008803/GeneralBackgroundVideo-opt_f4xf86.mp4";

const PANEL_THEMES = [
  { bg: "bg-ink", text: "text-paper", accent: "text-sun" },
  { bg: "bg-papyrus", text: "text-paper", accent: "text-sun" },
  { bg: "bg-clay", text: "text-paper", accent: "text-paper" },
];

export default async function Home() {
  const [
  campaigns,
  activities,
  supporterCount,
  supportPosts,
  pressMentions,
  partners,
  featuredVideos,        
  totalRaised,
  activeCampaignCount,
] = await Promise.all([
  listActiveCampaigns(),
  listPublishedActivities("ALL"),
  getSupporterCount(),
  prisma.supportPost.findMany({
    where: { isFeatured: true },
    orderBy: { createdAt: "desc" },
    take: 3,
  }),
  prisma.pressMention.findMany({ take: 6 }),
  prisma.partner.findMany({
    where: { status: "ACTIVE" },
    take: 8,
  }),
  // ✅ only the findMany (removed the old findFirst)
  prisma.activity.findMany({
    where: { type: "VIDEO", isPublished: true },
    orderBy: { publishedAt: "desc" },
    take: 6,
  }),
  prisma.donation.aggregate({
    where: { status: "SUCCESSFUL" },
    _sum: { amount: true },
  }),
  prisma.campaign.count({ where: { status: "ACTIVE" } }),
]);


  const featuredActivities = activities.slice(0, 6);
  const raisedTotal = totalRaised._sum.amount?.toNumber() ?? 0;

  return (
    <div>
      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="relative min-h-[88vh] flex flex-col justify-end px-6 sm:px-12 pb-16 sm:pb-20 text-paper overflow-hidden">
        {HERO_VIDEO_URL ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={HERO_IMAGE_URL}
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={HERO_VIDEO_URL} type="video/mp4" />
          </video>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={HERO_IMAGE_URL}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/15" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/20 via-transparent to-transparent" />

        <div className="relative max-w-3xl">
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px w-8 bg-sun" />
            <p className="font-mono text-sun text-xs sm:text-sm tracking-[0.2em] uppercase">
              {SITE_HASHTAG}
            </p>
          </div>

          <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl leading-[1.02] tracking-tight mb-5">
            {SITE_TAGLINE}
          </h1>

          <p className="text-paper/80 text-base sm:text-lg max-w-xl mb-9 leading-relaxed">
            Supporting women, children, and communities across Uganda through education, food, healthcare, entertainment, and protection.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/campaigns"
              className="bg-sun text-ink px-7 py-3 rounded-full font-semibold text-sm hover:brightness-105 transition inline-flex items-center gap-2"
            >
              Give today <Heart fill="currentColor" className="size-4" />
            </Link>
            <Link
              href="/get-involved"
              className="border border-paper/35 text-paper px-7 py-3 rounded-full font-semibold text-sm hover:bg-paper/10 transition"
            >
              Get involved
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Trust stats ──────────────────────────────────────── */}
<section className="bg-paper border-b border-ink/8 px-6 sm:px-12 py-12 sm:py-14">
  <div className="max-w-5xl mx-auto">
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-0 text-center sm:divide-x sm:divide-ink/10">
      
      {/* Raised */}
      <div className="sm:px-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/40 mb-3">
          Raised so far
        </p>
        <p className="font-display font-extrabold text-3xl sm:text-4xl text-clay tracking-tight">
          USD {raisedTotal.toLocaleString()}
        </p>
      </div>

      {/* Active campaigns */}
      <div className="sm:px-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/40 mb-3">
          Active campaigns
        </p>
        <p className="font-display font-extrabold text-3xl sm:text-4xl text-clay tracking-tight">
          {activeCampaignCount}
        </p>
      </div>

      {/* Supporters */}
      <div className="sm:px-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/40 mb-3">
          Donors & supporters
        </p>
        <p className="font-display font-extrabold text-3xl sm:text-4xl text-clay tracking-tight">
          {supporterCount.toLocaleString()}
        </p>
      </div>
    </div>

    {/* Link */}
    <div className="mt-10 text-center">
      <Link
        href="/transparency"
        className="inline-flex items-center gap-1.5 text-sm text-ink/50 hover:text-ink transition"
      >
        See the full breakdown
        <span className="transition-transform group-hover:translate-x-0.5">→</span>
      </Link>
    </div>
  </div>
</section>

      {/* ─── Campaign panels ──────────────────────────────────── */}
      {campaigns.length > 0 && (
        <CampaignShowcase
          campaigns={campaigns.map((campaign) => ({
            id: campaign.id,
            title: campaign.title,
            slug: campaign.slug,
            story: campaign.story,
            coverImage: campaign.coverImage,
            currency: campaign.currency,
            goalAmount: campaign.goalAmount.toString(),
            raisedAmount: Number(campaign.raisedAmount),
            progressPercent: Number(campaign.progressPercent),
            donorCount: Number(campaign.donorCount),
          }))}
        />
      )}

     {/* ─── What We Do ───────────────────────────────────────── */}
<section className="bg-paper px-6 sm:px-12 py-20 sm:py-28 overflow-hidden">
  <div className="max-w-5xl mx-auto mb-16">
    <p className="font-mono text-clay text-xs tracking-[0.18em] uppercase mb-4 text-center">
      Our focus
    </p>
    <h2 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight text-center text-ink">
      What We Deliver
    </h2>
  </div>

  {/* ── Dual Row Marquee ── */}
  <div className="relative">
    {/* Edge fade masks */}
    <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-40 bg-gradient-to-r from-paper to-transparent z-20" />
    <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-40 bg-gradient-to-l from-paper to-transparent z-20" />

    {/* ── Row 1 →  */}
    <div className="group mb-8 overflow-hidden">
      <div className="flex w-max animate-marquee-left group-hover:[animation-play-state:paused]">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex gap-6 pr-6">
            {[
              {
                img: "https://res.cloudinary.com/diszilwhc/image/upload/v1788477304/Screenshot_2026-09-04_025416_f2biax.png?w=400&h=300&fit=crop",
                Icon: BookOpen,
                title: "Education",
                body: "Helping children and women access the education that opens doors.",
              },
              {
                img: "https://res.cloudinary.com/diszilwhc/image/upload/v1788477304/Screenshot_2026-09-04_025516_n4gude.png?w=400&h=300&fit=crop",
                Icon: Utensils,
                title: "Food",
                body: "Meals and food security for families who need it most.",
              },
              {
                img: "https://res.cloudinary.com/diszilwhc/image/upload/v1788477304/Screenshot_2026-09-04_025449_qcdlwg.png?w=400&h=300&fit=crop",
                Icon: HeartPulse,
                title: "Healthcare",
                body: "Access to healthcare and wellbeing support for vulnerable communities.",
              },
              {
                img: "https://res.cloudinary.com/diszilwhc/image/upload/v1788477304/Screenshot_2026-09-04_025347_tbmqtz.png?w=400&h=300&fit=crop",
                Icon: ShieldCheck,
                title: "Protection",
                body: "Standing against violence and exploitation, and protecting the rights of women and children.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex w-[420px] sm:w-[480px] h-40 rounded-2xl overflow-hidden shadow-md"
              >
                {/* Image + soft sun fade */}
                <div className="relative w-2/5 h-full flex-shrink-0">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Blur-fade from sun into the photo */}
                  <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-sun via-sun/60 to-transparent" />
                </div>

                {/* Content – sun */}
                <div className="w-3/5 p-5 flex flex-col justify-center bg-sun text-ink">
                  <item.Icon className="text-ink mb-2" size={22} strokeWidth={1.75} />
                  <h3 className="font-display font-bold text-lg mb-1.5 text-ink">
                    {item.title}
                  </h3>
                  <p className="text-ink/70 text-sm leading-relaxed line-clamp-2">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>

    {/* ── Row 2 ← (swapped layout) ── */}
    <div className="group overflow-hidden">
      <div className="flex w-max animate-marquee-right group-hover:[animation-play-state:paused]">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex gap-6 pr-6">
            {[
              {
                img: "https://res.cloudinary.com/diszilwhc/image/upload/v1788477304/Screenshot_2026-09-04_025449_qcdlwg.png?w=400&h=300&fit=crop",
                Icon: HeartPulse,
                title: "Healthcare",
                body: "Access to healthcare and wellbeing support for vulnerable communities.",
              },
              {
                img: "https://res.cloudinary.com/diszilwhc/image/upload/v1788477304/Screenshot_2026-09-04_025347_tbmqtz.png?w=400&h=300&fit=crop",
                Icon: ShieldCheck,
                title: "Protection",
                body: "Standing against violence and exploitation, and protecting the rights of women and children.",
              },
              {
                img: "https://res.cloudinary.com/diszilwhc/image/upload/v1788477304/Screenshot_2026-09-04_025416_f2biax.png?w=400&h=300&fit=crop",
                Icon: BookOpen,
                title: "Education",
                body: "Helping children and women access the education that opens doors.",
              },
              {
                img: "https://res.cloudinary.com/diszilwhc/image/upload/v1788477304/Screenshot_2026-09-04_025516_n4gude.png?w=400&h=300&fit=crop",
                Icon: Utensils,
                title: "Food",
                body: "Meals and food security for families who need it most.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex w-[420px] sm:w-[480px] h-40 rounded-2xl overflow-hidden shadow-md"
              >
                {/* Content – sun (left) */}
                <div className="w-3/5 p-5 flex flex-col justify-center bg-sun text-ink order-1">
                  <item.Icon className="text-ink mb-2" size={22} strokeWidth={1.75} />
                  <h3 className="font-display font-bold text-lg mb-1.5 text-ink">
                    {item.title}
                  </h3>
                  <p className="text-ink/70 text-sm leading-relaxed line-clamp-2">
                    {item.body}
                  </p>
                </div>

                {/* Image + soft sun fade (right) */}
                <div className="relative w-2/5 h-full flex-shrink-0 order-2">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Blur-fade from sun into the photo */}
                  <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-sun via-sun/60 to-transparent" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
</section>

    {featuredVideos.length > 0 && (
    <FeaturedVideoSection
      videos={featuredVideos.map((v) => ({
        title: v.title,
        slug: v.slug,
        mediaUrl: v.mediaUrls[0],
        posterUrl: v.mediaUrls[1] ?? null,
        excerpt: v.excerpt ?? null,
        location: v.location ?? null,
        publishedAt: v.publishedAt,
      }))}
    />
  )}

      

                       {/* ─── Momentum ─────────────────────────────────────────── */}
      <section className="relative bg-sun text-ink px-6 sm:px-12 py-16 sm:py-20 text-center overflow-hidden">
        <p className="font-mono text-xs tracking-[0.2em] uppercase mb-4 opacity-60">
          {SITE_HASHTAG}
        </p>
        <h2 className="font-display font-extrabold text-3xl sm:text-5xl leading-[1.1] tracking-tight mb-4">
          {supporterCount.toLocaleString()} people
          <br className="hidden sm:block" />
          have joined this movement.
        </h2>
        <p className="text-base sm:text-lg opacity-70 max-w-md mx-auto mb-8 leading-relaxed">
          Every share, every gift, every follow adds a voice. Add yours —
          tag {SITE_HASHTAG} when you do.
        </p>

        <div className="mb-8">
          <JoinMovementCTA />
        </div>

        <div className="max-w-xs mx-auto opacity-40 mb-4">
          <WaveformDivider />
        </div>

        {/* Friends of the foundation — only if real partners exist */}
        {partners.length > 0 && (
          <div className="mt-10 pt-8 border-t border-ink/10">
            <p className="text-sm opacity-60 mb-6">
              With love and support from our friends
            </p>
            <div className="flex flex-wrap justify-center items-start gap-x-10 gap-y-8">
              {partners.map((partner) => {
                const content = (
                  <div className="flex flex-col items-center gap-2 w-24">
                    {partner.logoUrl ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={partner.logoUrl}
                          alt={partner.name}
                          className="h-8 max-w-24 object-contain"
                        />
                        <span className="text-xs opacity-60 text-center leading-tight">
                          {partner.name}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm font-semibold opacity-70 text-center leading-tight">
                        {partner.name}
                      </span>
                    )}
                  </div>
                );

                return partner.website ? (
                  <a
                    key={partner.id}
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-70 hover:opacity-100 transition"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={partner.id}>{content}</div>
                );
              })}
            </div>
          </div>
        )}
      </section>




      {/* ─── Field Notes — staggered blog cards ───────────────── */}
{featuredActivities.length > 0 && (
  <section
    className="relative py-16 sm:py-24 bg-fixed bg-center bg-cover"
    style={{
      backgroundImage:
        "url('https://res.cloudinary.com/diszilwhc/image/upload/v1788475606/IJE9b_bd3p2x.jpg')",
    }}
  >
    {/* Background overlay */}
    <div className="absolute inset-0 bg-ink/75" />

    {/* Content */}
    <div className="relative">
      <div className="px-6 sm:px-12 mb-12 sm:mb-16 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <span className="h-px w-8 bg-sun" />
          <p className="font-mono text-sun text-xs tracking-[0.2em] uppercase">
            {SITE_HASHTAG}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="font-mono text-paper/50 text-xs tracking-[0.18em] uppercase mb-2">
              Proof it&apos;s real
            </p>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-paper tracking-tight">
              Field Notes
            </h2>
          </div>
          <Link
            href="/field-notes"
            className="text-sm font-medium text-paper/55 hover:text-paper transition"
          >
            See all →
          </Link>
        </div>
      </div>

      <div className="space-y-8 sm:space-y-12">
        {featuredActivities.map((activity, i) => {
          const isLeft = i % 2 === 0;

          // Format date
          const date = activity.publishedAt
            ? new Date(activity.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : null;

          // Truncate description
          const rawDesc =
            activity.excerpt || activity.body || activity.content || "";
          const description =
            rawDesc.length > 120
              ? rawDesc.slice(0, 120).trim() + "..."
              : rawDesc;

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
              {/* Image */}
              <div className="relative w-full sm:w-[48%] aspect-[16/10] sm:aspect-auto sm:min-h-[280px] overflow-hidden">
                {activity.mediaUrls[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={activity.mediaUrls[0]}
                    alt={activity.title}
                    className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-papyrus" />
                )}
              </div>

              {/* Content */}
              <div
                className={`w-full sm:w-[52%] flex flex-col justify-center px-6 sm:px-10 py-8 sm:py-10 ${
                  isLeft ? "bg-paper text-ink" : "bg-papyrus text-paper"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <p
                    className={`font-mono text-[11px] tracking-[0.16em] uppercase ${
                      isLeft ? "text-clay" : "text-sun"
                    }`}
                  >
                    {activity.type.replace("_", " ")}
                  </p>
                  {date && (
                    <>
                      <span className={isLeft ? "text-ink/30" : "text-paper/30"}>
                        ·
                      </span>
                      <p
                        className={`font-mono text-[11px] tracking-[0.08em] ${
                          isLeft ? "text-ink/50" : "text-paper/50"
                        }`}
                      >
                        {date}
                      </p>
                    </>
                  )}
                </div>

                <h3 className="font-display font-bold text-xl sm:text-2xl lg:text-3xl leading-snug tracking-tight mb-3">
                  {activity.title}
                </h3>

                {description && (
                  <p
                    className={`text-sm leading-relaxed mb-5 line-clamp-2 ${
                      isLeft ? "text-ink/60" : "text-paper/70"
                    }`}
                  >
                    {description}
                  </p>
                )}

                <span
                  className={`inline-flex items-center gap-1.5 text-sm font-semibold ${
                    isLeft ? "text-ink" : "text-sun"
                  }`}
                >
                  Read the note
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-12 sm:mt-16 text-center px-6">
        <Link
          href="/field-notes"
          className="inline-flex items-center gap-2 border border-paper/25 text-paper px-6 py-3 rounded-full text-sm font-semibold hover:bg-paper/10 transition"
        >
          View all Field Notes
          <span>→</span>
        </Link>
      </div>
    </div>
  </section>
)}

      {/* ─── Wall of Support ──────────────────────────────────── */}
      {supportPosts.length > 0 && (
        <section className="bg-paper py-14 sm:py-20 px-6 sm:px-12">
          <div className="max-w-5xl mx-auto">
            <p className="font-mono text-clay text-xs tracking-[0.18em] uppercase mb-3">
              In their words
            </p>
            <div className="flex justify-between items-end mb-10 gap-4">
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight">
                Wall of Support
              </h2>
              <Link
                href="/wall-of-support"
                className="text-sm font-medium text-ink/50 hover:text-ink transition hidden sm:block"
              >
                See all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {supportPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-ink text-paper rounded-2xl rounded-bl-md p-5 sm:p-6"
                >
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
          </div>
        </section>
      )}

      {/* ─── Press ────────────────────────────────────────────── */}
      {pressMentions.length > 0 && (
        <section className="bg-paper border-t border-ink/8 py-10 px-6 sm:px-12">
          <p className="text-center font-mono text-[11px] uppercase tracking-[0.2em] text-ink/35 mb-7">
            As seen in
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-6">
            {pressMentions.map((mention) => (
              <a
                key={mention.id}
                href={mention.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink/45 hover:text-ink transition text-sm font-semibold grayscale hover:grayscale-0"
              >
                {mention.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={mention.logoUrl} alt={mention.outletName} className="h-7" />
                ) : (
                  mention.outletName
                )}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* ─── Newsletter ───────────────────────────────────────── */}
      <section className="bg-papyrus text-paper py-16 sm:py-20 px-6 sm:px-12 text-center">
        <h2 className="font-display font-extrabold text-2xl sm:text-4xl tracking-tight mb-3">
          Don&apos;t miss what happens next with your supported campaigns.
        </h2>
        <p className="text-paper/70 text-sm sm:text-base max-w-md mx-auto mb-7 leading-relaxed">
          One email whenever there&apos;s a new update, story, or campaign to support. No spam, ever.
        </p>
        <div className="flex justify-center">
          <NewsletterForm />
        </div>
      </section>

      {/* ─── Closing ──────────────────────────────────────────── */}
      <section className="grid grid-cols-1 sm:grid-cols-2 min-h-[55vh]">
        <div className="relative min-h-[40vh] sm:min-h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://res.cloudinary.com/diszilwhc/image/upload/v1788475327/BNBjZ_rwjtet.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div className="bg-ink text-paper flex flex-col justify-center px-8 sm:px-14 lg:px-16 py-14 sm:py-16">
         <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl leading-[1.15] tracking-tight mb-7">
  Join <span className="text-sun">{SITE_HASHTAG}</span> today and help us support women, children, and communities.
</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/campaigns"
              className="bg-sun text-ink px-6 py-3 rounded-full font-semibold text-sm hover:brightness-105 transition"
            >
              Give Now
            </Link>
            <Link
              href="/wall-of-support"
              className="border border-paper/30 text-paper px-6 py-3 rounded-full font-semibold text-sm hover:bg-paper/10 transition"
            >
              Follow the Movement
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}