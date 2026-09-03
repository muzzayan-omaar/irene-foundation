"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Globe } from "lucide-react";
import { SITE_NAME } from "@/lib/config";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { locales } from "@/lib/i18n/translations";

const NAV_LINKS = [
  { key: "nav_campaigns", href: "/campaigns" },
  { key: "nav_fieldNotes", href: "/field-notes" },
  { key: "nav_getInvolved", href: "/get-involved" },
  { key: "nav_wallOfSupport", href: "/wall-of-support" },
  { key: "nav_partners", href: "/partners" },
  { key: "nav_about", href: "/about" },
  { key: "nav_press", href: "/press" },
  { key: "nav_transparency", href: "/transparency" },
];

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { locale, setLocale, t } = useLocale();

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith("/admin")) return null;

  // Solid background once scrolled, or on any page that isn't the homepage
  // (inner pages don't have a hero image to be transparent over).
  const isSolid = scrolled || pathname !== "/" || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 h-[72px] transition-colors duration-300 ${
        isSolid ? "bg-ink text-paper" : "bg-transparent text-paper"
      }`}
    >
      <div className="flex items-center justify-between px-6 sm:px-12 h-full">
        <Link href="/" className="font-display font-bold text-lg">
          {SITE_NAME}
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setLocale(locale === "en" ? "fr" : "en")}
            aria-label="Switch language"
            className="flex items-center gap-1 text-sm font-medium hover:opacity-70 transition"
          >
            <Globe size={16} />
            {locale.toUpperCase()}
          </button>
          <Link
            href="/campaigns"
            className="bg-sun text-ink px-5 py-2 rounded-full text-sm font-semibold hover:brightness-105 transition"
          >
            {t("nav_donate")}
          </Link>
          <button
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            className="p-1"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <div className="absolute top-full inset-x-0 bg-ink px-6 sm:px-12 pb-6 flex flex-col gap-4 border-t border-paper/10 pt-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-base font-medium text-paper hover:text-sun transition"
            >
              {t(link.key)}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
