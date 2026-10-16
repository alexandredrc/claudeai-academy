import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { parseLessonContent } from "@/lib/lessons/blocks";

/**
 * Journal public des mises à jour (`/changelog`).
 *
 * Les leçons portent des notes datées (blocs `:::maj`, voir
 * scripts/content/FORMAT.md) invisibles avant achat. Ce module les relève dans
 * `lessons.content_md` pour prouver au visiteur que le contenu suit
 * l'écosystème, SANS jamais publier le corps d'une note : seuls l'en-tête du
 * bloc (sa date, et le sous-titre que certains en-têtes portent), la leçon et
 * le parcours sortent d'ici. Le corps reste dans la leçon, derrière le paywall.
 *
 * `content_md` n'est lisible qu'avec la clé service_role (migration 0002) :
 * ce module est donc réservé au serveur.
 */

export type NoteMaj = {
  /** Date de tri AAAA-MM-JJ : la plus récente de l'en-tête (une plage se range à sa fin). */
  iso: string;
  /** Date telle qu'affichée, sans tiret long (« 19 juillet au 6 août 2026 »). */
  date: string;
  /** Sous-titre écrit dans l'en-tête du bloc, quand il y en a un. */
  sujet: string | null;
  lecon: { slug: string; titre: string; ordre: number; libre: boolean };
  parcours: { slug: string; titre: string; ordre: number };
};

const MOIS = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];

const DATE_RE = new RegExp(`(\\d{1,2})(?:er)?\\s+(${MOIS.join("|")})\\s+(\\d{4})`, "giu");

/** Séparateurs admis entre la date et le sous-titre d'un en-tête. */
const SEPARATEUR_RE = /\s+[—–·]\s+/;

