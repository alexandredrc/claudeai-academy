import type { Metadata } from "next";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import { Button } from "@/components/site/button";

export const metadata: Metadata = {
  title: "Le Kit — 15 prompts Claude prêts à l'emploi",
  description:
    "15 prompts Claude opérationnels, classés par métier, pour gagner du temps dès aujourd'hui.",
  robots: { index: false, follow: false },
};

type Prompt = { title: string; body: string };
type Group = { label: string; intro?: string; prompts: Prompt[] };

const GROUPS: Group[] = [
  {
    label: "Pour tout le monde",
    prompts: [
      {
        title: "Le résumé qui garde l'essentiel",
        body: `Tu es mon assistant de synthèse. Voici un document : [colle le texte].
Donne-moi :
1. Les 3 idées principales en une phrase chacune.
2. Les décisions ou actions concrètes qui en découlent.
3. Une question que ce document laisse sans réponse.
Pas de paraphrase, va à l'essentiel.`,
      },
      {
        title: "L'email difficile, écrit pour toi",
        body: `Aide-moi à écrire un email à [destinataire et son rôle].
Contexte : [la situation délicate].
Objectif : [ce que je veux obtenir].
Ton : professionnel, direct, sans agressivité ni excuses excessives.
Donne-moi 2 versions : une courte, une plus diplomate.`,
      },
      {
        title: "Le brouillon transformé en clair",
        body: `Réécris ce texte pour qu'il soit clair, concis et professionnel,
sans en changer le sens ni le rendre générique.
Garde mon ton. Supprime le superflu. Voici le texte : [colle].`,
      },
      {
        title: "La décision passée au crible",
        body: `J'hésite entre [option A] et [option B] pour [contexte].
Joue l'avocat du diable des deux côtés.
Donne-moi : les risques cachés de chaque option, la question
décisive à me poser, et ta recommandation argumentée.`,
      },
    ],
  },
  {
    label: "Pour les développeurs",
    prompts: [
      {
        title: "Le code expliqué ligne par ligne",
        body: `Tu es un développeur senior qui fait une revue de code pédagogique.
Explique ce que fait ce code, repère les bugs ou cas limites non gérés,
et propose une version améliorée commentée. Langage : [langage].
Code : [colle].`,
      },
      {
        title: "Le bug traqué méthodiquement",
        body: `J'ai cette erreur : [message d'erreur complet].
Voici le code concerné : [colle].
Voici ce que j'ai déjà essayé : [tes tentatives].
Propose 3 hypothèses de cause classées par probabilité,
et pour chacune comment la vérifier rapidement.`,
      },
      {
        title: "Les tests que tu n'écris jamais",
        body: `Écris une suite de tests pour cette fonction.
Couvre : cas nominal, cas limites, entrées invalides, et un cas
auquel un développeur penserait rarement. Framework : [ex. Jest, pytest].
Fonction : [colle].`,
      },
      {
        title: "La doc qui se rédige toute seule",
        body: `Génère la documentation de cette fonction/module :
description, paramètres, valeur de retour, exemple d'usage, et pièges
à éviter. Style : concis, pour un développeur pressé. Code : [colle].`,
      },
    ],
  },
  {
    label: "Pour les data analysts",
    prompts: [
      {
        title: "La requête SQL en langage humain",
        body: `Tu es un expert SQL. Ma base contient ces tables : [décris colonnes].
Je veux obtenir : [ce que tu cherches en français].
Écris la requête optimisée, explique la logique en 2 lignes,
et signale si un index manque pour la performance.`,
      },
      {
        title: "L'analyse qui trouve l'histoire dans les chiffres",
        body: `Voici un jeu de données : [colle ou décris].
Agis comme un analyste senior. Donne-moi : les 3 tendances notables,
une anomalie qui mérite investigation, et la visualisation la plus
parlante à produire (et pourquoi).`,
      },
      {
        title: "Le tableau Excel/Sheets démêlé",
        body: `J'ai un tableau avec ces colonnes : [liste].
Je veux [objectif : tableau croisé, formule, nettoyage...].
Donne-moi la formule exacte (Excel et Google Sheets),
et explique-la pour que je puisse l'adapter seul la prochaine fois.`,
      },
    ],
  },
  {
    label: "Pour les marketers et créateurs",
    prompts: [
      {
        title: "Le contenu qui ne sent pas l'IA",
        body: `Écris [type de contenu] sur [sujet] pour [audience précise].
Contraintes : ton [adjectif], phrases courtes, exemples concrets,
zéro formule creuse ("dans un monde où", "il est important de noter").
Donne-moi 3 angles différents avant de rédiger, je choisirai.`,
      },
      {
        title: "Le calendrier éditorial d'un mois en 30 secondes",
        body: `Génère 4 semaines de contenu pour [plateforme] sur le thème [thème].
Pour chaque post : l'accroche, l'idée centrale, le format
(carrousel, texte, vidéo), et l'appel à l'action.
Varie les angles : pédagogique, contre-intuitif, coulisses, preuve.`,
      },
      {
        title: "Le repurposing automatique",
        body: `Voici un contenu long : [colle article/script].
Décline-le en : 1 post LinkedIn, 3 idées de Reels, 5 tweets,
et 1 sujet de newsletter. Garde l'idée forte, adapte le ton à chaque format.`,
      },
    ],
  },
  {
    label: "Pour les managers et consultants",
    prompts: [
      {
        title: "Le cadre de décision IA pour ton équipe",
        body: `Tu es consultant en transformation IA. Mon équipe fait [activité].
Identifie les 5 tâches où l'IA générative apporterait le plus de gain,
classe-les par (impact × facilité de mise en œuvre), et pour la n°1
donne-moi un plan de test sur 2 semaines.`,
      },
    ],
  },
];

