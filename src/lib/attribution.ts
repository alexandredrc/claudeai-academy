/**
 * Attribution : savoir d'où vient chaque visiteur, et donc chaque vente.
 *
 * Deux problèmes réglés ici, dans l'ordre où ils sont apparus.
 *
 * 1. Traduire `?src=` en `utm_*`. Les liens qui circulent déjà (bio Instagram,
 *    réponses ManyChat, posts LinkedIn) portent `?src=quelque-chose`, et GA4
 *    ne lit que les `utm_*`. Sans traduction, une vente venue d'Instagram
 *    arrivait en « direct », comme une vente venue des annonces.
 *
 * 2. Garder la provenance jusqu'au paiement. GA4 sait d'où vient une SESSION,
 *    mais la vente est enregistrée par le webhook Stripe, qui ne connaît ni
 *    GA4 ni le navigateur. Au 02/10/2026, douze ventes en base et aucune ne
 *    pouvait être rattachée à un canal : la question « est-ce que la com
 *    rapporte ? » n'avait pas de réponse mesurable. D'où un cookie de
 *    provenance (première partie, sans identifiant) posé par le proxy à la
 *    première visite, relu au moment d'ouvrir le checkout, et recopié dans la
 *    metadata Stripe, que le webhook écrit enfin dans `purchases`.
 */

/** Canaux connus : source et support explicites plutôt que devinés. */
const CANAUX: Record<string, { source: string; medium: string }> = {
  "instagram-dm": { source: "instagram", medium: "dm" },
  "instagram-bio": { source: "instagram", medium: "bio" },
  "instagram-story": { source: "instagram", medium: "story" },
  instagram: { source: "instagram", medium: "bio" },
  "linkedin-post": { source: "linkedin", medium: "post" },
  linkedin: { source: "linkedin", medium: "social" },
  facebook: { source: "facebook", medium: "social" },
  tiktok: { source: "tiktok", medium: "social" },
  youtube: { source: "youtube", medium: "social" },
  email: { source: "email", medium: "newsletter" },
};

export type Utm = { source: string; medium: string; campaign: string };

const nettoyer = (raw: string, max = 40) =>
  raw.toLowerCase().replace(/[^a-z0-9_.-]/g, "").slice(0, max);

/**
 * Un `src` inconnu ne doit pas disparaître : on le range en `referral` sous
 * son propre nom, quitte à ce que GA4 affiche un canal exotique. Un canal
 * mal nommé se corrige ; un canal absent se confond avec le trafic direct.
 */
export function utmDepuisSrc(raw: string): Utm | null {
  const clean = raw.toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 40);
  if (!clean) return null;
  const connu = CANAUX[clean];
  if (connu) return { ...connu, campaign: clean };
  // Liens des séquences email (`email-lead-b3`…) : canal email, et l'étape
  // exacte en campagne pour savoir quel email a fait vendre.
  if (clean.startsWith("email-")) return { source: "email", medium: "newsletter", campaign: clean };
  const [source] = clean.split("-");
  return { source: source || clean, medium: "referral", campaign: clean };
}

// ── Provenance : du premier clic jusqu'au paiement ───────────────────────────

export type Provenance = Utm & {
  /** Le `?src=` d'origine quand il y en avait un (ex. `instagram-bio`). */
  src?: string;
  /** Première page vue (chemin seul, sans paramètres). */
  landing: string;
  /** Hôte du site référent, quand il y en avait un. */
  referrer?: string;
  /** Date de la première visite, au jour (ISO, `2026-10-02`). */
  at: string;
};

/** Nom du cookie. Première partie, HttpOnly, sans identifiant de personne. */
export const PROVENANCE_COOKIE = "cai_prov";
/** 90 jours : la décision d'achat d'une formation à 497 € prend des semaines. */
export const PROVENANCE_MAX_AGE = 60 * 60 * 24 * 90;

/** Hôtes à ne jamais considérer comme référents : c'est nous. */
const HOTES_INTERNES = ["claudeai-academy.com", "localhost", "vercel.app"];

/**
 * Lecture d'un site référent. L'ordre compte : les moteurs génératifs sont
 * listés AVANT les moteurs classiques parce que `gemini.google.com` contient
 * `google.com`, et qu'une citation par Gemini n'est pas une recherche Google.
 */
const REFERENTS: Array<[RegExp, { source: string; medium: string }]> = [
  [/(^|\.)chatgpt\.com$|(^|\.)chat\.openai\.com$/, { source: "chatgpt", medium: "ia" }],
  [/(^|\.)perplexity\.ai$/, { source: "perplexity", medium: "ia" }],
  [/(^|\.)claude\.ai$/, { source: "claude", medium: "ia" }],
  [/^gemini\.google\.com$/, { source: "gemini", medium: "ia" }],
  [/^copilot\.microsoft\.com$/, { source: "copilot", medium: "ia" }],
  [/(^|\.)mistral\.ai$/, { source: "mistral", medium: "ia" }],
  [/(^|\.)google\.[a-z.]+$/, { source: "google", medium: "organic" }],
  [/(^|\.)bing\.com$/, { source: "bing", medium: "organic" }],
  [/(^|\.)duckduckgo\.com$/, { source: "duckduckgo", medium: "organic" }],
  [/(^|\.)qwant\.com$/, { source: "qwant", medium: "organic" }],
  [/(^|\.)ecosia\.org$/, { source: "ecosia", medium: "organic" }],
  [/(^|\.)yahoo\.com$/, { source: "yahoo", medium: "organic" }],
  [/(^|\.)linkedin\.com$|^lnkd\.in$/, { source: "linkedin", medium: "social" }],
  [/(^|\.)instagram\.com$/, { source: "instagram", medium: "social" }],
  [/(^|\.)facebook\.com$|^fb\.me$|(^|\.)messenger\.com$/, { source: "facebook", medium: "social" }],
  [/^t\.co$|(^|\.)twitter\.com$|(^|\.)x\.com$/, { source: "x", medium: "social" }],
  [/(^|\.)tiktok\.com$/, { source: "tiktok", medium: "social" }],
  [/(^|\.)youtube\.com$|^youtu\.be$/, { source: "youtube", medium: "social" }],
  [/(^|\.)threads\.net$/, { source: "threads", medium: "social" }],
  [/(^|\.)reddit\.com$/, { source: "reddit", medium: "social" }],
  [/(^|\.)malt\.fr$/, { source: "malt", medium: "referral" }],
];

