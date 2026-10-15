import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { CONTENU_A_JOUR_AU } from "@/lib/content/fraicheur";

const BASE = "https://www.claudeai-academy.com";

type Freq = "weekly" | "monthly" | "yearly";

/**
 * `lastmod` : date RÉELLE de dernière modification, au format AAAA-MM-JJ.
 *
 * Google n'utilise `lastmod` que s'il est vérifiablement exact ; une date qui
 * change à chaque génération (audit du 15/10/2026 : la même heure sur les
 * 24 URL statiques) le pousse à ignorer le champ pour tout le fichier.
 *
 * Comment la mettre à jour, à chaque modification visible d'une page :
 *   git log -1 --format=%cs -- src/app/<chemin>/page.tsx
 *   (accueil = src/app/page.tsx ; une page composée de blocs partagés, comme
 *   l'accueil ou /tarifs, prend la date du dernier commit qui a changé son
 *   rendu, blocs compris).
 *
 * `suitFraicheur` : la page affiche des valeurs lues dans
 * src/lib/content/fraicheur.ts (date de la dernière passe de veille) : au
 * 15/10/2026, l'accueil, /tarifs et /faq, via le bloc FAQ. Pour ces pages, la
 * date retenue est la plus récente entre `lastmod` et CONTENU_A_JOUR_AU, pour
 * qu'une passe de veille se voie sans toucher ce fichier. Les guides qui citent
 * une date en dur dans leur texte ne sont pas marqués : une passe qui les
 * change passe par leur page.tsx, donc par git.
 */
const staticRoutes: {
  path: string;
  priority: number;
  changeFrequency: Freq;
  lastmod: string;
  suitFraicheur?: boolean;
}[] = [
  { path: "/", priority: 1, changeFrequency: "weekly", lastmod: "2026-10-15", suitFraicheur: true },
  // Page métier pour le public fixé le 15/10/2026 : indépendants et TPE non
  // techniques. Première page du site à viser « formation IA » pour ce public.
  { path: "/formation-ia-independants-tpe", priority: 0.8, changeFrequency: "monthly", lastmod: "2026-10-15" },
  // Pages piliers organiques : elles visent les requêtes de tête réellement
  // recherchées en France (« formation intelligence artificielle »,
  // « claude ou chatgpt »), là où le reste du site vise « formation Claude AI ».
  { path: "/formation-intelligence-artificielle", priority: 0.95, changeFrequency: "monthly", lastmod: "2026-10-11" },
  { path: "/claude-vs-chatgpt", priority: 0.85, changeFrequency: "monthly", lastmod: "2026-10-11" },
  // Satellites du pilier : ils captent les requêtes de moyenne traîne et
  // renvoient l'autorité vers /formation-intelligence-artificielle.
  { path: "/prompt-engineering", priority: 0.85, changeFrequency: "monthly", lastmod: "2026-10-11" },
  { path: "/formation-ia-obligatoire-ai-act", priority: 0.85, changeFrequency: "monthly", lastmod: "2026-10-11" },
  // « certification claude » / « certification anthropic » pesaient 28 % des
  // clics publicitaires identifies : une demande mesuree, a laquelle personne
  // ne repond honnetement en francais.
  { path: "/certification-claude-ai", priority: 0.85, changeFrequency: "monthly", lastmod: "2026-10-11" },
  // « claude code skill » : la requête associée à Claude Code qui progresse le
  // plus en France (Trends, 12 mois au 02/10/2026). Personne n'y répond en français.
  { path: "/claude-code-skills", priority: 0.85, changeFrequency: "monthly", lastmod: "2026-10-09" },
  // « formation claude code » et ses variantes : positions 59 à 90 en Search
  // Console (28 j au 04/10/2026) faute de page qui porte ces mots en titre ;
  // « claude code » = 90 500 recherches par mois en France (Keyword Planner).
  { path: "/formation-claude-code", priority: 0.9, changeFrequency: "monthly", lastmod: "2026-10-09" },
  // « comment créer un agent ia » : 590 recherches par mois en France (+321 % sur
  // un an, Keyword Planner lu le 4 octobre 2026). La leçon 1 du parcours est libre.
  { path: "/creer-un-agent-ia", priority: 0.85, changeFrequency: "monthly", lastmod: "2026-10-09" },
  // « claude excel », « claude powerpoint » : Claude for Microsoft 365 est
  // disponible sur tous les plans payants depuis 2026 et aucune page française
  // sérieuse n'explique quoi installer, ce que ça fait et ce que ça refuse.
  { path: "/claude-excel-powerpoint", priority: 0.85, changeFrequency: "monthly", lastmod: "2026-10-09" },
  // Pages d'entrée sur les requêtes de marque les plus fréquentes en France
  // (« claude ai gratuit », « télécharger claude ai », « claude cowork »).
  { path: "/claude-ai-gratuit", priority: 0.8, changeFrequency: "monthly", lastmod: "2026-10-03" },
  { path: "/telecharger-claude", priority: 0.8, changeFrequency: "monthly", lastmod: "2026-10-03" },
  { path: "/claude-cowork", priority: 0.7, changeFrequency: "monthly", lastmod: "2026-10-03" },
  { path: "/courses", priority: 0.9, changeFrequency: "weekly", lastmod: "2026-10-11" },
  { path: "/tarifs", priority: 0.9, changeFrequency: "monthly", lastmod: "2026-10-15", suitFraicheur: true },
  { path: "/prompts", priority: 0.8, changeFrequency: "weekly", lastmod: "2026-10-11" },
  // Le kit gratuit est la porte d'entrée organique la plus large : il doit
  // être découvrable, il ne l'était pas.
  { path: "/kit", priority: 0.7, changeFrequency: "monthly", lastmod: "2026-10-06" },
  // Test anglophone d'octobre 2026 : la version anglaise du kit.
  { path: "/en/kit", priority: 0.5, changeFrequency: "monthly", lastmod: "2026-10-09" },
  { path: "/faq", priority: 0.6, changeFrequency: "monthly", lastmod: "2026-10-15", suitFraicheur: true },
  { path: "/a-propos", priority: 0.5, changeFrequency: "yearly", lastmod: "2026-10-15" },
  { path: "/contact", priority: 0.4, changeFrequency: "yearly", lastmod: "2026-10-11" },
  { path: "/mentions-legales", priority: 0.2, changeFrequency: "yearly", lastmod: "2026-10-11" },
  { path: "/cgv", priority: 0.2, changeFrequency: "yearly", lastmod: "2026-10-11" },
  { path: "/confidentialite", priority: 0.2, changeFrequency: "yearly", lastmod: "2026-10-11" },
];

