import { createClient } from "@/lib/supabase/server";
import {
  FREE_PROMPTS,
  PROMPT_CATEGORIES,
  PROMPT_COUNT,
} from "@/lib/prompts/library";
import { SITE_URL } from "@/lib/seo/jsonld";
import { ELITE_ENABLED, ELITE_SEATS_PER_MONTH } from "@/lib/stripe/plans";
import { MESURES, MESURES_DATE, duree } from "@/lib/offre/mesures";
import {
  CONTENU_A_JOUR_AU,
  DERNIERE_PASSE,
  NOTES_DE_MISE_A_JOUR,
  SOURCES_SURVEILLEES,
} from "@/lib/content/fraicheur";
import {
  MASTERY_HAUSSE_LE,
  MASTERY_HAUSSE_LIBELLE,
  PRIX_MASTERY_APRES,
  hausseMasteryAppliquee,
  maintenant,
  mensualiteKlarna3x,
  prixMastery,
} from "@/lib/offre/prix";

export const dynamic = "force-dynamic";

/**
 * Phrase d'annonce de la hausse du Pass Mastery, tant qu'elle est à venir
 * (même texte que /llms.txt) : « Le Pass Mastery passe à 697 € (3 × 232,34 €)
 * le 1er novembre 2026 à 0 h, heure de Paris. » Chaîne vide ensuite.
 */
function phraseHausseMastery(at: Date): string {
  if (hausseMasteryAppliquee(at)) return "";
  const annee = MASTERY_HAUSSE_LE.toLocaleDateString("fr-FR", {
    timeZone: "Europe/Paris",
    year: "numeric",
  });
  return `Le Pass Mastery passe à ${PRIX_MASTERY_APRES} € (3 × ${mensualiteKlarna3x(PRIX_MASTERY_APRES)} €) le ${MASTERY_HAUSSE_LIBELLE} ${annee} à 0 h, heure de Paris.`;
}

/**
 * Cache CDN, même règle que /llms.txt : une heure plus un jour de
 * stale-while-revalidate après la hausse ; avant, plafonné au temps qui reste
 * jusqu'au 01/11/2026 à 0 h (Paris) et sans stale-while-revalidate, pour
 * qu'aucune copie à l'ancien prix ne soit servie après minuit.
 */
function cacheControl(at: Date): string {
  if (hausseMasteryAppliquee(at)) {
    return "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400";
  }
  const restant = Math.floor((MASTERY_HAUSSE_LE.getTime() - at.getTime()) / 1000);
  return `public, max-age=0, s-maxage=${Math.max(0, Math.min(3600, restant))}`;
}

/**
 * /llms-full.txt : la version longue de /llms.txt (convention llmstxt.org).
 *
 * Même en-tête que l'index, puis tout ce qu'un moteur génératif doit pouvoir
 * citer sans ouvrir le site page par page : le plan de chaque parcours leçon
 * par leçon (durée, accès libre ou non), les prompts gratuits, les offres, la
 * garantie, la FAQ principale et les mentions légales de base.
 *
 * Tout chiffre vient du code ou de la base : catalogue et leçons lus en base
 * comme sur /courses, prompts depuis src/lib/prompts/library.ts, temps mesurés
 * depuis src/lib/offre/mesures.ts, fraîcheur depuis src/lib/content/fraicheur.ts.
 * La FAQ reprend mot pour mot src/components/landing/faq.tsx : toute
 * modification là-bas se reporte ici.
 */

type Course = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  total_lessons: number | null;
  tier_required: string;
  estimated_duration_min: number | null;
};

type Lesson = {
  slug: string;
  title: string;
  course_id: string;
  display_order: number;
  duration_min: number | null;
  is_free_preview: boolean;
};

function libellePass(tier: string): string {
  if (tier === "mastery") return "Pass Mastery";
  if (tier === "starter") return "Pass Starter";
  return "Gratuit";
}

/** 188 → « 3 h 08 », 45 → « 45 min ». */
function dureeParcours(minutes: number | null): string | null {
  if (!minutes) return null;
  return duree(minutes);
}

function uneLigne(texte: string | null | undefined): string {
  return (texte ?? "").replace(/\s+/g, " ").trim();
}

