"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE_NAME, SITE_HASHTAG } from "@/lib/config";

const FOOTER_LINKS = [
  { label: "Campaigns", href: "/campaigns" },
  { label: "Field Notes", href: "/field-notes" },
  { label: "Wall of Support", href: "/wall-of-support" },
  { label: "About", href: "/about" },
  { label: "Press", href: "/press" },
  { label: "Transparency", href: "/transparency" },
];

export default function SiteFooter() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="bg-ink text-paper px-6 sm:px-12 py-14 sm:py-16">
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8">
        <div>
          <p className="font-display font-bold text-lg tracking-tight mb-2">
            {SITE_NAME}
          </p>
          <p className="font-mono text-sun text-xs tracking-[0.18em] uppercase">
            {SITE_HASHTAG}
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-paper/55 hover:text-paper transition"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div>
          <p className="text-sm text-paper/55 mb-3">Follow along</p>
          {/* TODO: replace with Irene's real social links once confirmed */}
          <div className="flex gap-5 text-sm">
            <a href="#" className="text-paper/55 hover:text-paper transition">
              Instagram
            </a>
            <a href="#" className="text-paper/55 hover:text-paper transition">
              TikTok
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-12 pt-6 border-t border-paper/10 text-[11px] text-paper/35 tracking-wide">
        © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
      </div>
    </footer>
  );
}