const MOIS_FR: Record<string, string> = {
  janvier: "01",
  février: "02",
  fevrier: "02",
  mars: "03",
  avril: "04",
  mai: "05",
  juin: "06",
  juillet: "07",
  août: "08",
  aout: "08",
  septembre: "09",
  octobre: "10",
  novembre: "11",
  décembre: "12",
  decembre: "12",
};

/** « 9 octobre 2026 » → « 2026-10-09 » ; `null` si la forme n'est pas reconnue. */
function isoDepuisDateFr(date: string): string | null {
  const m = date.trim().toLowerCase().match(/^(\d{1,2})(?:er)?\s+([a-zéû]+)\s+(\d{4})$/);
  if (!m) return null;
  const mois = MOIS_FR[m[2]];
  if (!mois) return null;
  return `${m[3]}-${mois}-${m[1].padStart(2, "0")}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const fraicheurIso = isoDepuisDateFr(CONTENU_A_JOUR_AU);

  const entries: MetadataRoute.Sitemap = staticRoutes.map((r) => {
    // Comparaison de chaînes AAAA-MM-JJ : l'ordre lexical est l'ordre des dates.
    const lastmod =
      r.suitFraicheur && fraicheurIso && fraicheurIso > r.lastmod ? fraicheurIso : r.lastmod;
    return {
      url: `${BASE}${r.path}`,
      lastModified: lastmod,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    };
  });

  // Client sans cookies (le sitemap est généré hors contexte de requête utilisateur) ;
  // la lecture du catalogue est publique via RLS, comme sur /courses.
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { data: courses } = await supabase
    .from("courses")
    .select("id, slug, updated_at")
    .order("display_order");

  for (const course of courses ?? []) {
    entries.push({
      url: `${BASE}/courses/${course.slug}`,
      // Date réelle de dernière révision : c'est le signal de fraîcheur que
      // lisent Google et les moteurs génératifs, pas une valeur décorative.
      lastModified: course.updated_at ? new Date(course.updated_at) : now,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  // Seules les leçons en aperçu gratuit sont indexables (les autres sont du
  // contenu verrouillé, sans intérêt pour les moteurs).
  if (courses?.length) {
    const courseById = new Map(courses.map((c) => [c.id, c.slug]));
    const { data: lessons } = await supabase
      .from("lessons")
      .select("slug, course_id, is_free_preview, updated_at")
      .eq("is_free_preview", true);

    for (const lesson of lessons ?? []) {
      const courseSlug = courseById.get(lesson.course_id);
      if (courseSlug) {
        entries.push({
          url: `${BASE}/courses/${courseSlug}/${lesson.slug}`,
          lastModified: lesson.updated_at ? new Date(lesson.updated_at) : now,
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    }
  }

  return entries;
}
