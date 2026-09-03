"use client";

import { Share2 } from "lucide-react";
import { SITE_HASHTAG, SITE_TAGLINE } from "@/lib/config";
import { useToast } from "@/components/ui/ToastProvider";

export default function ShareButtons({
  title,
  url,
}: {
  title: string;
  url: string;
}) {
  const { showToast } = useToast();
  const shareText = `${title} — ${SITE_TAGLINE} ${SITE_HASHTAG}`;

  const links = [
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${url}`)}`,
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}&quote=${encodeURIComponent(shareText)}`,
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        shareText
      )}&url=${encodeURIComponent(url)}`,
    },
  ];

  async function copyLink() {
    await navigator.clipboard.writeText(`${shareText} ${url}`);
    showToast("Link copied to clipboard");
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="flex items-center gap-1 text-sm text-gray-500">
        <Share2 size={16} /> Share:
      </span>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm px-3 py-1 rounded-full border border-gray-200 hover:bg-gray-50"
        >
          {link.label}
        </a>
      ))}
      <button
        onClick={copyLink}
        className="text-sm px-3 py-1 rounded-full border border-gray-200 hover:bg-gray-50"
      >
        Copy link
      </button>
    </div>
  );
}
