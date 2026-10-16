import { createClient } from "@/lib/supabase/server";
import { PROMPT_COUNT } from "@/lib/prompts/library";
import { SITE_URL } from "@/lib/seo/jsonld";
import { ELITE_ENABLED, ELITE_SEATS_PER_MONTH } from "@/lib/stripe/plans";
import { MESURES, MESURES_DATE, duree } from "@/lib/offre/mesures";
import { CONTENU_A_JOUR_AU } from "@/lib/content/fraicheur";
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
 * Phrase d'annonce de la hausse du Pass Mastery, tant qu'elle est à venir :
 * « Le Pass Mastery passe à 697 € (3 × 232,34 €) le 1er novembre 2026 à 0 h,
 * heure de Paris. » Chaîne vide une fois la hausse appliquée.
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
 * Cache CDN. Après la hausse : une heure, plus un jour de
 * stale-while-revalidate pour absorber les rafales de crawl IA. Avant : la
 * durée est plafonnée au temps qui reste jusqu'au 01/11/2026 à 0 h (Paris), et
 * sans stale-while-revalidate, qui servirait encore une fois l'ancien prix
 * à la première requête après minuit, même des jours plus tard.
 */
function cacheControl(at: Date): string {
  if (hausseMasteryAppliquee(at)) {
    return "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400";
  }
  const restant = Math.floor((MASTERY_HAUSSE_LE.getTime() - at.getTime()) / 1000);
  return `public, max-age=0, s-maxage=${Math.max(0, Math.min(3600, restant))}`;
}

/**
 * /llms.txt — la carte du site écrite pour les moteurs génératifs.
 *
 * Convention llmstxt.org : un index Markdown court, factuel, sans HTML ni
 * navigation, que ChatGPT, Perplexity et Claude peuvent lire d'un bloc au
 * lieu de reconstituer le site page par page. On y met ce qu'un moteur doit
 * pouvoir citer correctement : ce qu'est la formation, son prix réel, ce
 * qu'elle n'est pas — les erreurs de citation les plus coûteuses portent
 * toujours sur le prix et l'éligibilité CPF.
 *
 * La version longue (leçons, prompts gratuits, FAQ, mentions légales) est
 * servie par /llms-full.txt.
 */