// Offset de numérotation par groupe (somme des prompts des groupes précédents).
const GROUP_OFFSETS = GROUPS.reduce<number[]>((acc, group, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + GROUPS[i - 1].prompts.length);
  return acc;
}, []);

export default function KitRessourcesPage() {
  return (
    <article className="pt-12 pb-24 md:pt-16 md:pb-32">
      <Container size="narrow">
        <Eyebrow>Le Kit · 15 prompts</Eyebrow>
        <h1 className="mt-4 font-serif text-[clamp(2rem,4.5vw,3.25rem)] font-medium leading-[1.08] tracking-tight text-ink">
          15 prompts Claude prêts à l&apos;emploi
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted">
          Copie, remplace le <code className="font-mono text-[0.9em] text-coral-dark">[texte entre crochets]</code>,
          adapte. Ce sont des squelettes, pas des incantations.
        </p>

        {/* La règle */}
        <div className="mt-10 rounded-[18px] border border-line bg-cream-soft p-6 md:p-8">
          <p className="font-serif text-xl text-ink mb-3">
            La règle qui change tout
          </p>
          <p className="text-[15px] leading-relaxed text-ink-soft mb-4">
            La plupart des gens écrivent à Claude comme dans une barre de
            recherche. Les pros donnent trois choses que l&apos;amateur oublie :
          </p>
          <ol className="flex flex-col gap-2 text-[15px] leading-relaxed text-ink-soft list-decimal pl-5">
            <li><strong className="text-ink">Un rôle</strong> — « Tu es un analyste data senior », pas « explique-moi ».</li>
            <li><strong className="text-ink">Du contexte</strong> — ce que tu sais déjà, ta contrainte, ton objectif réel.</li>
            <li><strong className="text-ink">Un format de sortie</strong> — tableau, étapes numérotées, 3 options classées.</li>
          </ol>
        </div>

        {GROUPS.map((group, gi) => (
          <section key={group.label} className="mt-14">
            <h2 className="font-serif text-2xl font-medium text-ink mb-6">
              {group.label}
            </h2>
            <div className="flex flex-col gap-6">
              {group.prompts.map((prompt, pi) => {
                const num = GROUP_OFFSETS[gi] + pi + 1;
                return (
                  <div key={prompt.title}>
                    <p className="text-[15px] font-semibold text-ink mb-2">
                      <span className="text-coral-dark font-mono text-[13px] mr-2">
                        {String(num).padStart(2, "0")}
                      </span>
                      {prompt.title}
                    </p>
                    <pre className="overflow-x-auto rounded-[12px] border border-line bg-white p-4 font-mono text-[13.5px] leading-relaxed text-ink-soft whitespace-pre-wrap">
                      {prompt.body}
                    </pre>
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        {/* Upsell sobre */}
        <div className="mt-16 rounded-[18px] border border-line bg-ink p-8 md:p-10 text-cream">
          <p className="font-serif text-2xl font-medium mb-3">
            Et maintenant ?
          </p>
          <p className="text-[15px] leading-relaxed text-cream/80 mb-6 max-w-[560px]">
            Un prompt isolé, c&apos;est 20 % du potentiel. Les vrais gains
            arrivent quand tu enchaînes Claude dans tes workflows : bibliothèques
            de prompts, Claude Code dans ta stack, automatisations. C&apos;est
            exactement ce que couvre ClaudeAI Academy — 7 parcours, 170 prompts,
            mentor IA, accès à vie, garantie 14 jours.
          </p>
          <Button href="/tarifs" variant="ghost-light" size="lg">
            Découvrir les formations
          </Button>
        </div>
      </Container>
    </article>
  );
}
