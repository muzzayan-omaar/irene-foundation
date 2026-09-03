export const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];

export const translations: Record<Locale, Record<string, string>> = {
  en: {
    nav_campaigns: "Campaigns",
    nav_fieldNotes: "Field Notes",
    nav_getInvolved: "Get Involved",
    nav_wallOfSupport: "Wall of Support",
    nav_about: "About",
    nav_press: "Press",
    nav_transparency: "Transparency",
    nav_donate: "Donate",
    hero_cta_donate: "Give Now",
    hero_cta_proof: "See the Proof",
    hero_subtitle:
      "Real work, real voices, real proof — every gift here goes toward people you can actually see and stories you can actually follow.",
    footer_follow: "Follow along",
    footer_rights: "All rights reserved.",
    footer_privacy: "Privacy Policy",
    footer_terms: "Terms of Service",

    campaigns_eyebrow: "Give directly",
    campaigns_title: "Active Campaigns",
    campaigns_subtitle:
      "Every campaign below is a real, ongoing need — see exactly what your gift supports.",
    campaigns_empty: "No active campaigns right now — check back soon.",
    label_raised: "raised",
    label_of: "of",
    label_donors: "donors",

    campaignDetail_activeLabel: "Active Campaign",
    campaignDetail_recentSupporters: "Recent Supporters",
    campaignDetail_giveButton: "Give to This Campaign",
    campaignDetail_completedNote:
      "This campaign has been completed — thank you to everyone who gave. Check Field Notes for what your support made possible.",

    fieldNotes_eyebrow: "Proof it's real",
    fieldNotes_title: "Field Notes",
    fieldNotes_subtitle:
      "Real updates from real work — see exactly what your support makes possible.",
    fieldNotes_empty: "Nothing here yet — check back soon.",
    fieldNotes_readNote: "Read the note",
    filter_all: "All",
    filter_updates: "Updates",
    filter_photoStories: "Photo Stories",
    filter_video: "Video",
    filter_pods: "Pods",

    donate_giveOnce: "Give Once",
    donate_giveMonthly: "Give Monthly",
    donate_amountLabel: "Amount (USD)",
    donate_customAmount: "Custom amount",
    donate_fullName: "Full name",
    donate_email: "Email",
    donate_phone: "Phone (optional, needed for Mobile Money)",
    donate_country: "Country (optional)",
    donate_message: "Leave a message of support (optional)",
    donate_anonymous: "Give anonymously",
    donate_subscribe: "Email me updates about how this gift is used (optional)",
    donate_submit: "Donate Now",
    donate_submitting: "Redirecting to checkout...",
  },
  fr: {
    nav_campaigns: "Campagnes",
    nav_fieldNotes: "Notes de terrain",
    nav_getInvolved: "S'impliquer",
    nav_wallOfSupport: "Mur de soutien",
    nav_about: "À propos",
    nav_press: "Presse",
    nav_transparency: "Transparence",
    nav_donate: "Faire un don",
    hero_cta_donate: "Faire un don",
    hero_cta_proof: "Voir les preuves",
    hero_subtitle:
      "Un travail réel, des voix réelles, des preuves réelles — chaque don soutient des personnes que vous pouvez voir et des histoires que vous pouvez suivre.",
    footer_follow: "Suivez-nous",
    footer_rights: "Tous droits réservés.",
    footer_privacy: "Politique de confidentialité",
    footer_terms: "Conditions d'utilisation",

    campaigns_eyebrow: "Donner directement",
    campaigns_title: "Campagnes actives",
    campaigns_subtitle:
      "Chaque campagne ci-dessous répond à un besoin réel et en cours — voyez exactement ce que votre don soutient.",
    campaigns_empty: "Aucune campagne active pour le moment — revenez bientôt.",
    label_raised: "collectés",
    label_of: "sur",
    label_donors: "donateurs",

    campaignDetail_activeLabel: "Campagne active",
    campaignDetail_recentSupporters: "Soutiens récents",
    campaignDetail_giveButton: "Faire un don à cette campagne",
    campaignDetail_completedNote:
      "Cette campagne est terminée — merci à toutes les personnes qui ont donné. Consultez les Notes de terrain pour voir ce que votre soutien a permis de réaliser.",

    fieldNotes_eyebrow: "La preuve que c'est réel",
    fieldNotes_title: "Notes de terrain",
    fieldNotes_subtitle:
      "De vraies mises à jour d'un vrai travail — voyez exactement ce que votre soutien rend possible.",
    fieldNotes_empty: "Rien ici pour l'instant — revenez bientôt.",
    fieldNotes_readNote: "Lire la note",
    filter_all: "Tout",
    filter_updates: "Mises à jour",
    filter_photoStories: "Reportages photo",
    filter_video: "Vidéo",
    filter_pods: "Podcasts",

    donate_giveOnce: "Don unique",
    donate_giveMonthly: "Don mensuel",
    donate_amountLabel: "Montant (USD)",
    donate_customAmount: "Montant personnalisé",
    donate_fullName: "Nom complet",
    donate_email: "Email",
    donate_phone: "Téléphone (optionnel, requis pour Mobile Money)",
    donate_country: "Pays (optionnel)",
    donate_message: "Laissez un message de soutien (optionnel)",
    donate_anonymous: "Faire un don anonyme",
    donate_subscribe: "M'envoyer des nouvelles sur l'utilisation de ce don (optionnel)",
    donate_submit: "Faire un don",
    donate_submitting: "Redirection vers le paiement...",
  },
};

// Shared lookup — used directly by server components (no React context needed
// for a plain object read), and internally by the client LocaleProvider's t().
export function translate(locale: Locale, key: string): string {
  return translations[locale]?.[key] ?? translations.en[key] ?? key;
}
