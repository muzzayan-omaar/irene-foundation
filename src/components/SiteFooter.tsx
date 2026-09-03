"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE_NAME, SITE_HASHTAG } from "@/lib/config";
import { useLocale } from "@/lib/i18n/LocaleProvider";

const FOOTER_LINKS = [
  { key: "nav_campaigns", href: "/campaigns" },
  { key: "nav_fieldNotes", href: "/field-notes" },
  { key: "nav_wallOfSupport", href: "/wall-of-support" },
  { key: "nav_about", href: "/about" },
  { key: "nav_press", href: "/press" },
  { key: "nav_transparency", href: "/transparency" },
  { key: "footer_privacy", href: "/privacy" },
  { key: "footer_terms", href: "/terms" },
];

export default function SiteFooter() {
  const pathname = usePathname();
  const { t } = useLocale();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="bg-ink text-paper px-6 sm:px-12 py-16">
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10">
        <div>
          <p className="font-display font-bold text-lg mb-3">{SITE_NAME}</p>
          <p className="font-mono text-sun text-sm">{SITE_HASHTAG}</p>
        </div>

        <div className="flex flex-col gap-2">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-paper/60 hover:text-paper transition"
            >
              {t(link.key)}
            </Link>
          ))}
        </div>

        <div>
          <p className="text-sm text-paper/60 mb-2">{t("footer_follow")}</p>
          {/* TODO: replace with Irene's real social links once confirmed */}
          <div className="flex gap-4 text-sm">
            <a href="#" className="text-paper/60 hover:text-paper transition">
              Instagram
            </a>
            <a href="#" className="text-paper/60 hover:text-paper transition">
              TikTok
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-12 pt-6 border-t border-paper/10 text-xs text-paper/40">
        © {new Date().getFullYear()} {SITE_NAME}. {t("footer_rights")}
      </div>
    </footer>
  );
}
