
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Play, ChevronLeft, ChevronRight, X } from "lucide-react";

export type FeaturedVideo = {
  title: string;
  slug: string;
  mediaUrl: string;
  posterUrl?: string | null;
  excerpt?: string | null;
  location?: string | null;
  publishedAt?: Date | string | null;
};

type FeaturedVideoSectionProps = {
  videos: FeaturedVideo[];
};

function getVideoThumbnail(
  mediaUrl: string,
  posterUrl?: string | null
): string | null {
  // Use an explicitly stored poster first
  if (posterUrl) return posterUrl;

  // Automatically generate a Cloudinary thumbnail
  if (mediaUrl.includes("res.cloudinary.com")) {
    return mediaUrl
      .replace("/video/upload/", "/video/upload/so_0/")
      .replace(/\.(mp4|mov|webm|m4v)(\?.*)?$/i, ".jpg");
  }

  return null;
}

export default function FeaturedVideoSection({
  videos,
}: FeaturedVideoSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const modalVideoRef = useRef<HTMLVideoElement>(null);

  const active = videos[activeIndex];
  const activeThumbnail = getVideoThumbnail(
  active.mediaUrl,
  active.posterUrl
);

  const goTo = (index: number) => {
    if (index < 0 || index >= videos.length) return;

    // Close modal if switching videos
    setIsModalOpen(false);
    setActiveIndex(index);
  };

  const openVideo = () => {
    setIsModalOpen(true);
  };

  const closeVideo = () => {
    if (modalVideoRef.current) {
      modalVideoRef.current.pause();
      modalVideoRef.current.currentTime = 0;
    }

    setIsModalOpen(false);
  };

  // Stop the video whenever the modal closes
  useEffect(() => {
    if (!isModalOpen && modalVideoRef.current) {
      modalVideoRef.current.pause();
      modalVideoRef.current.currentTime = 0;
    }
  }, [isModalOpen]);

  // Allow ESC to close the modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeVideo();
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  const dateLabel = active.publishedAt
    ? new Date(active.publishedAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  if (!videos.length) return null;

  return (
    <>
      <section className="relative bg-ink py-20 sm:py-28 overflow-hidden">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[55%] bg-sun/6 blur-[140px] rounded-full" />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 sm:px-12">
          {/* Section label + slider controls */}
          <div className="flex items-center justify-between mb-8 sm:mb-10">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-sun" />
              <p className="font-mono text-sun text-xs tracking-[0.2em] uppercase">
                Watch
              </p>
            </div>

            {videos.length > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => goTo(activeIndex - 1)}
                  disabled={activeIndex === 0}
                  className="h-9 w-9 rounded-full border border-paper/20 flex items-center justify-center text-paper/70 hover:text-paper hover:border-paper/40 disabled:opacity-30 transition"
                  aria-label="Previous video"
                >
                  <ChevronLeft size={18} />
                </button>

                <span className="font-mono text-xs text-paper/40 tabular-nums">
                  {activeIndex + 1} / {videos.length}
                </span>

                <button
                  onClick={() => goTo(activeIndex + 1)}
                  disabled={activeIndex === videos.length - 1}
                  className="h-9 w-9 rounded-full border border-paper/20 flex items-center justify-center text-paper/70 hover:text-paper hover:border-paper/40 disabled:opacity-30 transition"
                  aria-label="Next video"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>

          {/* ─────────────────────────────────────────────
              THUMBNAIL / FEATURED VIDEO
          ───────────────────────────────────────────── */}
          <div className="relative">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-ink shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
              {/* Thumbnail */}
              {activeThumbnail ? (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src={activeThumbnail}
    alt={active.title}
    className="absolute inset-0 w-full h-full object-cover"
  />
) : (
  <div className="absolute inset-0 bg-paper/10" />
)}

              {/* Thumbnail gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-ink/25 via-transparent to-ink/65" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />

              {/* Play button */}
              <button
                onClick={openVideo}
                aria-label={`Play ${active.title}`}
                className="absolute inset-0 z-10 flex items-center justify-center group"
              >
                <span
                  className="
                    flex h-16 w-16 sm:h-20 sm:w-20
                    items-center justify-center
                    rounded-full
                    bg-sun text-ink
                    shadow-xl shadow-sun/25
                    transition-all duration-300
                    group-hover:scale-110
                    group-active:scale-95
                  "
                >
                  <Play
                    size={28}
                    fill="currentColor"
                    className="ml-1"
                  />
                </span>
              </button>

              {/* Small WATCH label */}
              <div className="absolute bottom-5 left-5 z-10">
                <span className="inline-flex items-center gap-2 rounded-full bg-ink/70 backdrop-blur-md px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.15em] text-paper">
                  <Play size={10} fill="currentColor" />
                  Watch video
                </span>
              </div>

              {/* Description card */}
              <div
                className="
                  absolute z-20
                  top-6 bottom-6 right-0
                  w-[min(320px,42%)]
                "
              >
                <div
                  className="
                    h-full
                    flex flex-col justify-between
                    rounded-l-2xl rounded-r-none
                    bg-paper text-ink
                    p-5 sm:p-6
                    shadow-2xl shadow-black/30
                    border border-ink/5 border-r-0
                  "
                >
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-clay mb-3">
                      Field Note
                    </p>

                    <h3 className="font-display font-bold text-lg sm:text-xl leading-snug tracking-tight mb-3">
                      {active.title}
                    </h3>

                    {active.excerpt && (
                      <p className="text-sm text-ink/65 leading-relaxed line-clamp-4">
                        {active.excerpt}
                      </p>
                    )}
                  </div>

                  <div className="mt-5 pt-4 border-t border-ink/8">
                    <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/40 space-y-0.5">
                      {active.location && <p>{active.location}</p>}
                      {dateLabel && <p>{dateLabel}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────
              THUMBNAIL STRIP
          ───────────────────────────────────────────── */}
          {videos.length > 1 && (
            <div className="mt-6 flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-paper/20">
              {videos.map((video, i) => {
  const thumbnail = getVideoThumbnail(
    video.mediaUrl,
    video.posterUrl
  );

  return (
    <button
      key={video.slug}
      onClick={() => goTo(i)}
      className={`
        relative flex-shrink-0
        w-28 sm:w-36
        aspect-video
        rounded-lg
        overflow-hidden
        transition-all duration-300
        ${
          i === activeIndex
            ? "ring-2 ring-sun scale-[1.03]"
            : "opacity-60 hover:opacity-100"
        }
      `}
      aria-label={`Select ${video.title}`}
    >
      {thumbnail ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumbnail}
          alt={video.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-paper/10" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />

      <span className="absolute bottom-1.5 left-1.5 right-1.5 text-[10px] font-medium text-paper truncate">
        {video.title}
      </span>
    </button>
  );
})}
            </div>
          )}

          {/* ─────────────────────────────────────────────
              CONTENT BELOW
          ───────────────────────────────────────────── */}
          <div className="mt-10 sm:mt-12 max-w-2xl">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-paper tracking-tight leading-tight mb-4">
              {active.title}
            </h2>

            {active.excerpt && (
              <p className="text-paper/65 text-sm sm:text-base leading-relaxed mb-6">
                {active.excerpt}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href={`/field-notes/${active.slug}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-sun hover:text-paper transition"
              >
                Read the full Field Note
                <span>→</span>
              </Link>

              {(active.location || dateLabel) && (
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-paper/35">
                  {[active.location, dateLabel]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────
          VIDEO MODAL
      ───────────────────────────────────────────────── */}
      {isModalOpen && (
        <div
          className="
            fixed inset-0 z-[9999]
            bg-black/90 backdrop-blur-sm
            flex items-center justify-center
            p-4 sm:p-8
          "
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeVideo();
            }
          }}
        >
          {/* Close button */}
          <button
            onClick={closeVideo}
            aria-label="Close video"
            className="
              absolute
              top-4 right-4 sm:top-6 sm:right-6
              z-20
              h-11 w-11
              rounded-full
              bg-paper/10
              backdrop-blur-md
              border border-paper/20
              text-paper
              flex items-center justify-center
              hover:bg-paper/20
              transition
            "
          >
            <X size={22} />
          </button>

          {/* Modal content */}
          <div className="w-full max-w-6xl">
            {/* Video */}
            <div className="relative aspect-video rounded-xl sm:rounded-2xl overflow-hidden bg-black shadow-2xl">
              <video
                ref={modalVideoRef}
                key={active.mediaUrl}
                src={active.mediaUrl}
                poster={active.posterUrl || undefined}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
            </div>

            {/* Modal information */}
            <div className="mt-5 sm:mt-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sun mb-2">
                Field Note
              </p>

              <h2 className="font-display font-bold text-xl sm:text-2xl text-paper tracking-tight">
                {active.title}
              </h2>

              <div className="flex flex-wrap gap-x-5 gap-y-2 mt-2">
                {active.location && (
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-paper/40">
                    {active.location}
                  </p>
                )}

                {dateLabel && (
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-paper/40">
                    {dateLabel}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}