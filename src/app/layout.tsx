import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter, IBM_Plex_Mono } from "next/font/google";
import PageContent from "@/components/PageContent";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { ToastProvider } from "@/components/ui/ToastProvider";
import WhatsAppButton from "@/components/WhatsAppButton";
import { cookies } from "next/headers";
import OrganizationJsonLd from "@/components/OrganizationJsonLd";
import { LocaleProvider } from "@/lib/i18n/LocaleProvider";
import type { Locale } from "@/lib/i18n/translations";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Irene Namatovu Foundation",
    template: "%s | Irene Namatovu Foundation",
  },
  description: "Together, we rise. Real work, real voices, real proof.",
  openGraph: {
    title: "Irene Namatovu Foundation",
    description: "Together, we rise. Real work, real voices, real proof.",
    type: "website",
    siteName: "Irene Namatovu Foundation",
  },
  twitter: {
    card: "summary_large_image",
    title: "Irene Namatovu Foundation",
    description: "Together, we rise. Real work, real voices, real proof.",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const initialLocale = (cookieStore.get("NEXT_LOCALE")?.value as Locale) || "en";

  return (
    <html lang={initialLocale}>
      <body
        className={`${bricolage.variable} ${inter.variable} ${plexMono.variable} font-body bg-paper text-ink antialiased`}
      >
        <OrganizationJsonLd />
        <LocaleProvider initialLocale={initialLocale}>
          <ToastProvider>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:bg-clay focus:text-paper focus:px-4 focus:py-2 focus:rounded-full"
            >
              Skip to main content
            </a>
            <SiteNav />
            <PageContent>{children}</PageContent>
            <SiteFooter />
            <WhatsAppButton />
          </ToastProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
