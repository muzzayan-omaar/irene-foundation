"use client";

import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Share2 } from "lucide-react";

export default function CampaignGallery({
  images,
  campaignUrl,
}: {
  images: string[];
  campaignUrl: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const next = useCallback(() => {
    setOpenIndex((i) => (i === null ? null : (i + 1) % images.length));
  }, [images.length]);

  const prev = useCallback(() => {
    setOpenIndex((i) =>
      i === null ? null : (i - 1 + images.length) % images.length
    );
  }, [images.length]);

  // Keyboard navigation in lightbox
  useEffect(() => {
    if (openIndex === null) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenIndex(null);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, next, prev]);

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Campaign",
          url: campaignUrl,
        });
        return;
      } catch {
        // user cancelled
      }
    }
    await navigator.clipboard.writeText(campaignUrl);
    alert("Link copied — paste it anywhere to share this campaign.");
  }

  if (!images?.length) return null;

  return (
    <>
      {/* Modern masonry — natural heights, no uniform cards */}
<div
  className="w-full"
  style={{
    columnCount: 3,
    columnGap: "12px",
  }}
>
  <style jsx>{`
    @media (max-width: 640px) {
      div {
        column-count: 2 !important;
      }
    }
  `}</style>

  {images.map((url, i) => (
    <button
      key={i}
      onClick={() => setOpenIndex(i)}
      className="mb-3 w-full break-inside-avoid overflow-hidden rounded-xl focus:outline-none"
      style={{ display: "inline-block" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={`Gallery photo ${i + 1}`}
        className="w-full h-auto block transition duration-300 hover:brightness-95 hover:scale-[1.02]"
        style={{ display: "block" }}
        loading="lazy"
      />
    </button>
  ))}
</div>

      {/* Lightbox */}
      {openIndex !== null && (
        <div
          className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setOpenIndex(null)}
        >
          <button
            onClick={() => setOpenIndex(null)}
            className="absolute top-5 right-5 text-white/80 hover:text-white transition"
            aria-label="Close"
          >
            <X size={28} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-3 sm:left-6 text-white/80 hover:text-white transition"
            aria-label="Previous photo"
          >
            <ChevronLeft size={36} />
          </button>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[openIndex]}
            alt={`Gallery photo ${openIndex + 1}`}
            className="max-w-full max-h-[82vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-3 sm:right-6 text-white/80 hover:text-white transition"
            aria-label="Next photo"
          >
            <ChevronRight size={36} />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
            <span className="text-white/70 text-sm tabular-nums">
              {openIndex + 1} / {images.length}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                share();
              }}
              className="flex items-center gap-2 text-white text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition backdrop-blur-sm"
            >
              <Share2 size={15} />
              Share
            </button>
          </div>
        </div>
      )}
    </>
  );
}