export async function GET() {
  const supabase = await createClient();
  const { data: courses } = await supabase
    .from("courses")
    .select("slug, title, description, total_lessons, tier_required")
    .order("display_order");

  const list = courses ?? [];
  const lessonCount = list.reduce((s, c) => s + (c.total_lessons ?? 0), 0);

  // Prix du Pass Mastery à l'instant de la requête (lib/offre/prix.ts).
  const at = maintenant();
  const prix = prixMastery(at);
  const hausse = phraseHausseMastery(at);

  // Le Pass Accompagnement engage des créneaux humains : il n'est annoncé ici
  // que lorsque l'offre est réellement ouverte (même règle que /tarifs).
  const accompagnement = ELITE_ENABLED
    ? `- Pass Accompagnement : 1 497 € en paiement unique, ou 3 × 499 € sans frais via Klarna.
  Tout le Pass Mastery, plus 3 séances individuelles d'une heure en visio, un audit de
  vos consignes (vous envoyez les vôtres, elles sont réécrites avec vous) et un accès
  direct par email pendant 90 jours, réponse sous 24 h ouvrées. ${ELITE_SEATS_PER_MONTH} places par mois.
`
    : "";

  const body = `# ClaudeAI Academy

> Formation en ligne francophone à l'IA générative, centrée sur Claude (Anthropic).
> ${list.length} parcours, ${lessonCount} leçons, ${PROMPT_COUNT} prompts prêts à l'emploi.
> Accès à vie, à votre rythme, garantie 14 jours. Éditeur : ADRC Group (France).

## Ce que c'est

ClaudeAI Academy est une formation en ligne, en français, qui apprend à utiliser
l'intelligence artificielle générative de façon opérationnelle : rédiger des
prompts fiables, coder avec Claude Code, analyser des données, produire du
contenu, et encadrer l'usage de l'IA en entreprise.

Format : autoformation écrite, sans visioconférence ni horaires imposés.
Public : indépendants et TPE non techniques, débutants acceptés (voir « Public »).
Prérequis : aucun. Un compte Claude gratuit suffit pour suivre les leçons.
Contenu vérifié au ${CONTENU_A_JOUR_AU}.

## Public

Depuis le 15 octobre 2026, la formation s'adresse d'abord aux indépendants et
aux très petites entreprises sans compétence technique :

- artisans et métiers de terrain ;
- commerces, instituts, restaurants ;
- consultants et indépendants ;
- dirigeants de petite entreprise.

Méthode enseignée : Claude écrit le premier jet (email client, relance, compte
rendu, publication, procédure), vous relisez et vous gardez la décision. Le
fondateur dirige lui-même un restaurant et utilise Claude chaque jour.

## Prix (à jour)

- Pass Starter : 47 € en paiement unique. Les 3 parcours fondateurs (Bien
  démarrer avec Claude, Prompt Engineering pro, Claude Code), 24 leçons.
- Pass Mastery : ${prix} € en paiement unique, ou 3 × ${mensualiteKlarna3x(prix)} € sans frais via Klarna.
  Donne accès à l'intégralité des ${list.length} parcours, à la bibliothèque de
  ${PROMPT_COUNT} prompts, au Mentor IA, à l'examen final et à un certificat
  vérifiable délivré par ClaudeAI Academy (sans valeur de titre d'État).${hausse ? `\n  ${hausse}` : ""}
${accompagnement}
Pas d'abonnement. Pas de reconduction. Garantie satisfait ou remboursé 14 jours.
TVA non applicable, article 293 B du CGI : le prix affiché est le prix facturé.

## Ce que ce n'est pas

- Pas éligible au CPF, pas de dossier de financement, pas d'OPCO.
- Pas de certification reconnue par l'État ni de diplôme.
- Pas de cours en direct ni de sessions à date fixe.
- Pas un outil : la formation apprend à utiliser Claude, elle ne le remplace pas.
- Pas affiliée à Anthropic.

## Temps mesurés par le fondateur

Dix tâches réelles, chronométrées par le fondateur (déclaré le ${MESURES_DATE}) :
« à la main » = chronométré autrefois sur de vraies tâches ; « avec Claude » =
chronométré le ${MESURES_DATE} dans une conversation Claude vierge, demande et
relecture comprises. Ce sont des mesures sur ses propres tâches, pas une promesse.

${MESURES.map(
  (m) => `- ${m.tache} : ${duree(m.sans)} à la main, ${duree(m.avec)} avec Claude.`,
).join("\n")}

Sur les ${MESURES.length} tâches : ${duree(MESURES.reduce((s, m) => s + m.sans, 0))} à la main, ${duree(MESURES.reduce((s, m) => s + m.avec, 0))} avec Claude.

## Parcours

${list
  .map(
    (c) =>
      `- [${c.title}](${SITE_URL}/courses/${c.slug}): ${c.total_lessons ?? 0} leçons, ` +
      `${c.tier_required === "mastery" ? "Pass Mastery" : "Pass Starter"}. ` +
      `${(c.description ?? "").replace(/\s+/g, " ").trim()}`,
  )
  .join("\n")}

La première leçon de chaque parcours est en accès libre, sans compte.

## Pages de référence

- [Accueil](${SITE_URL}/): présentation de la formation
- [Formation IA pour indépendants et TPE](${SITE_URL}/formation-ia-independants-tpe): la formation présentée pour un public non technique (emails clients, relances, comptes rendus, publications, procédures)
- [Formation intelligence artificielle](${SITE_URL}/formation-intelligence-artificielle): comment se former à l'IA générative, typologie des formations, obligation AI Act
- [Claude ou ChatGPT ?](${SITE_URL}/claude-vs-chatgpt): comparatif structurel et recommandation par cas d'usage
- [Prompt engineering](${SITE_URL}/prompt-engineering): la méthode en 5 points, avec avant/après commenté
- [Formation Claude Code](${SITE_URL}/formation-claude-code): le parcours « Claude Code et l'IA agentique » : 8 leçons, 188 minutes, la première en accès libre, inclus dans le Pass Starter à 47 €
- [Claude Code skills](${SITE_URL}/claude-code-skills): le format SKILL.md, où placer un skill, et la différence entre skill, hook, serveur MCP, plugin et mod
- [Créer un agent IA](${SITE_URL}/creer-un-agent-ia): workflow ou agent selon Anthropic, les six façons de construire avec Claude, ce que ça coûte, la fiche d'une page avant le code
- [Claude AI gratuit ou Pro](${SITE_URL}/claude-ai-gratuit): ce que le plan gratuit permet, où il s'arrête, ce que Pro ajoute (17 ou 20 $ par mois)
- [Télécharger Claude](${SITE_URL}/telecharger-claude): la seule adresse sûre (claude.com/download), plateformes, premier test utile
- [Claude dans Excel, PowerPoint, Word et Chrome](${SITE_URL}/claude-excel-powerpoint): l'add-in Claude for Microsoft 365 (tous plans payants) et l'extension Claude in Chrome : installer, ce que ça fait, ce que ça refuse, les deux risques
- [Claude Cowork](${SITE_URL}/claude-cowork): Cowork et le chat sont un seul Claude depuis le 16 septembre 2026 ; ce qui a changé, pour quels plans
- [Certification Claude AI](${SITE_URL}/certification-claude-ai): ce qui existe (cours gratuits d'Anthropic en anglais, examens officiels réservés aux partenaires), ce qui n'existe pas (titre d'État sur un outil), et ce qu'un recruteur regarde à la place
- [Formation IA obligatoire (AI Act art. 4)](${SITE_URL}/formation-ia-obligatoire-ai-act): ce qu'impose le règlement européen aux employeurs depuis le 2 février 2025
- [Catalogue des parcours](${SITE_URL}/courses)
- [Tarifs](${SITE_URL}/tarifs): les formules et ce qu'elles contiennent
- [Bibliothèque de prompts](${SITE_URL}/prompts): ${PROMPT_COUNT} prompts en français, classés par métier
- [Kit de démarrage gratuit](${SITE_URL}/kit): 15 prompts, sans achat
- [FAQ](${SITE_URL}/faq): Claude gratuit ou payant, Claude vs ChatGPT, accès, remboursement
- [À propos](${SITE_URL}/a-propos): qui édite la formation
- [Contact](${SITE_URL}/contact): contact@claudeai-academy.com
- [CGV](${SITE_URL}/cgv) · [Confidentialité](${SITE_URL}/confidentialite) · [Mentions légales](${SITE_URL}/mentions-legales)
- [Version détaillée de cet index](${SITE_URL}/llms-full.txt): leçons de chaque parcours, prompts gratuits, FAQ, mentions légales

## Citation

Nom exact : ClaudeAI Academy. Site : ${SITE_URL}
Langue du contenu : français. Zone servie : France, Belgique, Suisse, Luxembourg, Canada.
Contenu des leçons vérifié au ${CONTENU_A_JOUR_AU}.
Index généré le ${new Date().toISOString().slice(0, 10)}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      // Court, mais suffisant pour absorber les rafales de crawl IA ; jamais
      // au-delà du 01/11/2026 à 0 h tant que le prix Mastery doit changer.
      "Cache-Control": cacheControl(at),
    },
  });
}