function sourceDepuisReferent(referer: string | null): Utm & { referrer: string } | null {
  if (!referer) return null;
  let host: string;
  try {
    host = new URL(referer).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
  if (!host || HOTES_INTERNES.some((h) => host === h || host.endsWith("." + h))) return null;
  for (const [motif, canal] of REFERENTS) {
    if (motif.test(host)) {
      return { ...canal, campaign: `${canal.source}-${canal.medium}`, referrer: host };
    }
  }
  return { source: nettoyer(host, 60), medium: "referral", campaign: "referral", referrer: host };
}

/**
 * Déduit la provenance d'une requête. Renvoie aussi `explicite` : vrai quand
 * la requête porte une marque de campagne (utm, src, gclid), ce qui autorise
 * à écraser un cookie existant. Un référent ou une arrivée directe ne font
 * que compléter un visiteur encore inconnu : le premier contact reste le
 * premier contact.
 */
export function provenanceDepuisRequete(
  url: URL,
  referer: string | null,
  aujourdHui: string,
): { provenance: Provenance; explicite: boolean } {
  const q = url.searchParams;
  const landing = url.pathname.slice(0, 120) || "/";
  const src = q.get("src") ? nettoyer(q.get("src") as string) : undefined;

  const utmSource = q.get("utm_source");
  if (utmSource && nettoyer(utmSource)) {
    return {
      explicite: true,
      provenance: {
        source: nettoyer(utmSource),
        medium: nettoyer(q.get("utm_medium") ?? "") || "none",
        campaign: nettoyer(q.get("utm_campaign") ?? "", 80) || "none",
        ...(src ? { src } : {}),
        landing,
        at: aujourdHui,
      },
    };
  }

  if (src) {
    const utm = utmDepuisSrc(src);
    if (utm) {
      return { explicite: true, provenance: { ...utm, src, landing, at: aujourdHui } };
    }
  }

  // Un clic Google Ads porte toujours `gclid`, même quand l'annonceur a oublié
  // les utm. Le compter en « google / cpc » évite de le confondre avec le SEO.
  if (q.get("gclid")) {
    return {
      explicite: true,
      provenance: { source: "google", medium: "cpc", campaign: "gclid", landing, at: aujourdHui },
    };
  }

  const ref = sourceDepuisReferent(referer);
  if (ref) return { explicite: false, provenance: { ...ref, landing, at: aujourdHui } };

  return {
    explicite: false,
    provenance: { source: "direct", medium: "none", campaign: "direct", landing, at: aujourdHui },
  };
}

// ── Sérialisation cookie ↔ metadata Stripe ──────────────────────────────────

export function encoderProvenance(p: Provenance): string {
  const params = new URLSearchParams();
  params.set("s", p.source);
  params.set("m", p.medium);
  params.set("c", p.campaign);
  if (p.src) params.set("x", p.src);
  params.set("l", p.landing);
  if (p.referrer) params.set("r", p.referrer);
  params.set("d", p.at);
  return params.toString();
}

export function decoderProvenance(raw: string | undefined | null): Provenance | null {
  if (!raw) return null;
  try {
    const q = new URLSearchParams(raw);
    const source = q.get("s");
    if (!source) return null;
    return {
      source: nettoyer(source, 60),
      medium: nettoyer(q.get("m") ?? "") || "none",
      campaign: nettoyer(q.get("c") ?? "", 80) || "none",
      ...(q.get("x") ? { src: nettoyer(q.get("x") as string) } : {}),
      landing: (q.get("l") ?? "/").slice(0, 120),
      ...(q.get("r") ? { referrer: nettoyer(q.get("r") as string, 60) } : {}),
      at: (q.get("d") ?? "").slice(0, 10),
    };
  } catch {
    return null;
  }
}

/** Clés telles qu'elles voyagent dans la metadata Stripe, puis en base. */
export function provenanceVersMetadata(p: Provenance | null): Record<string, string> {
  if (!p) return {};
  const md: Record<string, string> = {
    utm_source: p.source,
    utm_medium: p.medium,
    utm_campaign: p.campaign,
    landing: p.landing,
    first_seen: p.at,
  };
  if (p.src) md.src = p.src;
  if (p.referrer) md.referrer = p.referrer;
  return md;
}

export function provenanceDepuisMetadata(
  md: Record<string, string> | null | undefined,
): Provenance | null {
  if (!md?.utm_source) return null;
  return {
    source: md.utm_source,
    medium: md.utm_medium || "none",
    campaign: md.utm_campaign || "none",
    ...(md.src ? { src: md.src } : {}),
    landing: md.landing || "/",
    ...(md.referrer ? { referrer: md.referrer } : {}),
    at: md.first_seen || "",
  };
}

/** « instagram / bio », « google / organic », « direct »… pour un humain. */
export function libelleCanal(p: Pick<Provenance, "source" | "medium"> | null): string {
  if (!p) return "inconnu";
  if (p.source === "direct") return "direct";
  return p.medium && p.medium !== "none" ? `${p.source} / ${p.medium}` : p.source;
}
