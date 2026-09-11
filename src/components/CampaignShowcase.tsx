"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Campaign = {
  id: string;
  title: string;
  slug: string;
  story: string;
  coverImage?: string | null;
  currency: string;
  raisedAmount: number;
  goalAmount: string;
  progressPercent: number;
  donorCount: number;
};

type CampaignShowcaseProps = {
  campaigns: Campaign[];
};

export default function CampaignShowcase({
  campaigns,
}: CampaignShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!campaigns.length) return null;

  const active = campaigns[activeIndex];

  const selectCampaign = (index: number) => {
    if (index === activeIndex) return;
    setActiveIndex(index);
  };

  const themes = [
    {
      panel: "bg-ink",
      text: "text-paper",
      muted: "text-paper/50",
      border: "border-paper/10",
      active: "bg-paper/10",
      accent: "text-sun",
      arrow: "text-sun",
    },
    {
      panel: "bg-clay",
      text: "text-paper",
      muted: "text-paper/55",
      border: "border-paper/15",
      active: "bg-paper/10",
      accent: "text-sun",
      arrow: "text-sun",
    },
    {
      panel: "bg-sage",
      text: "text-ink",
      muted: "text-ink/50",
      border: "border-ink/10",
      active: "bg-ink/10",
      accent: "text-clay",
      arrow: "text-clay",
    },
  ];

  const theme = themes[activeIndex % themes.length];

  return (
    <section
      className="relative py-16 sm:py-24 bg-fixed bg-center bg-cover"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/diszilwhc/image/upload/v1788475606/IJE9b_bd3p2x.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-paper/80" />

      <div className="relative max-w-6xl mx-auto px-6 sm:px-12">
        <div className="mb-10 sm:mb-14">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-8 bg-clay" />
            <p className="font-mono text-clay text-xs tracking-[0.2em] uppercase">
              Make an impact
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-ink">
                Active Campaigns
              </h2>
            </div>

            <Link
              href="/campaigns"
              className="text-sm font-medium text-ink/50 hover:text-ink transition"
            >
              See all campaigns →
            </Link>
          </div>
        </div>

        <div
          className={`grid grid-cols-1 lg:grid-cols-[1.45fr_0.75fr] gap-0 rounded-2xl overflow-hidden transition-colors duration-500 ${theme.panel}`}
        >
          {/* PRIMARY IMAGE */}
          <div className="relative aspect-[16/11] sm:aspect-[16/10] lg:aspect-auto lg:min-h-[620px] overflow-hidden bg-ink">
            {active.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={active.coverImage}
                src={active.coverImage}
                alt={active.title}
                className="absolute inset-0 w-full h-full object-cover animate-[campaignFade_500ms_ease]"
              />
            ) : (
              <div className="absolute inset-0 bg-ink" />
            )}

            <div className="absolute inset-0 bg-gradient-to-br from-ink/55 via-transparent to-clay/25 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-ink via-ink/60 to-transparent" />
            <div className="absolute inset-0 bg-sun/5 mix-blend-screen" />

            {/* MINIMAL OVERLAY — just title + CTA, no glass card.
                Story, progress, and full stats already live in the side
                panel's campaign list, so repeating them here just ate
                into the photo. */}
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10 text-paper">
              <div className="max-w-xl">
                <div className="flex items-center gap-3 mb-3">
                  <p className="font-mono text-sun text-[10px] tracking-[0.18em] uppercase">
                    Active Campaign
                  </p>
                  <span className="text-paper/30">·</span>
                  <p className="font-mono text-[10px] text-paper/60">
                    {active.progressPercent}% funded
                  </p>
                </div>

                <h3 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl leading-tight tracking-tight mb-5">
                  {active.title}
                </h3>

                <Link
                  href={`/campaigns/${active.slug}`}
                  className="inline-flex items-center gap-1.5 bg-sun text-ink px-5 py-2.5 rounded-full font-semibold text-sm hover:brightness-105 transition"
                >
                  Give Now
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>

          {/* CAMPAIGN SELECTOR / THEMED PANEL */}
          <div className={`flex flex-col min-h-[620px] ${theme.text} ${theme.panel}`}>
            <div className="px-5 pt-6 sm:px-6 sm:pt-7 pb-5">
              <p className={`font-mono ${theme.muted} text-[10px] tracking-[0.18em] uppercase`}>
                Explore active campaigns
              </p>
              <div className="mt-3">
                <p className="font-display font-bold text-xl leading-tight">
                  Choose where
                  <br />
                  your support goes.
                </p>
              </div>
            </div>

            <div className={`border-t ${theme.border}`}>
              {campaigns.map((campaign, index) => {
                const isActive = index === activeIndex;

                return (
                  <button
                    key={campaign.id}
                    type="button"
                    onClick={() => selectCampaign(index)}
                    className={`w-full text-left border-b ${theme.border} px-5 sm:px-6 py-5 transition-all group ${
                      isActive ? `${theme.active} opacity-100` : "opacity-50 hover:opacity-90"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <span
                        className={`font-mono text-xs pt-1 transition-colors ${
                          isActive ? theme.accent : theme.muted
                        }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <h4
                            className={`font-display font-bold text-lg sm:text-xl leading-snug tracking-tight ${
                              isActive ? "" : "opacity-80"
                            }`}
                          >
                            {campaign.title}
                          </h4>

                          <ArrowRight
                            size={17}
                            className={`shrink-0 mt-1 transition-all ${
                              isActive
                                ? `${theme.arrow} translate-x-0`
                                : "-translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
                            }`}
                          />
                        </div>

                        <p className={`${theme.muted} text-xs sm:text-sm leading-relaxed mt-2 line-clamp-2`}>
                          {campaign.story}
                        </p>

                        <p className={`font-mono text-[10px] sm:text-xs ${theme.accent} mt-3`}>
                          {campaign.progressPercent}% funded
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-auto px-5 sm:px-6 py-6">
              <Link
                href="/campaigns"
                className={`group inline-flex items-center gap-2 text-sm font-semibold ${theme.muted} hover:opacity-100 transition`}
              >
                Explore every campaign
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes campaignFade {
          from {
            opacity: 0;
            transform: scale(1.025);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </section>
  );
}