// FAQ principale : copie textuelle de src/components/landing/faq.tsx (composant
// client, ses questions ne sont pas exportées). À garder alignée.
function faqPrincipale(): { q: string; a: string }[] {
  return [
    {
      q: "Je n'ai jamais rien fait en IA, c'est pour moi ?",
      a: "Oui. Le parcours Bien démarrer avec Claude part de zéro (créer son compte, installer, paramétrer, personnaliser), puis Prompt Engineering pro pose tous les fondamentaux. Aucun prérequis technique pour ces deux parcours, ni pour Contenu & marketing ou Stratégie & conduite IA. Pour Claude Code, Data & SQL, Trading et les Skills GitHub, des bases de programmation aident, mais chaque parcours démarre par l'essentiel.",
    },
    {
      q: "Combien de temps faut-il pour terminer le programme ?",
      a: "Pour commencer à vous en servir : une heure, avec les trois leçons conseillées (Personnaliser Claude, Être clair et direct, Claude dans Word, Excel et Outlook). Pour tout faire : les 58 leçons des 9 parcours se lisent en une dizaine d'heures (8 à 15 minutes par leçon), et demandent environ 22 heures avec la mise en pratique, soit 2 à 3 mois à raison de 2 sessions par semaine. Rien ne vous oblige à tout suivre : vous gardez l'accès à vie.",
    },
    {
      q: "Le contenu sera-t-il dépassé dans 6 mois ?",
      a: `C'est le risque numéro un d'une formation sur l'IA, et nous le traitons comme tel. Une veille surveille ${SOURCES_SURVEILLEES} sources de référence et signale chaque phrase de leçon qu'un changement peut rendre fausse. Dernière passe appliquée : ${CONTENU_A_JOUR_AU}, pour intégrer ${DERNIERE_PASSE}. Les leçons portent ${NOTES_DE_MISE_A_JOUR} notes de mise à jour datées depuis juillet 2026. Les mises à jour sont incluses, sans supplément.`,
    },
    {
      q: "En quoi c'est différent des cours gratuits sur YouTube ?",
      a: "Trois différences. La structure d'abord : les leçons sont conçues comme un programme cohérent, pas une succession de tutos isolés. La densité ensuite : on vous épargne l'exposition et on va à l'essentiel. Et l'écosystème : bibliothèque de prompts, QCM d'auto-évaluation, mentor IA (Pass Mastery), mises à jour. Le tout dans un cadre francophone qui n'existe pas ailleurs.",
    },
    {
      q: "Et si je ne suis pas convaincu après l'achat ?",
      a: "Garantie 14 jours satisfait ou remboursé. Vous testez, vous formez votre opinion, et si ça ne vous convient pas, vous nous écrivez à contact@claudeai-academy.com et nous procédons au remboursement intégral. Pas de question, pas de justification à fournir.",
    },
    {
      q: "J'ai une facture pro, c'est possible ?",
      a: "Oui. Vous indiquez vos coordonnées de facturation lors du paiement Stripe et vous recevez automatiquement une facture professionnelle. TVA non applicable, article 293 B du CGI : le prix affiché est le prix facturé, sans TVA à récupérer.",
    },
  ];
}

