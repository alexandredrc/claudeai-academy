// =========================================
// ClaudeAI Academy — Seed contenu
// Usage : node --env-file=.env.local scripts/seed-content.mjs
// Idempotent : ré-exécutable, upsert sur slug.
//
// Parcours 01 : contenu RÉEL, sourcé Tier 1 (doc officielle Anthropic
//   « Prompting best practices », vérifiée 2026-05-15). À jour Opus 4.8 :
//   adaptive thinking, effort parameter, prefill retiré, littéralisme 4.8.
// Parcours 02-05 : stubs (placeholder, à produire ensuite).
// =========================================

import { createClient } from "@supabase/supabase-js";
import { tradingClaudeCode } from "./content/trading-claude-code.mjs";
import { githubPromptsSecurite } from "./content/github-prompts-securite.mjs";
import { claudeCodeIaAgentic } from "./content/claude-code.mjs";
import { strategieConduiteIa } from "./content/strategie-ia.mjs";
import { contenuEtMarketing } from "./content/marketing-contenu.mjs";
import { claudeDataSql } from "./content/data-sql.mjs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } },
);

const SOURCE_FOOTER = `

---

**Sources** · Doc officielle Anthropic, *Prompting best practices* (Tier 1, vérifiée 2026-05-15) : \`platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices\`. Tutoriel interactif : \`github.com/anthropics/prompt-eng-interactive-tutorial\`. Contenu valable pour Claude Fable 5 / Opus 4.8 / Sonnet 4.6 / Haiku 4.5.`;

