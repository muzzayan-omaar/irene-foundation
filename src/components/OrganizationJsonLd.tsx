import { SITE_NAME } from "@/lib/config";

export default function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: SITE_NAME,
    url: process.env.NEXT_PUBLIC_SITE_URL,
    description:
      "A foundation supporting communities across Uganda through transparent, campaign-based giving.",
    // TODO: add real sameAs social URLs once confirmed (X, TikTok, Instagram, Facebook)
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
