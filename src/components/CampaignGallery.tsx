"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Share2 } from "lucide-react";

export default function CampaignGallery({
  images,
  campaignUrl,
}: {
  images: string[];
  campaignUrl: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function next() {
    setOpenIndex((i) => (i === null ? null : (i + 1) % images.length));
  }

  function prev() {
    setOpenIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  }

  async function share() {
    await navigator.clipboard.writeText(campaignUrl);
    alert("Link copied — paste it anywhere to share this photo's campaign.");
  }

  return (
    <>
      {/* Masonry-style grid — variable heights via CSS columns instead of a
          uniform card grid, so photos aren't forced into identical boxes */}
      <div className="[column-count:2] sm:[column-count:3] gap-3 [&>*]:mb-3">
        {images.map((url, i) => (
          <button
            key={i}
            onClick={() => setOpenIndex(i)}
            className="block w-full break-inside-avoid rounded-lg overflow-hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={`Gallery photo ${i + 1}`}
              className="w-full h-auto object-cover hover:opacity-90 transition"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {openIndex !== null && (
        <div className="fixed inset-0 z-[200] bg-ink/95 flex items-center justify-center p-4">
          <button
            onClick={() => setOpenIndex(null)}
            className="absolute top-6 right-6 text-paper"
            aria-label="Close"
          >
            <X size={28} />
          </button>

          <button
            onClick={prev}
            className="absolute left-4 sm:left-8 text-paper"
            aria-label="Previous photo"
          >
            <ChevronLeft size={32} />
          </button>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[openIndex]}
            alt={`Gallery photo ${openIndex + 1}`}
            className="max-w-full max-h-[80vh] object-contain rounded-lg"
          />

          <button
            onClick={next}
            className="absolute right-4 sm:right-8 text-paper"
            aria-label="Next photo"
          >
            <ChevronRight size={32} />
          </button>

          <button
            onClick={share}
            className="absolute bottom-6 flex items-center gap-2 text-paper text-sm bg-paper/10 px-4 py-2 rounded-full hover:bg-paper/20 transition"
          >
            <Share2 size={16} />
            Share this campaign
          </button>
        </div>
      )}
    </>
  );
}