const COURSES = [
  {
    slug: "prompt-engineering-pro",
    title: "Prompt Engineering pro",
    description:
      "Les techniques officielles Anthropic, traduites en méthode opérationnelle : clarté, contexte, exemples, balises XML, raisonnement, chaînage. À jour Claude Opus 4.8 et Fable 5.",
    tier_required: "starter",
    display_order: 1,
    estimated_duration_min: 210,
    lessons: [
      {
        slug: "intro-pourquoi-le-prompt-est-de-l-ingenierie",
        title: "Pourquoi le prompt est de l'ingénierie, pas de l'art",
        description:
          "Le cadrage qui change tout : critères de succès, évaluation, et la règle d'or d'Anthropic.",
        duration_min: 14,
        is_free_preview: true,
        content_md: `## Le malentendu de départ

Le « prompt engineering » est souvent vendu comme un don, une intuition magique. C'est faux, et ça coûte cher : tant que vous croyez que prompter est de l'art, vous ne mesurez pas, vous ne reproduisez pas, vous ne corrigez pas.

La doc officielle d'Anthropic est explicite sur un point que la plupart des gens sautent : **avant même d'optimiser un prompt, il faut trois choses.**

> *« This guide assumes that you have: 1. A clear definition of the success criteria for your use case. 2. Some ways to empirically test against those criteria. 3. A first draft prompt you want to improve. »*

Traduction opérationnelle :

1. **Un critère de succès défini.** Pas « une bonne réponse ». Quelque chose de testable : « extrait les 5 risques, format JSON, zéro champ inventé ».
2. **Un moyen de tester contre ce critère.** Même artisanal : 5 entrées types, le résultat attendu pour chacune.
3. **Un premier jet de prompt** à améliorer, pas une page blanche.

Si vous n'avez pas 1 et 2, vous ne faites pas de prompt engineering. Vous tâtonnez.

## La règle d'or d'Anthropic

C'est la phrase la plus utile de toute la doc, et elle tient en une ligne :

> *« Show your prompt to a colleague with minimal context on the task and ask them to follow it. If they'd be confused, Claude will be too. »*

Le bon modèle mental, toujours selon Anthropic : traitez Claude comme **« un collègue brillant mais nouveau, qui n'a aucun contexte sur vos normes et vos process »**. Il est compétent. Il ne lit pas dans vos pensées.

## Ce que ce parcours couvre

On suit l'ordre de priorité de la doc officielle, traduit en méthode :

1. Être clair et direct
2. Donner le contexte et le pourquoi
3. Piloter par l'exemple (few-shot)
4. Structurer avec des balises XML (et le contexte long)
5. Donner un rôle
6. Faire raisonner Claude (thinking, effort, auto-vérification)
7. Chaîner et auto-corriger

Chaque leçon : la technique officielle, un prompt opérationnel, un anti-pattern observé, un exercice sur votre propre travail.

## Une note de fraîcheur importante

Ce parcours est à jour pour **Claude Opus 4.8** et s'applique aussi à **Claude Fable 5**, le nouveau modèle le plus puissant d'Anthropic (sorti le 9 juin 2026, un cran au-dessus d'Opus — mêmes règles de prompting : suivi littéral des instructions, prefill interdit, adaptive thinking). Deux changements récents que beaucoup de contenus en ligne ratent encore :

- Le **prefill** de la dernière réponse assistant n'est plus supporté depuis Claude 4.6 (renvoie une erreur 400). On verra par quoi le remplacer.
- Opus 4.8 suit les instructions **plus littéralement** : il ne généralise plus une consigne d'un cas à l'autre tout seul. C'est une force si vous savez en tenir compte, un piège sinon.

C'est exactement pour ça que ce parcours est tenu à jour : ce qui était vrai il y a six mois ne l'est déjà plus.${SOURCE_FOOTER}`,
      },
      {
        slug: "etre-clair-et-direct",
        title: "Être clair et direct",
        description:
          "La technique n°1 de la doc officielle. Spécificité, étapes séquencées, et le test du collègue.",
        duration_min: 16,
        is_free_preview: false,
        content_md: `## La technique que tout le monde croit maîtriser

« Sois clair » : tout le monde acquiesce, personne ne le fait vraiment. La doc Anthropic la place en **premier des principes généraux**, avant tout le reste. Ce n'est pas un hasard : c'est le levier au meilleur rapport effort/impact.

> *« Claude responds well to clear, explicit instructions. If you want "above and beyond" behavior, explicitly request it rather than relying on the model to infer this from vague prompts. »*

Point clé souvent raté : **si vous voulez un résultat qui dépasse le minimum, demandez-le explicitement.** Le modèle ne va pas deviner que vous vouliez « le travail complet » à partir d'un prompt vague.

## L'exemple officiel, et ce qu'il enseigne

Anthropic donne cet exemple exact :

**Moins efficace :**
\`\`\`
Create an analytics dashboard
\`\`\`

**Plus efficace :**
\`\`\`
Create an analytics dashboard. Include as many relevant features and
interactions as possible. Go beyond the basics to create a fully-featured
implementation.
\`\`\`

La différence n'est pas la longueur. C'est que le second prompt **spécifie le niveau d'ambition**. Sans ça, Claude livre le minimum viable, parce que c'est le comportement par défaut le plus sûr.

## Deux règles concrètes

La doc en retient deux, applicables immédiatement :

1. **Soyez spécifique sur le format de sortie et les contraintes.** Pas « résume ». Plutôt : « résumé en 5 puces, chacune ≤ 15 mots, sans jargon ».
2. **Donnez les instructions en étapes numérotées** quand l'ordre ou l'exhaustivité comptent. Une liste ordonnée bat un paragraphe d'instructions noyées.

## Le test du collègue, en pratique

Avant d'envoyer un prompt que vous allez réutiliser, faites littéralement ceci : copiez-le, envoyez-le à un collègue qui ne connaît pas la tâche, demandez-lui de l'exécuter à la lettre. Là où il vous pose une question, Claude se trompera silencieusement. Bouchez ce trou. Renvoyez.

## Anti-pattern

Empiler les précisions au fil de l'eau (« ah et aussi… », « n'oublie pas… ») au lieu de spécifier dès le départ. Avec Opus 4.8 qui interprète plus littéralement, une consigne ajoutée en passant et mal située sera appliquée littéralement ou ignorée, pas « comprise dans l'esprit ».

## Exercice

Prenez le prompt que vous avez réutilisé le plus souvent ces 7 derniers jours. Réécrivez-le avec : (a) le format de sortie explicite, (b) le niveau d'ambition explicite, (c) les étapes numérotées si l'ordre compte. Comparez les sorties sur 3 entrées différentes. Notez ce qui change.${SOURCE_FOOTER}`,
      },
      {
        slug: "le-contexte-et-le-pourquoi",
        title: "Donner le contexte et le pourquoi",
        description:
          "Pourquoi expliquer la raison d'une consigne la rend plus fiable. L'exemple officiel des points de suspension.",
        duration_min: 13,
        is_free_preview: false,
        content_md: `## L'erreur du « fais X, point »

Donner une consigne sèche fonctionne mal quand le cas est ambigu. La doc Anthropic est nette :

> *« Providing context or motivation behind your instructions, such as explaining why such behavior is important, can help Claude better understand your goals and deliver more targeted responses. Claude is smart enough to generalize from the explanation. »*

Le modèle n'exécute pas seulement, il **généralise à partir du pourquoi**. Si vous donnez la raison, il gère correctement les cas que vous n'avez pas explicitement prévus.

## L'exemple officiel

Anthropic donne celui-ci, et il est parfait parce qu'il est contre-intuitif :

**Moins efficace :**
\`\`\`
NEVER use ellipses
\`\`\`

**Plus efficace :**
\`\`\`
Your response will be read aloud by a text-to-speech engine, so never use
ellipses since the text-to-speech engine will not know how to pronounce them.
\`\`\`

Avec la première version, Claude évite les « … » mais peut produire d'autres glyphes problématiques pour un moteur vocal. Avec la seconde, il a compris **l'objectif réel** (un texte qui se prononce bien) et gère toute la classe de problèmes, pas juste le symptôme cité.

## La règle à retenir

Pour toute contrainte non triviale, ajoutez une demi-phrase de raison. Pas un paragraphe. Juste « parce que X », pour que le modèle généralise dans la bonne direction.

\`\`\`
Réponds en moins de 120 mots, parce que ce texte s'affiche dans une
notification mobile tronquée au-delà.
\`\`\`

## Anti-pattern

Le pourquoi décoratif : « c'est important, fais bien attention ». Ça n'apporte aucune information de généralisation. Le pourquoi utile décrit la **contrainte réelle du monde** (où le texte va vivre, qui le lit, ce qui casse sinon).

## Exercice

Reprenez vos 3 contraintes les plus fréquentes (longueur, ton, format). Pour chacune, écrivez la contrainte réelle du monde derrière. Réinjectez ce « parce que » dans le prompt. Testez sur un cas limite que vous n'aviez pas explicitement couvert : voyez si le modèle gère mieux.${SOURCE_FOOTER}`,
      },
      {
        slug: "piloter-par-l-exemple-few-shot",
        title: "Piloter par l'exemple (few-shot)",
        description:
          "Le levier le plus fiable pour le format et le ton. Combien d'exemples, lesquels, et comment les baliser.",
        duration_min: 17,
        is_free_preview: false,
        content_md: `## Pourquoi l'exemple bat l'instruction

Pour le format, le ton et la structure, un exemple vaut trente lignes de consignes. La doc officielle :

> *« Examples are one of the most reliable ways to steer Claude's output format, tone, and structure. A few well-crafted examples (known as few-shot or multishot prompting) can dramatically improve accuracy and consistency. »*

## Les 3 critères d'un bon exemple (officiels)

Anthropic liste exactement trois propriétés :

- **Pertinent** : l'exemple colle à votre vrai cas d'usage, pas un cas d'école.
- **Diversifié** : il couvre les cas limites et varie assez pour que Claude n'attrape pas un motif involontaire (si tous vos exemples commencent par « Bonjour », il croira que c'est une règle).
- **Structuré** : enveloppez chaque exemple dans une balise \`<example>\` (plusieurs dans \`<examples>\`) pour que Claude les distingue des instructions.

Quantité recommandée par la doc : **3 à 5 exemples**. En dessous, peu d'effet. Astuce officielle : vous pouvez demander à Claude d'évaluer la pertinence et la diversité de vos exemples, ou d'en générer d'autres à partir des vôtres.

## Gabarit opérationnel

\`\`\`xml
<instructions>
Classe le ticket support en : bug, feature_request, question, autre.
Réponds uniquement par le label.
</instructions>

<examples>
  <example>
    <input>L'app crash quand je clique sur Exporter</input>
    <output>bug</output>
  </example>
  <example>
    <input>Ce serait bien d'avoir un mode sombre</input>
    <output>feature_request</output>
  </example>
  <example>
    <input>Comment je change mon mot de passe ?</input>
    <output>question</output>
  </example>
  <example>
    <input>Merci pour le support, rien à signaler</input>
    <output>autre</output>
  </example>
</examples>
\`\`\`

Notez la diversité : un cas par classe, formulations variées. C'est ça qui empêche Claude d'apprendre un faux motif.

## Anti-pattern

Trois exemples qui se ressemblent tous (même longueur, même structure, même classe). Claude apprend la ressemblance, pas la règle. Un seul exemple bien choisi par classe, varié, bat cinq exemples clones.

## Exercice

Sur une tâche de classification ou de reformatage que vous faites souvent : écrivez 4 exemples, un par cas, formulations volontairement différentes. Baliser en \`<examples>\`. Comparez la consistance des sorties avec et sans les exemples, sur 5 entrées nouvelles.${SOURCE_FOOTER}`,
      },
      {
        slug: "structurer-avec-xml-et-contexte-long",
        title: "Structurer avec des balises XML (et le contexte long)",
        description:
          "Pourquoi le XML désambiguïse, et les 3 règles officielles du prompt en contexte long (+30 % de qualité).",
        duration_min: 18,
        is_free_preview: false,
        content_md: `## Pourquoi des balises XML

Quand un prompt mélange instructions, contexte, exemples et données variables, le modèle peut confondre les rôles. La doc :

> *« XML tags help Claude parse complex prompts unambiguously. Wrapping each type of content in its own tag (e.g. \`<instructions>\`, \`<context>\`, \`<input>\`) reduces misinterpretation. »*

Deux bonnes pratiques officielles :

- **Noms de balises cohérents et descriptifs** d'un prompt à l'autre.
- **Imbrication** quand le contenu a une hiérarchie naturelle (des documents dans \`<documents>\`, chacun dans \`<document index="n">\`).

## Le contexte long : 3 règles qui changent tout

Dès que vous travaillez avec de gros documents (20k+ tokens), la doc donne trois règles précises :

1. **Données longues en haut.** Placez les longs documents au-dessus de la requête, des instructions et des exemples. La doc est chiffrée là-dessus :

> *« Queries at the end can improve response quality by up to 30% in tests, especially with complex, multi-document inputs. »*

Mettre votre question **à la fin**, après les données : jusqu'à +30 % de qualité. C'est gratuit, la plupart des gens font l'inverse.

2. **Structurez chaque document avec des balises** \`<document>\` contenant \`<source>\` et \`<document_content>\`.

3. **Ancrez la réponse dans des citations.** Pour une tâche sur long document, demandez à Claude d'extraire d'abord les passages pertinents entre balises \`<quotes>\`, puis de répondre à partir de ces citations. Ça lui fait traverser le bruit du reste.

## Gabarit contexte long

\`\`\`xml
<documents>
  <document index="1">
    <source>rapport_annuel_2025.pdf</source>
    <document_content>{{RAPPORT}}</document_content>
  </document>
</documents>

Trouve d'abord les passages pertinents et place-les dans <quotes>.
Ensuite, à partir uniquement de ces citations, liste les 3 risques
financiers majeurs dans <analyse>.
\`\`\`

La question est **après** les données. L'extraction de citations est demandée **avant** l'analyse.

## Anti-pattern

Coller un document de 30 pages, puis la question en haut « résume ça : [30 pages] ». Vous perdez les deux leviers : la question est avant les données, et rien n'ancre la réponse dans le texte. Résultat : réponse vague qui survole.

## Exercice

Prenez une tâche réelle sur un document long que vous faites à la main. Reconstruisez le prompt : document balisé en haut, demande de citations d'abord, question à la fin. Comparez la précision factuelle avec votre ancienne version.${SOURCE_FOOTER}`,
      },
      {
        slug: "donner-un-role-et-controler-la-sortie",
        title: "Donner un rôle et contrôler la sortie",
        description:
          "Le rôle en system prompt, et la règle d'or du formatage : dire quoi faire, pas quoi ne pas faire.",
        duration_min: 15,
        is_free_preview: false,
        content_md: `## Le rôle : une phrase qui oriente tout

Définir un rôle dans le **system prompt** focalise le comportement et le ton. La doc est claire : même une seule phrase fait une différence.

\`\`\`python
client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    system="You are a helpful coding assistant specializing in Python.",
    messages=[{"role": "user", "content": "How do I sort a list of dicts by key?"}],
)
\`\`\`

Le rôle va dans \`system\`, pas dans le message user. Et il doit être **précis** : « analyste financier senior, SaaS B2B européen » oriente ; « assistant utile » n'oriente rien.

## La règle d'or du formatage

C'est l'une des plus rentables et l'une des plus contre-intuitives. La doc :

> *« Tell Claude what to do instead of what not to do. Instead of: "Do not use markdown" — Try: "Your response should be composed of smoothly flowing prose paragraphs." »*

Le négatif (« ne fais pas X ») laisse le champ ouvert. Le positif (« fais Y ») ferme la cible. Trois leviers officiels pour le format :

1. **Formuler en positif** ce que vous voulez.
2. **Indiquer le format via des balises XML** : « écris les sections en prose dans des balises \`<prose>\` ».
3. **Faire matcher le style du prompt à la sortie voulue.** Si vous voulez peu de markdown en sortie, retirez le markdown de votre prompt. Le style du prompt déteint sur la réponse.

## Le changement Opus 4.8 à connaître

Le **prefill** de la dernière réponse assistant (forcer le début de la réponse de Claude) **n'est plus supporté depuis Claude 4.6** : requête en erreur 400. Avant, on s'en servait pour forcer un JSON ou supprimer un préambule.

Remplacements officiels :
- Pour forcer un schéma : la feature **Structured Outputs**, ou simplement demander le schéma (les modèles récents le respectent fiablement).
- Pour supprimer le préambule « Voici… » : instruction system explicite « Réponds directement, sans préambule, sans phrases comme "Voici…" ou "D'après…" ».

## Anti-pattern

Empiler les interdits : « pas de markdown, pas de listes, pas de gras, pas de titres ». Le modèle navigue dans un champ de mines négatif. Une seule phrase positive (« prose continue en paragraphes pleins ») fait mieux et plus court.

## Exercice

Prenez un prompt où vous avez accumulé des « ne fais pas ». Réécrivez chaque interdit en une consigne positive équivalente. Mettez le rôle en system prompt s'il était noyé dans le user. Mesurez la conformité de format sur 5 sorties.${SOURCE_FOOTER}`,
      },
      {
        slug: "faire-raisonner-chainer-auto-corriger",
        title: "Faire raisonner, chaîner, auto-corriger",
        description:
          "Adaptive thinking et effort sur Opus 4.8, l'auto-vérification, et le pattern de chaînage qui rattrape les erreurs.",
        duration_min: 19,
        is_free_preview: false,
        content_md: `## Le raisonnement a changé de mécanique

Si vous avez appris le prompt engineering il y a un an, cette partie a changé. Les modèles récents utilisent l'**adaptive thinking** : le modèle décide lui-même quand et combien réfléchir. Détail que beaucoup de contenus ratent : sur **Opus 4.8 et Sonnet 4.6**, ce mode est **opt-in** — si le paramètre \`thinking\` n'est pas explicitement réglé sur \`adaptive\` (dans l'API ou l'outil que vous utilisez), le modèle répond sans phase de réflexion. Sur **Claude Fable 5** (sorti le 9 juin 2026), c'est l'inverse : l'adaptive thinking est **toujours actif** et ne peut pas être désactivé. Une fois actif, le modèle calibre sa réflexion sur deux choses :

- le paramètre **effort** (\`low\` → \`medium\` → \`high\` → \`xhigh\` → \`max\`)
- la complexité de la requête

La doc est explicite : l'ancien \`budget_tokens\` (extended thinking) est **déprécié**. Le bon levier aujourd'hui, c'est **effort**.

> Recommandations officielles : \`xhigh\` pour le code et l'agentique ; minimum \`high\` pour tout ce qui est sensible à l'intelligence ; \`low\`/\`medium\` pour la latence et le coût quand la tâche n'est pas exigeante.

Conséquence pratique : si Claude raisonne trop superficiellement sur un problème dur, **montez l'effort** avant de bricoler le prompt. Inversement, s'il sur-réfléchit sur du simple, baissez-le.

## Le détail qui piège : le mot « think »

Quand le thinking est désactivé, la doc note que Claude Opus 4.5 est **particulièrement sensible au mot « think »** et ses variantes. Anthropic recommande alors « consider », « evaluate », « reason through » à la place. À connaître si vous écrivez des prompts en anglais sans thinking actif.

## L'auto-vérification : presque gratuit, très rentable

La technique la plus sous-utilisée. La doc :

> *« Ask Claude to self-check. Append something like "Before you finish, verify your answer against [test criteria]." This catches errors reliably, especially for coding and math. »*

Une phrase ajoutée en fin de prompt :

\`\`\`
Avant de conclure, vérifie ta réponse contre ces critères :
chaque chiffre est sourcé du document, aucun total ne dépasse la somme
des sous-totaux, le format est bien du JSON valide.
\`\`\`

## Le chaînage : le pattern auto-correction

Avec l'adaptive thinking, Claude gère la plupart du multi-étapes en interne. Le chaînage explicite (découper en appels API séparés) reste utile quand vous voulez **inspecter l'intermédiaire** ou imposer un pipeline. Le pattern le plus courant selon la doc :

> *« Generate a draft → have Claude review it against criteria → have Claude refine based on the review. »*

Le modèle est meilleur **juge** qu'**auteur**. Faire relire sa propre production par un second appel rattrape une grande partie des erreurs, sur les rédactions et analyses à enjeu.

## Anti-pattern

Écrire un plan étape par étape ultra-prescriptif à la place de laisser le modèle raisonner. La doc : *« A prompt like "think thoroughly" often produces better reasoning than a hand-written step-by-step plan. Claude's reasoning frequently exceeds what a human would prescribe. »* Sur-scripter le raisonnement le dégrade souvent.

## Exercice

Sur une tâche à enjeu (analyse, rédaction importante) : (1) ajoutez une clause d'auto-vérification en fin de prompt avec 3 critères concrets ; (2) si vous avez accès à l'API, faites un second appel « relis cette sortie contre ces critères, liste les écarts, corrige ». Comparez à votre passe unique.${SOURCE_FOOTER}`,
      },
    ],
  },
  claudeCodeIaAgentic,
  claudeDataSql,
  contenuEtMarketing,
  strategieConduiteIa,
  tradingClaudeCode,
  githubPromptsSecurite,
];

