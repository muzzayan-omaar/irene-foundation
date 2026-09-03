"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE_NAME, SITE_HASHTAG } from "@/lib/config";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { Compass, Info, Scale, Heart } from "lucide-react";

const FOOTER_LINKS = [
  { key: "nav_campaigns", href: "/campaigns" },
  { key: "nav_fieldNotes", href: "/field-notes" },
  { key: "nav_wallOfSupport", href: "/wall-of-support" },
  { key: "nav_about", href: "/about" },
  { key: "nav_press", href: "/press" },
  { key: "nav_transparency", href: "/transparency" },
  { key: "footer_privacy", href: "/privacy" },
  { key: "footer_terms", href: "/terms" },
  { key: "nav_partners", href: "/partners" },
];

export default function SiteFooter() {
  const pathname = usePathname();
  const { t } = useLocale();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="bg-ink text-paper">
      {/* Main footer content */}
      <div className="px-6 sm:px-12 py-16 sm:py-20">
        <div className="max-w-5xl mx-auto">
          {/* Top row – Brand */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8 mb-14">
            <div>
              <p className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight mb-2">
                {SITE_NAME}
              </p>
              <p className="font-mono text-sun text-sm tracking-wide">
                {SITE_HASHTAG}
              </p>
            </div>

            <p className="text-paper/60 text-sm max-w-xs leading-relaxed sm:text-right">
              Supporting women, children, and communities across Uganda.
            </p>
          </div>

          {/* Links grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-10">
            {/* Explore */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Compass size={14} className="text-sun" strokeWidth={1.75} />
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-paper/40">
                  Explore
                </p>
              </div>
              <ul className="space-y-2.5">
                {FOOTER_LINKS.slice(0, 4).map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-paper/70 hover:text-paper transition"
                    >
                      {t(link.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* About */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Info size={14} className="text-sun" strokeWidth={1.75} />
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-paper/40">
                  About
                </p>
              </div>
              <ul className="space-y-2.5">
                {FOOTER_LINKS.slice(4, 7).map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-paper/70 hover:text-paper transition"
                    >
                      {t(link.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Scale size={14} className="text-sun" strokeWidth={1.75} />
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-paper/40">
                  Legal
                </p>
              </div>
              <ul className="space-y-2.5">
                {FOOTER_LINKS.slice(7).map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-paper/70 hover:text-paper transition"
                    >
                      {t(link.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart size={14} className="text-sun" strokeWidth={1.75} />
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-paper/40">
                  {t("footer_follow")}
                </p>
              </div>
              <div className="flex flex-col gap-3">
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/irenenamatovuofficialug/?hl=en"
                  className="group flex items-center gap-2.5 text-sm text-paper/70 hover:text-sun transition"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="group-hover:text-sun transition"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                  Instagram
                </a>

                {/* TikTok */}
                <a
                  href="https://www.tiktok.com/@irenenamatovuofficial/video/7179690996031114501"
                  className="group flex items-center gap-2.5 text-sm text-paper/70 hover:text-sun transition"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="group-hover:text-sun transition"
                  >
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                  </svg>
                  TikTok
                </a>

                {/* Facebook */}
                <a
                  href="https://www.facebook.com/p/Irene-Namatovu-foundation-100089337849719/"
                  className="group flex items-center gap-2.5 text-sm text-paper/70 hover:text-sun transition"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="group-hover:text-sun transition"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v10h4v-10h3l1-4h-4V7a2 2 0 0 1 2-2h3z" />
                  </svg>
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-paper/10">
        <div className="max-w-5xl mx-auto px-6 sm:px-12 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs text-paper/40">
            © {new Date().getFullYear()} {SITE_NAME}. {t("footer_rights")}
          </p>
          <p className="text-xs text-paper/30 font-mono tracking-wide">
            Built with care
          </p>
        </div>
      </div>
    </footer>
  );
}