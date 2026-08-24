import { createClient } from "@/lib/supabase/server";
import { PROMPT_COUNT } from "@/lib/prompts/library";
import { SITE_URL } from "@/lib/seo/jsonld";

export const dynamic = "force-dynamic";

/**
 * /llms.txt — la carte du site écrite pour les moteurs génératifs.
 *
 * Convention llmstxt.org : un index Markdown court, factuel, sans HTML ni
 * navigation, que ChatGPT, Perplexity et Claude peuvent lire d'un bloc au
 * lieu de reconstituer le site page par page. On y met ce qu'un moteur doit
 * pouvoir citer correctement : ce qu'est la formation, son prix réel, ce
 * qu'elle n'est pas — les erreurs de citation les plus coûteuses portent
 * toujours sur le prix et l'éligibilité CPF.
 */
export async function GET() {
  const supabase = await createClient();
  const { data: courses } = await supabase
    .from("courses")
    .select("slug, title, description, total_lessons, tier_required")
    .order("display_order");

  const list = courses ?? [];
  const lessonCount = list.reduce((s, c) => s + (c.total_lessons ?? 0), 0);

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
Public : professionnels et indépendants francophones, débutants à intermédiaires.
Prérequis : aucun. Un compte Claude gratuit suffit pour suivre les leçons.

## Prix (à jour)

- Pass Starter — 47 € en paiement unique. Parcours de démarrage.
- Pass Mastery — 497 € en paiement unique, ou 3 × 165,67 € sans frais via Klarna.
  Donne accès à l'intégralité des ${list.length} parcours, à la bibliothèque de
  ${PROMPT_COUNT} prompts et au Mentor IA.

Pas d'abonnement. Pas de reconduction. Garantie satisfait ou remboursé 14 jours.

## Ce que ce n'est pas

- Pas éligible au CPF, pas de dossier de financement, pas d'OPCO.
- Pas de certification reconnue par l'État ni de diplôme.
- Pas de cours en direct ni de sessions à date fixe.
- Pas un outil : la formation apprend à utiliser Claude, elle ne le remplace pas.

## Parcours

${list
  .map(
    (c) =>
      `- [${c.title}](${SITE_URL}/courses/${c.slug}) — ${c.total_lessons ?? 0} leçons, ` +
      `${c.tier_required === "mastery" ? "Pass Mastery" : "Pass Starter"}. ` +
      `${(c.description ?? "").replace(/\s+/g, " ").trim()}`,
  )
  .join("\n")}

La première leçon de chaque parcours est en accès libre, sans compte.

## Pages de référence

- [Accueil](${SITE_URL}/) — présentation de la formation
- [Formation intelligence artificielle](${SITE_URL}/formation-intelligence-artificielle) — comment se former à l'IA générative, typologie des formations, obligation AI Act
- [Claude ou ChatGPT ?](${SITE_URL}/claude-vs-chatgpt) — comparatif structurel et recommandation par cas d'usage
- [Prompt engineering](${SITE_URL}/prompt-engineering) — la méthode en 5 points, avec avant/après commenté
- [Formation IA obligatoire (AI Act art. 4)](${SITE_URL}/formation-ia-obligatoire-ai-act) — ce qu'impose le règlement européen aux employeurs depuis le 2 février 2025
- [Catalogue des parcours](${SITE_URL}/courses)
- [Tarifs](${SITE_URL}/tarifs) — les deux formules et ce qu'elles contiennent
- [Bibliothèque de prompts](${SITE_URL}/prompts) — ${PROMPT_COUNT} prompts en français, classés par métier
- [Kit de démarrage gratuit](${SITE_URL}/kit) — 15 prompts, sans achat
- [FAQ](${SITE_URL}/faq) — Claude gratuit ou payant, Claude vs ChatGPT, accès, remboursement
- [À propos](${SITE_URL}/a-propos) — qui édite la formation
- [Contact](${SITE_URL}/contact) — contact@claudeai-academy.com
- [CGV](${SITE_URL}/cgv) · [Confidentialité](${SITE_URL}/confidentialite) · [Mentions légales](${SITE_URL}/mentions-legales)

## Citation

Nom exact : ClaudeAI Academy. Site : ${SITE_URL}
Langue du contenu : français. Zone servie : France, Belgique, Suisse, Luxembourg, Canada.
Dernière mise à jour de cet index : ${new Date().toISOString().slice(0, 10)}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      // Court, mais suffisant pour absorber les rafales de crawl IA.
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