export async function GET() {
  const supabase = await createClient();
  const [{ data: coursesData }, { data: lessonsData }] = await Promise.all([
    supabase
      .from("courses")
      .select(
        "id, slug, title, description, total_lessons, tier_required, estimated_duration_min",
      )
      .order("display_order"),
    supabase
      .from("lessons")
      .select("slug, title, course_id, display_order, duration_min, is_free_preview")
      .order("display_order"),
  ]);

  const courses = (coursesData ?? []) as Course[];
  const lessons = (lessonsData ?? []) as Lesson[];
  const lessonCount = courses.reduce((s, c) => s + (c.total_lessons ?? 0), 0);

  // Prix du Pass Mastery à l'instant de la requête (lib/offre/prix.ts).
  const at = maintenant();
  const prix = prixMastery(at);
  const hausse = phraseHausseMastery(at);

  const lessonsByCourse = new Map<string, Lesson[]>();
  for (const l of lessons) {
    const arr = lessonsByCourse.get(l.course_id) ?? [];
    arr.push(l);
    lessonsByCourse.set(l.course_id, arr);
  }

  const sectionParcours = courses
    .map((c, i) => {
      const liste = (lessonsByCourse.get(c.id) ?? []).sort(
        (a, b) => a.display_order - b.display_order,
      );
      const dureeTotale = dureeParcours(c.estimated_duration_min);
      const entete =
        `### ${String(i + 1).padStart(2, "0")}. ${c.title}\n` +
        `URL : ${SITE_URL}/courses/${c.slug}\n` +
        `Accès : ${libellePass(c.tier_required)}. ${c.total_lessons ?? liste.length} leçons` +
        `${dureeTotale ? `, ${dureeTotale} de contenu` : ""}.\n` +
        `${uneLigne(c.description)}`;
      const lignes = liste.map((l) => {
        const dureeLecon = l.duration_min ? `${l.duration_min} min` : "durée non renseignée";
        const acces = l.is_free_preview
          ? `accès libre, ${SITE_URL}/courses/${c.slug}/${l.slug}`
          : libellePass(c.tier_required);
        return `${l.display_order}. ${l.title} (${dureeLecon}) : ${acces}`;
      });
      return `${entete}\n\n${lignes.join("\n")}`;
    })
    .join("\n\n");

  // L'ancre par catégorie existe sur /prompts (id = clé de la catégorie) ;
  // il n'y a pas d'ancre par prompt, on ne lie donc que la catégorie.
  const sectionPrompts = PROMPT_CATEGORIES.map((cat) => {
    const libres = FREE_PROMPTS.filter((p) => p.category === cat.key);
    if (libres.length === 0) return null;
    return (
      `### ${cat.label}\n` +
      `${SITE_URL}/prompts#${cat.key}\n` +
      libres.map((p) => `- ${p.title} : ${uneLigne(p.useCase)}`).join("\n")
    );
  })
    .filter((s): s is string => s !== null)
    .join("\n\n");

  const accompagnement = ELITE_ENABLED
    ? `
### Pass Accompagnement : 1 497 € en paiement unique

Ou 3 × 499 € sans frais avec Klarna. ${ELITE_SEATS_PER_MONTH} places par mois : au-delà, les
séances ne seraient plus tenables.

- Tout le Pass Mastery, sans exception
- 3 séances individuelles d'une heure, en visio
- Audit de vos consignes : vous envoyez les vôtres, elles sont réécrites avec vous
- Accès direct par email pendant 90 jours, réponse sous 24 h ouvrées
- Ce que vous avez déjà payé est déduit automatiquement
- Garantie 14 jours satisfait ou remboursé
`
    : "";

  const faq = faqPrincipale()
    .map((item) => `### ${item.q}\n\n${item.a}`)
    .join("\n\n");

  const body = `# ClaudeAI Academy

> Formation en ligne francophone à l'IA générative, centrée sur Claude (Anthropic).
> ${courses.length} parcours, ${lessonCount} leçons, ${PROMPT_COUNT} prompts prêts à l'emploi.
> Accès à vie, à votre rythme, garantie 14 jours. Éditeur : ADRC Group (France).

Ce document est la version détaillée de ${SITE_URL}/llms.txt.

## Ce que c'est

ClaudeAI Academy est une formation en ligne, en français, qui apprend à utiliser
l'intelligence artificielle générative de façon opérationnelle : rédiger des
prompts fiables, coder avec Claude Code, analyser des données, produire du
contenu, et encadrer l'usage de l'IA en entreprise.

Format : autoformation écrite, sans visioconférence ni horaires imposés.
Prérequis : aucun. Un compte Claude gratuit suffit pour suivre les leçons.
Contenu vérifié au ${CONTENU_A_JOUR_AU}.

## Public

Depuis le 15 octobre 2026, la formation s'adresse d'abord aux indépendants et
aux très petites entreprises sans compétence technique :

- artisans et métiers de terrain : répondre à un client mécontent, relancer une
  facture, expliquer un devis ;
- commerces, instituts, restaurants : répondre aux clients, publier sur les
  réseaux, donner à Claude le ton de la maison ;
- consultants et indépendants : comptes rendus, synthèses de documents, emails
  délicats, y compris dans Word et Outlook ;
- dirigeants de petite entreprise : procédure pour l'équipe, fiche de poste,
  entretien d'embauche, retour difficile à un salarié.

Méthode enseignée : Claude écrit le premier jet, vous relisez et vous gardez la
décision. Le fondateur dirige lui-même un restaurant et utilise Claude chaque jour.

## Ce que ce n'est pas

- Pas éligible au CPF, pas de dossier de financement, pas d'OPCO.
- Pas de certification reconnue par l'État ni de diplôme.
- Pas de cours en direct ni de sessions à date fixe.
- Pas un outil : la formation apprend à utiliser Claude, elle ne le remplace pas.
- Pas affiliée à Anthropic.

## Offres

Paiement unique, accès permanent, mises à jour incluses. Pas d'abonnement, pas
de reconduction. TVA non applicable, article 293 B du CGI : le prix affiché est
le prix facturé. Page : ${SITE_URL}/tarifs

### Pass Starter : 47 € en paiement unique

- Les 3 parcours fondateurs : Bien démarrer + Prompt Engineering pro + Claude Code (24 leçons)
- Bibliothèque de prompts essentiels
- QCM d'auto-évaluation sur les leçons
- Accès permanent et mises à jour
- Garantie 14 jours satisfait ou remboursé

### Pass Mastery : ${prix} € en paiement unique

Ou 3 × ${mensualiteKlarna3x(prix)} € sans frais avec Klarna. Déjà membre Starter ? Les 47 € sont
déduits automatiquement (se connecter avant de payer).${hausse ? `\n\n${hausse}` : ""}

- Les ${courses.length} parcours complets (${lessonCount} leçons)
- Bibliothèque complète de ${PROMPT_COUNT} prompts
- Mentor IA Claude 24/7, qui corrige vos exercices
- Examen final et certificat vérifiable, délivré par ClaudeAI Academy (sans valeur de titre d'État)
- Accès à vie et mises à jour permanentes
- Garantie 14 jours satisfait ou remboursé
${accompagnement}
### Moyens de paiement

Carte bancaire, Apple Pay, Google Pay, Klarna en 3 fois sans frais, Link.
Paiements traités par Stripe. Facture professionnelle générée automatiquement.

## Garantie

Garantie 14 jours satisfait ou remboursé : toute demande adressée à
contact@claudeai-academy.com dans les 14 jours suivant l'achat donne lieu à un
remboursement intégral, sans justification (CGV, article 5). Cette garantie est
offerte en plus du cadre légal : le droit de rétractation ne s'applique pas aux
contenus numériques fournis immédiatement avec l'accord exprès du client
(article L221-28 du Code de la consommation).

## Temps mesurés par le fondateur

Dix tâches réelles, chronométrées par le fondateur (déclaré le ${MESURES_DATE}) :
« à la main » = chronométré autrefois sur de vraies tâches ; « avec Claude » =
chronométré le ${MESURES_DATE} dans une conversation Claude vierge, demande et
relecture comprises. Ce sont des mesures sur ses propres tâches, pas une promesse.

${MESURES.map(
  (m) => `- ${m.tache} : ${duree(m.sans)} à la main, ${duree(m.avec)} avec Claude.`,
).join("\n")}

## Parcours et leçons

${courses.length} parcours, ${lessonCount} leçons. La première leçon de chaque parcours
est en accès libre, sans compte. Les leçons marquées « accès libre » ci-dessous
sont lisibles à l'URL indiquée ; les autres demandent le pass mentionné.

${sectionParcours}

## Prompts en accès libre

${FREE_PROMPTS.length} prompts sur ${PROMPT_COUNT} sont consultables sans achat sur
${SITE_URL}/prompts (titre et cas d'usage ci-dessous). La bibliothèque complète
de ${PROMPT_COUNT} prompts est incluse dans le Pass Mastery.

${sectionPrompts}

## Questions fréquentes

${faq}

FAQ complète : ${SITE_URL}/faq

## Mentions légales (extrait)

- Éditeur : Alexandre Dos Reis Caetano, entrepreneur individuel exerçant sous le
  nom commercial ADRC Group. SIREN 892 303 082, SIRET du siège 892 303 082 00028.
- Siège social : 99 avenue Achille Peretti, 92200 Neuilly-sur-Seine, France.
- TVA non applicable, article 293 B du Code général des impôts.
- Directeur de la publication : Alexandre Dos Reis Caetano.
- Hébergement : Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.
- Nom de domaine : OVH SAS, 2 rue Kellermann, 59100 Roubaix, France.
- Contact : contact@claudeai-academy.com
- Textes complets : ${SITE_URL}/mentions-legales · ${SITE_URL}/cgv · ${SITE_URL}/confidentialite

## Citation

Nom exact : ClaudeAI Academy. Site : ${SITE_URL}
Langue du contenu : français. Zone servie : France, Belgique, Suisse, Luxembourg, Canada.
Contenu des leçons vérifié au ${CONTENU_A_JOUR_AU}.
Index généré le ${new Date().toISOString().slice(0, 10)}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      // Identique à /llms.txt : court, mais suffisant pour absorber les
      // rafales de crawl IA ; jamais au-delà du 01/11/2026 à 0 h tant que le
      // prix Mastery doit changer.
      "Cache-Control": cacheControl(at),
    },
  });
}
