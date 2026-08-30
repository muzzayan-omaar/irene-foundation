"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { SITE_NAME } from "@/lib/config";

const NAV_LINKS = [
  { label: "Campaigns", href: "/campaigns" },
  { label: "Field Notes", href: "/field-notes" },
  { label: "Wall of Support", href: "/wall-of-support" },
  { label: "About", href: "/about" },
  { label: "Press", href: "/press" },
  { label: "Transparency", href: "/transparency" },
];

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

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
          <Link
            href="/campaigns"
            className="bg-sun text-ink px-5 py-2 rounded-full text-sm font-semibold hover:brightness-105 transition"
          >
            Donate
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
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}