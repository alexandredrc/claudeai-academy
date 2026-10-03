import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import { Button } from "@/components/site/button";
import { SITE_URL, ORG_ID, breadcrumbJsonLd, jsonLdScript } from "@/lib/seo/jsonld";

// Satellite du pilier /formation-intelligence-artificielle, côté Claude Code.
// Requêtes visées : « claude code skills », « skill claude code »,
// « claude code plugins », « claude code mods », « créer un skill claude code ».
// Google Trends FR, 12 mois au 02/10/2026 : « claude code skill » est la
// requête associée à « Claude Code » qui progresse le plus, devant
// « claude code plugins » et « claude cowork ». Personne n'y répond en
// français avec un contenu qui tient seul.
//
// Page-guide : elle montre un SKILL.md complet, dit où le poser, compare les
// cinq briques d'extension et donne la procédure de relecture avant
// installation. Le parcours vend la pratique guidée, pas l'information.

export const metadata: Metadata = {
  title: "Claude Code skills : créer un skill, l'installer, et les plugins",
  description:
    "Un skill Claude Code est un fichier SKILL.md que Claude charge quand c'est pertinent. Le format complet, où le placer, comment l'invoquer, la différence avec un plugin et un mod, et ce qu'il faut lire avant d'installer un skill trouvé sur GitHub.",
  alternates: { canonical: "/claude-code-skills" },
  keywords: [
    "claude code skills",
    "skill claude code",
    "créer un skill claude code",
    "SKILL.md",
    "claude code plugins",
    "claude code mods",
    "claude code slash command",
    "formation claude code",
  ],
  openGraph: {
    title: "Claude Code skills : le guide complet en français",
    description:
      "Le format SKILL.md, où placer un skill, comment l'invoquer, et la différence avec un plugin et un mod. Avec la procédure de relecture avant installation.",
    url: "/claude-code-skills",
    type: "article",
  },
};

const etapes = [
  {
    titre: "Créez le dossier du skill",
    texte:
      "Un skill vit dans un dossier à son nom, qui contient un fichier SKILL.md. Pour un skill propre à un projet : .claude/skills/<nom>/SKILL.md à la racine du dépôt. Pour un skill disponible dans tous vos projets : ~/.claude/skills/<nom>/SKILL.md.",
    exemple: "mkdir -p .claude/skills/revue-diff",
  },
  {
    titre: "Écrivez l'en-tête, et surtout la description",
    texte:
      "Le fichier s'ouvre sur un bloc YAML entre deux lignes ---. Tout y est facultatif, mais la description est ce que Claude lit pour décider d'activer le skill : formulez-la comme une condition d'activation, avec les mots que vous employez réellement dans vos demandes.",
    exemple:
      "---\nname: revue-diff\ndescription: Relire mes modifications non commitées comme un reviewer sévère. À utiliser quand je demande une relecture, une revue ou ce qui a changé.\nallowed-tools: Bash(git diff *) Read Grep\n---",
  },
  {
    titre: "Écrivez la consigne comme un brief à un collègue compétent",
    texte:
      "Le corps du fichier est du Markdown. Il peut injecter du contexte au moment de l'appel avec une commande entre backticks précédée d'un point d'exclamation : le résultat de git diff HEAD arrive dans le skill avant que Claude ne le lise. Le détail volumineux va dans des fichiers voisins que le skill cite.",
    exemple:
      "## Modifications en cours\n!`git diff HEAD`\n\n## Consigne\nRésume ces changements en trois points, puis liste les risques : gestion d'erreur absente, valeurs en dur, tests à mettre à jour.",
  },
  {
    titre: "Invoquez-le, puis corrigez la description jusqu'à ce qu'il se déclenche seul",
    texte:
      "Tapez /revue-diff dans une session, ou posez simplement la question que la description annonce. Si Claude ne charge pas le skill de lui-même, c'est la description qui est en cause, pas le contenu. Des arguments se passent après le nom : $ARGUMENTS capte tout le texte, $0 le premier argument, et un champ arguments du frontmatter permet de les nommer.",
    exemple: "/revue-diff\n/revue-diff issue=123 branch=main",
  },
];