async function seed() {
  let coursesUpserted = 0;
  let lessonsUpserted = 0;

  for (const c of COURSES) {
    const { lessons, ...courseInput } = c;
    const totalLessons = lessons.length;

    const { data: course, error: courseErr } = await supabase
      .from("courses")
      .upsert(
        { ...courseInput, total_lessons: totalLessons },
        { onConflict: "slug" },
      )
      .select()
      .single();

    if (courseErr || !course) {
      console.error(`✗ Course "${courseInput.slug}":`, courseErr?.message);
      process.exit(1);
    }
    coursesUpserted++;
    console.log(`✓ Course ${course.display_order}: ${course.title}`);

    for (const [i, lesson] of lessons.entries()) {
      const { error: lessonErr } = await supabase
        .from("lessons")
        .upsert(
          {
            course_id: course.id,
            slug: lesson.slug,
            title: lesson.title,
            description: lesson.description,
            content_md: lesson.content_md,
            display_order: i + 1,
            duration_min: lesson.duration_min,
            is_free_preview: lesson.is_free_preview,
          },
          { onConflict: "course_id,slug" },
        );

      if (lessonErr) {
        console.error(`  ✗ Lesson "${lesson.slug}":`, lessonErr.message);
        process.exit(1);
      }
      lessonsUpserted++;
      console.log(
        `  ✓ Lesson ${i + 1}: ${lesson.title}${lesson.is_free_preview ? " [free preview]" : ""}`,
      );
    }

    // Seed déclaratif : supprime les leçons de ce cours absentes du seed
    // (sinon les anciens slugs restent orphelins en DB).
    const keepSlugs = lessons.map((l) => l.slug);
    const { data: removed, error: delErr } = await supabase
      .from("lessons")
      .delete()
      .eq("course_id", course.id)
      .not("slug", "in", `(${keepSlugs.join(",")})`)
      .select("slug");
    if (delErr) {
      console.error(`  ✗ cleanup "${course.slug}":`, delErr.message);
      process.exit(1);
    }
    for (const r of removed ?? []) {
      console.log(`  – Lesson supprimée (obsolète) : ${r.slug}`);
    }
  }

  console.log(
    `\n→ ${coursesUpserted} cours + ${lessonsUpserted} leçons seedés.`,
  );
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
