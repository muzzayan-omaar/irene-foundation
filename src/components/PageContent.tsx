"use client";

import { usePathname } from "next/navigation";

export default function PageContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Homepage hero is designed to run full-bleed under the transparent nav.
  // Every other page needs top padding so content doesn't hide behind the
  // fixed bar. Admin pages have their own layout entirely, so no padding.
  const isHome = pathname === "/";
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <main id="main-content" className={isHome || isAdmin ? "" : "pt-[72px]"}>{children}</main>
  );
}
