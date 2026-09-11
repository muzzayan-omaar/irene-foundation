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
        await navigator.share({ title: "Campaign", url: campaignUrl });
        return;
      } catch {
        /* cancelled */
      }
    }
    await navigator.clipboard.writeText(campaignUrl);
    alert("Link copied.");
  }

  if (!images?.length) return null;

  const spans = [
    "sm:col-span-2 sm:row-span-2",
    "",
    "sm:row-span-2",
    "",
    "sm:col-span-2",
    "",
  ];

  return (
    <>
      {/* Temporary visible marker so you know this file is live */}
      <p className="text-xs text-red-500 mb-2 font-mono">NEW GALLERY LOADED</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 auto-rows-[140px] sm:auto-rows-[160px] gap-2 sm:gap-3">
        {images.map((url, i) => (
          <button
            key={i}
            onClick={() => setOpenIndex(i)}
            className={`relative overflow-hidden rounded-2xl group ${spans[i % spans.length]}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={`Gallery photo ${i + 1}`}
              className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <div
          className="fixed inset-0 z-[200] bg-black/92 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setOpenIndex(null)}
        >
          <button
            onClick={() => setOpenIndex(null)}
            className="absolute top-5 right-5 text-white/80 hover:text-white"
          >
            <X size={28} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-3 sm:left-6 text-white/80 hover:text-white"
          >
            <ChevronLeft size={36} />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[openIndex]}
            alt=""
            className="max-w-full max-h-[82vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-3 sm:right-6 text-white/80 hover:text-white"
          >
            <ChevronRight size={36} />
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
            <span className="text-white/70 text-sm">
              {openIndex + 1} / {images.length}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                share();
              }}
              className="flex items-center gap-2 text-white text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full"
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