const briques = [
  {
    nom: "Skill",
    quoi: "Un fichier SKILL.md d'instructions",
    change: "Ce que Claude sait et fait",
    ou: "Dans le contexte de Claude",
  },
  {
    nom: "Hook de réglages",
    quoi: "Un script, une requête HTTP ou un prompt déclenché sur un évènement",
    change: "Si un appel d'outil ou un prompt passe, et avec quels arguments",
    ou: "Hors de Claude Code, comme un script",
  },
  {
    nom: "Serveur MCP",
    quoi: "Un processus ou un service qui expose des outils",
    change: "Quels outils Claude possède",
    ou: "Hors de Claude Code",
  },
  {
    nom: "Plugin",
    quoi: "Un dossier qui regroupe skills, agents, hooks et serveurs MCP, avec un manifeste",
    change: "Rien de plus : il installe et distribue le tout d'un coup",
    ou: "Partout où ses composants tournent",
  },
  {
    nom: "Mod",
    quoi: "Des fonctions JavaScript que Claude Code appelle sur ses évènements (depuis le 1er octobre 2026)",
    change: "Appels d'outils, prompts, commandes, et ce que l'interface dessine",
    ou: "À l'intérieur de Claude Code",
  },
];

const faq = [
  {
    q: "Qu'est-ce qu'un skill Claude Code ?",
    a: "Un skill est un fichier SKILL.md, composé d'un en-tête YAML et d'instructions en Markdown, que Claude Code charge quand la demande correspond à sa description, ou que vous lancez vous-même en tapant /nom-du-skill. Il sert à figer une consigne que vous répétiez : une relecture de code selon vos critères, une procédure de livraison, la génération d'un type de fichier selon vos conventions. Son contenu complet n'entre dans le contexte qu'à l'usage ; seuls son nom et sa description y sont en permanence.",
  },
  {
    q: "Quelle différence entre un skill et une slash command ?",
    a: "Historiquement, une slash command était un fichier Markdown dans .claude/commands/, lancé par /nom. Les deux ont convergé : l'emplacement recommandé aujourd'hui est .claude/skills/<nom>/SKILL.md, et un skill s'invoque de la même façon, avec en plus la possibilité que Claude le charge de lui-même quand sa description correspond. Le dossier .claude/commands/ reste pris en charge pour la compatibilité.",
  },
  {
    q: "Où placer un skill pour qu'il soit disponible partout ?",
    a: "Dans ~/.claude/skills/<nom>/SKILL.md, le skill est chargé dans tous vos projets sur cette machine. Dans .claude/skills/ à la racine d'un dépôt, il n'est chargé que dans les sessions de ce dépôt, et il se commite avec le code pour que l'équipe l'ait aussi. Un skill peut aussi venir d'un plugin installé, ou être synchronisé depuis votre compte claude.ai, auquel cas il est en lecture seule et ses commandes injectées ne s'exécutent pas.",
  },
  {
    q: "Qu'est-ce qu'un plugin Claude Code ?",
    a: "Un plugin est un dossier qui empaquette plusieurs composants (skills, agents, hooks, serveurs MCP) avec un manifeste .claude-plugin/plugin.json, pour les installer d'un coup depuis une marketplace avec /plugin install nom@marketplace. Il n'ajoute aucun pouvoir par lui-même : il distribue. Un plugin activé est présent dans toutes vos sessions, et le nom de chacun de ses skills compte dans votre contexte à chaque tour, même quand rien ne s'exécute.",
  },
  {
    q: "Et un mod ?",
    a: "Un mod, apparu avec Claude Code 2.1.287 le 1er octobre 2026, est un plugin dont le code JavaScript ou TypeScript tourne à l'intérieur de Claude Code. Il peut dessiner un panneau ou une bande au-dessus de l'invite, retenir un appel d'outil pour poser une question, ajouter une commande qui s'exécute sans tour de Claude, ou remplacer une partie de l'interface. Il tourne avec vos permissions et n'est pas mis en bac à sable : on lit son code avant de l'installer.",
  },
  {
    q: "Peut-on installer un skill trouvé sur GitHub sans risque ?",
    a: "Pas sans le lire. Un skill est un texte qui devient une consigne pour un agent qui a accès à vos fichiers et à votre shell. Regardez son champ allowed-tools, les fichiers annexes qu'il charge, les commandes qu'il injecte, et toute instruction qui demanderait d'ignorer des consignes précédentes. Pour un plugin, les commandes claude plugin validate et claude plugin details listent ce qu'il contient et ce qu'il demande à Claude Code, sans rien lancer.",
  },
  {
    q: "Les skills fonctionnent-ils dans claude.ai, et pas seulement dans le terminal ?",
    a: "Le même format de skill existe sur claude.ai et dans les sessions de l'application de bureau, et les skills activés dans votre compte claude.ai se synchronisent vers le terminal. La réciproque n'est pas vraie : un skill écrit dans ~/.claude/skills/ reste local. Et dans un skill synchronisé, les commandes shell injectées ne s'exécutent pas, par sécurité.",
  },
];

