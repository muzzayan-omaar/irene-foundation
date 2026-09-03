import { cookies } from "next/headers";
import { locales, type Locale } from "@/lib/i18n/translations";

export async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value as Locale | undefined;
  return cookieLocale && locales.includes(cookieLocale) ? cookieLocale : "en";
}
