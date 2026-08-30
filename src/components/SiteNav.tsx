"use client";

import Link from "next/link";
import { useState } from "react";
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
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 sm:px-12 py-4 bg-ink text-paper">
      <Link href="/" className="font-display font-bold text-lg tracking-tight">
        {SITE_NAME}
      </Link>

      <nav className="hidden md:flex items-center gap-7">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm font-medium text-paper/80 hover:text-paper transition"
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/campaigns"
          className="bg-sun text-ink px-5 py-2 rounded-full text-sm font-semibold hover:brightness-105 transition"
        >
          Donate
        </Link>
      </nav>

      <button
        type="button"
        className="md:hidden p-1 text-paper/90 hover:text-paper transition"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 bg-ink border-t border-paper/10 flex flex-col p-6 gap-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-base font-medium text-paper/90 hover:text-paper transition"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/campaigns"
            onClick={() => setOpen(false)}
            className="mt-1 bg-sun text-ink px-5 py-2.5 rounded-full text-sm font-semibold text-center hover:brightness-105 transition"
          >
            Donate
          </Link>
        </div>
      )}
    </header>
  );
}