export default function ClaudeCodeSkillsPage() {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": ["WebPage", "Article"],
    "@id": `${SITE_URL}/claude-code-skills#page`,
    headline: "Claude Code skills : créer un skill, l'installer, et les plugins",
    description: metadata.description,
    url: `${SITE_URL}/claude-code-skills`,
    inLanguage: "fr-FR",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    publisher: { "@id": ORG_ID },
    author: {
      "@type": "Person",
      name: "Alexandre Dos Reis Caetano",
      url: `${SITE_URL}/a-propos`,
    },
    dateModified: "2026-10-03",
    about: [
      { "@type": "Thing", name: "Claude Code" },
      { "@type": "Thing", name: "Agents de programmation" },
    ],
  };

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Créer un skill Claude Code",
    description:
      "Quatre étapes pour transformer une consigne que vous répétez en skill que Claude Code charge au bon moment.",
    inLanguage: "fr-FR",
    totalTime: "PT15M",
    step: etapes.map((m, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: m.titre,
      text: m.texte,
      url: `${SITE_URL}/claude-code-skills#etape-${i + 1}`,
    })),
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(articleJsonLd)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(howToJsonLd)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(faqJsonLd)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbJsonLd([
            { name: "Accueil", path: "/" },
            {
              name: "Formation intelligence artificielle",
              path: "/formation-intelligence-artificielle",
            },
            { name: "Claude Code skills", path: "/claude-code-skills" },
          ]),
        )}
      />

      <section className="relative overflow-hidden pt-16 pb-14 md:pt-24 md:pb-16">
        <div
          aria-hidden="true"
          className="absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full opacity-50 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(242,213,199,0.9), transparent 70%)",
          }}
        />
        <Container size="narrow">
          <nav className="mb-5 text-[13px] text-muted" aria-label="Fil d’Ariane">
            <Link href="/" className="transition-colors hover:text-coral">
              Accueil
            </Link>
            <span className="mx-2 text-line">/</span>
            <Link
              href="/formation-intelligence-artificielle"
              className="transition-colors hover:text-coral"
            >
              Formation IA
            </Link>
            <span className="mx-2 text-line">/</span>
            <span>Claude Code skills</span>
          </nav>

          <Eyebrow>Guide · Claude Code</Eyebrow>

          <h1 className="mt-4 font-serif text-[clamp(2.25rem,5vw,3.5rem)] font-medium leading-[1.08] tracking-[-0.025em] text-ink">
            Un skill Claude Code, c’est une consigne que vous{" "}
            <span className="accent-serif">n’aurez plus jamais</span> à retaper.
          </h1>

          <div className="mt-8 rounded-[18px] border-l-[3px] border-coral bg-cream-soft p-7">
            <p className="text-lg leading-relaxed text-ink">
              <strong>Définition courte :</strong> un skill est un fichier{" "}
              <code className="rounded bg-white px-1.5 py-0.5 text-[0.9em]">SKILL.md</code>{" "}
              que Claude Code charge quand votre demande correspond à sa
              description, ou que vous lancez en tapant{" "}
              <code className="rounded bg-white px-1.5 py-0.5 text-[0.9em]">/nom</code>.
              Il remplace les consignes que vous recolliez à chaque session. Les
              anciennes « slash commands » ont convergé vers ce format. Un{" "}
              <strong>plugin</strong> en emballe plusieurs pour les installer
              d’un coup, et un <strong>mod</strong> (depuis le 1er octobre 2026)
              est du code qui tourne à l’intérieur de Claude Code.
            </p>
          </div>

          <p className="mt-8 text-lg leading-relaxed text-muted">
            Le seuil pratique : si vous avez retapé la même consigne trois fois,
            elle est mûre pour devenir un skill. En dessous, vous figez un
            workflow qui bouge encore.
          </p>
        </Container>
      </section>

      {/* Créer un skill, en quatre étapes */}
      <section className="border-y border-line bg-cream-soft py-16 md:py-20">
        <Container size="narrow">
          <Eyebrow>Créer un skill</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl font-medium leading-[1.15] tracking-tight text-ink md:text-[2.5rem]">
            Quatre étapes, un seul fichier.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            Format relevé dans la documentation officielle le 3 octobre 2026.
            Les champs de l’en-tête sont tous facultatifs, mais un skill sans
            description ne se déclenche jamais au bon moment.
          </p>

          <ol className="mt-12 space-y-12">
            {etapes.map((m, i) => (
              <li key={m.titre} id={`etape-${i + 1}`} className="scroll-mt-24">
                <div className="flex gap-5">
                  <span className="font-serif text-3xl font-medium leading-none text-coral">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-serif text-2xl font-medium leading-snug text-ink">
                      {m.titre}
                    </h3>
                    <p className="mt-3 leading-relaxed text-muted">{m.texte}</p>
                    <pre className="mt-5 overflow-x-auto whitespace-pre-wrap border-l-2 border-coral-soft bg-white py-3 pl-5 pr-4 font-mono text-[13.5px] leading-relaxed text-ink">
                      {m.exemple}
                    </pre>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-14 rounded-[18px] border border-line bg-white p-8">
            <h3 className="font-serif text-xl font-medium text-ink">
              Le champ qui vaut le détour : allowed-tools
            </h3>
            <p className="mt-3 leading-relaxed text-muted">
              Il pré-approuve les outils dont le skill a besoin pour ce tour, et
              rien d’autre. Un skill de relecture n’a aucune raison de pouvoir
              écrire des fichiers : c’est le principe du moindre privilège,
              appliqué à vos propres workflows. Le champ inverse,
              disallowed-tools, retire des outils pendant que le skill est actif.
            </p>
          </div>
        </Container>
      </section>

      {/* Les cinq briques */}
      <section className="py-16 md:py-24">
        <Container size="narrow">
          <Eyebrow>Skill, hook, MCP, plugin, mod</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl font-medium leading-[1.15] tracking-tight text-ink md:text-[2.5rem]">
            Cinq façons d’étendre Claude Code. Une question les sépare : où ça tourne.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            Les quatre premières agissent de l’extérieur. Seul le mod s’exécute
            dans le processus de Claude Code, ce qui lui permet de dessiner une
            interface, et oblige à le lire comme du code installé avec vos
            droits.
          </p>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-[15px]">
              <thead>
                <tr className="border-b border-line text-left text-[12px] font-semibold uppercase tracking-[0.1em] text-muted">
                  <th className="py-3 pr-4">Brique</th>
                  <th className="py-3 pr-4">Ce que c’est</th>
                  <th className="py-3 pr-4">Ce qu’elle change</th>
                  <th className="py-3">Où ça tourne</th>
                </tr>
              </thead>
              <tbody>
                {briques.map((b) => (
                  <tr key={b.nom} className="border-b border-line align-top">
                    <td className="py-4 pr-4 font-semibold text-ink">{b.nom}</td>
                    <td className="py-4 pr-4 leading-relaxed text-ink-soft">{b.quoi}</td>
                    <td className="py-4 pr-4 leading-relaxed text-ink-soft">{b.change}</td>
                    <td className="py-4 leading-relaxed text-ink-soft">{b.ou}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <div className="rounded-[18px] border border-line bg-white p-7">
              <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">
                Avant d’installer un skill ou un plugin
              </span>
              <ul className="mt-4 space-y-2 text-[15px] leading-relaxed text-ink-soft">
                <li>Lire son allowed-tools : que s’autorise-t-il ?</li>
                <li>Lire les fichiers annexes qu’il charge et les commandes qu’il injecte.</li>
                <li>Chercher toute instruction qui demanderait d’ignorer des consignes précédentes.</li>
                <li>Pour un plugin : claude plugin validate et claude plugin details listent hooks, serveurs et appels sans rien lancer.</li>
                <li>Se rappeler qu’« officiel » qualifie la marketplace, jamais le plugin.</li>
              </ul>
            </div>
            <div className="rounded-[18px] border-[1.5px] border-coral bg-white p-7">
              <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-coral">
                Ce qu’un plugin activé coûte
              </span>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
                Il est présent dans toutes vos sessions, pas seulement celles où
                vous l’utilisez. Le nom et la description de chaque skill, agent
                et commande que Claude peut invoquer sont dans le contexte à
                chaque tour. Ses serveurs MCP tournent à côté de chaque session.
                L’onglet Installed de /plugin regroupe ceux que vous n’avez pas
                utilisés récemment : c’est là que se fait le ménage.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-cream-soft py-16 md:py-24">
        <Container size="narrow">
          <h2 className="font-serif text-3xl font-medium leading-[1.15] tracking-tight text-ink md:text-[2.5rem]">
            Le parcours Claude Code : huit leçons, la première en accès libre.
          </h2>
          <p className="mt-5 max-w-[620px] text-lg leading-relaxed text-muted">
            CLAUDE.md, skills et boucles de vérification, hooks, MCP,
            sous-agents, plugins et mods, puis l’Agent SDK pour sortir du
            terminal. Contenu vérifié sur Claude Code 2.1.288, en français, avec
            un exercice cochable par leçon.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/courses/claude-code-ia-agentic" variant="primary" size="lg">
              Lire la première leçon
            </Button>
            <Button href="/kit?src=page-claude-code-skills" variant="ghost" size="lg">
              Le kit gratuit, 15 prompts
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container size="narrow">
          <Eyebrow>Questions fréquentes</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl font-medium leading-[1.15] tracking-tight text-ink md:text-[2.5rem]">
            Skills, plugins et mods : ce qu’on nous demande.
          </h2>

          <dl className="mt-10 divide-y divide-line border-y border-line">
            {faq.map((item) => (
              <div key={item.q} className="py-7">
                <dt className="font-serif text-xl font-medium leading-snug text-ink">
                  {item.q}
                </dt>
                <dd className="mt-3 leading-relaxed text-muted">{item.a}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-8 text-[15px] text-muted">
            À lire ensuite :{" "}
            <Link
              href="/prompt-engineering"
              className="font-semibold text-coral hover:text-coral-dark"
            >
              le prompt engineering
            </Link>{" "}
            ·{" "}
            <Link
              href="/claude-vs-chatgpt"
              className="font-semibold text-coral hover:text-coral-dark"
            >
              Claude ou ChatGPT
            </Link>{" "}
            ·{" "}
            <Link
              href="/formation-intelligence-artificielle"
              className="font-semibold text-coral hover:text-coral-dark"
            >
              choisir une formation à l’IA
            </Link>
            .
          </p>
        </Container>
      </section>
    </>
  );
}
