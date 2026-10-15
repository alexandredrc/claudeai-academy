import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo/jsonld";

// Métadonnées de page en un seul appel.
//
// Pourquoi : Next fusionne `metadata` champ par champ, mais remplace l'objet
// `openGraph` en bloc. Une page qui déclarait son propre `openGraph` perdait
// donc l'image du layout, et une page qui n'en déclarait pas héritait de
// l'`og:url` de l'accueil. Audit du 15/10/2026 : `og:url` = accueil sur 20
// pages, `og:image` absente sur 22. Ici, chaque page porte son URL absolue,
// son image, sa canonique et sa carte Twitter, avec les mêmes valeurs par
// défaut que `src/app/layout.tsx`.

/** Image de partage du site : `public/og.png`, 1200 × 630. */
export const OG_IMAGE_URL = `${SITE_URL}/og.png`;
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;
const OG_IMAGE_ALT =
  "ClaudeAI Academy, la formation francophone pour maîtriser Claude AI";
const SITE_NAME = "ClaudeAI Academy";

export type PageMetadataInput = {
  /** Chemin canonique, commence par « / » (« / » pour l'accueil). */
  path: string;
  /** Balise title, mot clé en tête, moins de 65 caractères. */
  title: string;
  /** Meta description, 140 à 155 caractères. */
  description: string;
  /** Titre de partage s'il diffère du title. */
  ogTitle?: string;
  /** Description de partage si elle diffère de la meta description. */
  ogDescription?: string;
  /** « article » pour les guides, « website » (défaut) pour le reste. */
  type?: "website" | "article";
  /** « fr_FR » par défaut, « en_US » pour les pages /en/. */
  locale?: string;
  /** Texte alternatif de l'image de partage. */
  imageAlt?: string;
  keywords?: Metadata["keywords"];
  /** hreflang, ex. { "fr-FR": "/kit", en: "/en/kit", "x-default": "/kit" }. */
  languages?: NonNullable<Metadata["alternates"]>["languages"];
  /** À reprendre tel quel quand la page est en noindex. */
  robots?: Metadata["robots"];
};

export function pageMetadata(input: PageMetadataInput): Metadata {
  const {
    path,
    title,
    description,
    ogTitle = title,
    ogDescription = description,
    type = "website",
    locale = "fr_FR",
    imageAlt = OG_IMAGE_ALT,
    keywords,
    languages,
    robots,
  } = input;

  const url = path === "/" ? SITE_URL : `${SITE_URL}${path}`;
  const image = {
    url: OG_IMAGE_URL,
    width: OG_IMAGE_WIDTH,
    height: OG_IMAGE_HEIGHT,
    alt: imageAlt,
  };
  const base = {
    title: ogTitle,
    description: ogDescription,
    url,
    siteName: SITE_NAME,
    locale,
    images: [image],
  };
  // Le type `OpenGraph` de Next est une union discriminée par `type` : on
  // construit chaque variante avec son littéral plutôt qu'avec une variable.
  const openGraph: Metadata["openGraph"] =
    type === "article"
      ? { ...base, type: "article" }
      : { ...base, type: "website" };

  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    ...(robots ? { robots } : {}),
    alternates: {
      canonical: path,
      ...(languages ? { languages } : {}),
    },
    openGraph,
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [{ url: OG_IMAGE_URL, alt: imageAlt }],
    },
  };
}