function majuscule(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Lit l'en-tête d'un bloc `:::maj`. Formes présentes en base au 16/10/2026 :
 *   « 24 juillet 2026 »
 *   « 15 juillet 2026 — corrigé »
 *   « 19 juillet — 6 août 2026 »               (plage sur deux mois)
 *   « 22 au 29 septembre 2026 — le mode auto … »
 *   « Repères de version au 19 août 2026 »
 * Retourne `null` si aucune date complète (jour, mois, année) n'y figure.
 */
export function lireEnTeteMaj(
  enTete: string,
): Pick<NoteMaj, "iso" | "date" | "sujet"> | null {
  const brut = enTete.trim();
  const dates = [...brut.matchAll(DATE_RE)];
  if (dates.length === 0) return null;

  // La date de tri est la dernière de l'en-tête : une plage se range à sa fin.
  const derniere = dates[dates.length - 1];
  const mois = MOIS.indexOf(derniere[2].toLowerCase()) + 1;
  const iso = `${derniere[3]}-${String(mois).padStart(2, "0")}-${derniere[1].padStart(2, "0")}`;
  const finDate = (derniere.index ?? 0) + derniere[0].length;

  let partieDate = brut.slice(0, finDate);
  let sujet = brut.slice(finDate).replace(/^\s*[—–·:]\s*/, "").trim();

  // « Repères de version au 19 août 2026 » : le texte précède la date.
  if (!/^\d/.test(partieDate)) {
    const debut = /\d/.exec(partieDate)?.index ?? 0;
    sujet = partieDate.slice(0, debut).replace(/\s+au\s*$/u, "").trim();
    partieDate = partieDate.slice(debut);
  }

  // « 19 juillet — 6 août 2026 » se lit « 19 juillet au 6 août 2026 ».
  const date = partieDate.split(SEPARATEUR_RE).join(" au ").replace(/\s+/g, " ").trim();

  return { iso, date, sujet: sujet ? majuscule(sujet) : null };
}

type LessonRow = {
  slug: string;
  title: string;
  display_order: number;
  is_free_preview: boolean;
  content_md: string | null;
  course_id: string;
};

type CourseRow = { id: string; slug: string; title: string; display_order: number };

export type JournalMaj = {
  notes: NoteMaj[];
  /** En-têtes `:::maj` sans date lisible : comptés à part, jamais affichés. */
  illisibles: number;
  /** Nombre total de leçons du catalogue, pour « X leçons sur Y ». */
  totalLecons: number;
  /** Nombre de leçons par parcours (clé = slug), pour la vue filtrée. */
  leconsParParcours: Record<string, number>;
};

/** « 2026-10-01 » → « 1er octobre 2026 ». */
export function dateFr(iso: string): string {
  const [a, m, j] = iso.split("-").map(Number);
  return `${j === 1 ? "1er" : j} ${MOIS[m - 1]} ${a}`;
}

/** « 2026-10-01 » → « Octobre 2026 ». */
export function moisFr(iso: string): string {
  const [a, m] = iso.split("-").map(Number);
  return `${majuscule(MOIS[m - 1])} ${a}`;
}

/**
 * Lecture brute : tout `content_md` (≈ 1 Mo) pour n'en garder que les
 * en-têtes. Ne pas appeler directement, passer par `getJournalMaj`.
 */
async function lireJournal(): Promise<JournalMaj> {
  const [{ data: courses, error: cErr }, { data: lessons, error: lErr }] = await Promise.all([
    supabaseAdmin.from("courses").select("id, slug, title, display_order"),
    supabaseAdmin
      .from("lessons")
      .select("slug, title, display_order, is_free_preview, content_md, course_id"),
  ]);

  // Une page vide ferait croire que le contenu n'est jamais mis à jour : on
  // préfère l'erreur, que Next affiche comme telle, à un faux journal.
  if (cErr || !courses) throw new Error(`Journal des mises à jour : lecture des parcours échouée (${cErr?.message})`);
  if (lErr || !lessons) throw new Error(`Journal des mises à jour : lecture des leçons échouée (${lErr?.message})`);

  const parcoursParId = new Map((courses as CourseRow[]).map((c) => [c.id, c]));
  const notes: NoteMaj[] = [];
  const leconsParParcours: Record<string, number> = {};
  let illisibles = 0;

  for (const l of lessons as LessonRow[]) {
    const c = parcoursParId.get(l.course_id);
    if (!c) continue;
    leconsParParcours[c.slug] = (leconsParParcours[c.slug] ?? 0) + 1;
    if (!l.content_md) continue;
    for (const segment of parseLessonContent(l.content_md)) {
      if (segment.kind !== "block" || segment.type !== "maj") continue;
      const enTete = segment.title ? lireEnTeteMaj(segment.title) : null;
      if (!enTete) {
        illisibles++;
        continue;
      }
      notes.push({
        ...enTete,
        lecon: { slug: l.slug, titre: l.title, ordre: l.display_order, libre: l.is_free_preview },
        parcours: { slug: c.slug, titre: c.title, ordre: c.display_order },
      });
    }
  }

  notes.sort(
    (a, b) =>
      b.iso.localeCompare(a.iso) ||
      a.parcours.ordre - b.parcours.ordre ||
      a.lecon.ordre - b.lecon.ordre,
  );

  return { notes, illisibles, totalLecons: lessons.length, leconsParParcours };
}

/**
 * Le relevé ne change qu'au seed d'une leçon : on le garde une heure dans le
 * cache de données de Next. L'accueil, rendu à chaque visite, l'utilise pour
 * ses cartes de parcours ; sans ce cache, chaque visite relirait tout le
 * contenu des leçons. Seul le résultat (les en-têtes, quelques dizaines de Ko) est stocké,
 * jamais `content_md`. Une erreur n'est pas mise en cache.
 */
const journalEnCache = unstable_cache(lireJournal, ["journal-maj-v1"], { revalidate: 3600 });

/**
 * Toutes les notes `:::maj` des leçons, de la plus récente à la plus ancienne.
 * À date égale : ordre du catalogue (parcours, puis leçon).
 * Lève une erreur si la base est injoignable.
 */
export const getJournalMaj = cache(() => journalEnCache());

/**
 * Date (AAAA-MM-JJ) de la note la plus récente de chaque parcours, clé = slug.
 * Un parcours sans note n'a pas d'entrée : on n'affiche jamais de date
 * inventée. Base injoignable : objet vide, la page qui l'appelle s'affiche
 * sans les dates plutôt que de tomber.
 */
export async function getDerniereMajParParcours(): Promise<Record<string, string>> {
  try {
    const { notes } = await getJournalMaj();
    const derniere: Record<string, string> = {};
    // Notes triées de la plus récente à la plus ancienne : la première vue gagne.
    for (const n of notes) derniere[n.parcours.slug] ??= n.iso;
    return derniere;
  } catch {
    return {};
  }
}
