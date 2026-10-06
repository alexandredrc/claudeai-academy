import type { Metadata } from "next";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import { Button } from "@/components/site/button";
import { CONTENU_A_JOUR_AU } from "@/lib/content/fraicheur";

export const metadata: Metadata = {
  title: "Le Kit : 15 prompts Claude, et ce que Claude Code change dans une journée",
  description:
    "15 prompts Claude classés par métier, le récit d'un directeur de restaurant qui travaille avec Claude Code tous les jours, et la frontière entre un prompt et un vrai système.",
  robots: { index: false, follow: false },
};

type Prompt = { title: string; remplace: string; body: string };
type Group = { label: string; intro: string; prompts: Prompt[] };

/**
 * Le kit a été réécrit le 6 octobre 2026. Avant, 15 prompts pour quatre
 * métiers de bureau (dev, data, marketing, management) et un encadré de vente
 * en bas. Les leads venaient de partout (Instagram, Ads « formation IA »,
 * bouche-à-oreille) et beaucoup ne se reconnaissaient dans aucun des quatre.
 *
 * Maintenant : la journée réelle du fondateur avec Claude Code en ouverture,
 * 15 prompts sur huit situations de travail (dont restauration, commerce,
 * indépendants, recherche d'emploi), puis la frontière entre ce qu'un prompt
 * fait et ce que Claude Code fait, qui est exactement ce que vend le Pass
 * Mastery. Chaque prompt dit ce qu'il remplace, en une ligne.
 *
 * Toujours 15 prompts : c'est la promesse de la page /kit et de l'email.
 */
const GROUPS: Group[] = [
  {
    label: "Pour tout le monde",
    intro: "Les trois tâches que tout le monde fait, et que presque personne ne délègue bien.",
    prompts: [
      {
        title: "Le résumé qui garde l'essentiel",
        remplace: "Vingt minutes de lecture d'un document que tu n'avais pas envie de lire.",
        body: `Tu es mon assistant de synthèse. Voici un document : [colle le texte].
Donne-moi :
1. Les 3 idées principales en une phrase chacune.
2. Les décisions ou actions concrètes qui en découlent.
3. Une question que ce document laisse sans réponse.
Pas de paraphrase, va à l'essentiel.`,
      },
      {
        title: "L'email difficile, écrit pour toi",
        remplace: "Le mail que tu réécris quatre fois avant de l'envoyer.",
        body: `Aide-moi à écrire un email à [destinataire et son rôle].
Contexte : [la situation délicate].
Objectif : [ce que je veux obtenir].
Ton : professionnel, direct, sans agressivité ni excuses excessives.
Donne-moi 2 versions : une courte, une plus diplomate.`,
      },
      {
        title: "La décision passée au crible",
        remplace: "La nuit blanche à tourner en rond entre deux options.",
        body: `J'hésite entre [option A] et [option B] pour [contexte].
Joue l'avocat du diable des deux côtés.
Donne-moi : les risques cachés de chaque option, la question
décisive à me poser, et ta recommandation argumentée.`,
      },
    ],
  },
  {
    label: "Restauration, commerce, artisanat",
    intro:
      "Ce que j'utilise moi-même, dans un restaurant. Les chiffres que tu colles sont les tiens, Claude fait le calcul et la mise en forme, tu gardes la décision.",
    prompts: [
      {
        title: "La fiche technique et le coût matière d'un plat",
        remplace: "Le tableur que tu n'as jamais mis à jour depuis la dernière hausse fournisseur.",
        body: `Tu es chef de cuisine et contrôleur de gestion.
Voici la recette pour [nombre] portions : [ingrédients avec quantités].
Voici mes prix d'achat : [ingrédient, prix, unité, fournisseur].
Calcule : le coût matière par portion, le ratio food cost
au prix de vente actuel de [prix], et le prix de vente
qui donnerait un food cost de [objectif, ex. 28 %].
Signale l'ingrédient qui pèse le plus dans le coût
et propose une substitution qui ne change pas le plat.
Présente le tout en tableau.`,
      },
      {
        title: "La carte ou le menu construit à partir de ce que tu as",
        remplace: "Le dimanche soir passé à composer le menu de la semaine.",
        body: `Tu es chef de cuisine. Je dois composer [une carte de saison /
un menu du jour / un menu de groupe] pour [contexte : saison,
nombre de couverts, budget par personne, style de la maison].
Voici mes produits disponibles et ceux à écouler : [liste].
Propose [nombre] plats avec, pour chacun : le nom tel qu'il
sera écrit sur la carte, une description en une ligne, les
allergènes à déclarer, et le niveau de difficulté en service.
Varie les techniques et évite les doublons de produit.
Je vérifierai les allergènes moi-même : signale ceux dont
tu n'es pas certain.`,
      },
      {
        title: "La réponse à un avis ou à une demande de groupe",
        remplace: "L'avis Google qui reste sans réponse pendant trois semaines.",
        body: `Tu gères la relation client de [type d'établissement : nom, style].
Voici [un avis client / une demande de réservation de groupe] : [colle].
Rédige une réponse dans ce ton : [chaleureux et précis / sobre].
Si c'est un avis négatif : remercie, reconnais le point précis
sans te justifier, propose une suite concrète. Jamais de formule
générique. Si c'est une demande : réponds à chaque question,
pose les 2 questions qui me manquent pour faire un devis,
et propose un créneau. Maximum 120 mots.`,
      },
    ],
  },
  {
    label: "Indépendants et petites entreprises",
    intro: "L'administratif que personne ne facture, et qui mange une demi-journée par mois.",
    prompts: [
      {
        title: "Le devis et la relance qui ne fâche pas",
        remplace: "Le devis fait à la main, et la facture impayée que tu n'oses pas relancer.",
        body: `Tu es mon assistant administratif. Mon activité : [métier].
Mes tarifs : [liste]. Mes conditions : [acompte, délai, TVA].
Tâche 1 : rédige un devis pour [client] à partir de cette demande :
[colle]. Présente les lignes, le total, les conditions.
Tâche 2 : écris 3 relances pour une facture de [montant] en retard
de [jours] : polie, ferme, dernière avant mise en demeure.
Chacune en moins de 80 mots, dans mon ton : [direct / cordial].`,
      },
      {
        title: "La boîte mail triée, les réponses préparées",
        remplace: "L'heure du matin perdue à lire des mails avant de commencer à travailler.",
        body: `Voici les emails reçus aujourd'hui, séparés par ---: [colle].
Classe-les en 4 colonnes : à répondre aujourd'hui, à répondre
cette semaine, à déléguer ou transférer, à ignorer.
Pour ceux de la première colonne, rédige un brouillon de réponse
de 3 à 5 lignes, dans mon ton : [exemple d'un email que j'ai écrit].
Signale tout email qui contient un engagement, une date
ou une somme, en le citant.`,
      },
    ],
  },
  {
    label: "Recherche d'emploi, reconversion",
    intro: "Si tu ne travailles pas en ce moment, c'est le moment où Claude te rend le plus.",
    prompts: [
      {
        title: "Le CV ciblé et l'entretien préparé",
        remplace: "Le même CV envoyé partout, et l'entretien où la question piège te surprend.",
        body: `Tu es recruteur senior dans [secteur].
Voici l'offre d'emploi : [colle]. Voici mon CV actuel : [colle].
1. Réécris mon CV pour cette offre : mêmes faits, aucune invention,
   mais le vocabulaire et l'ordre qui répondent à l'annonce.
2. Liste ce qui manque dans mon profil et comment le présenter
   honnêtement.
3. Prépare les 8 questions les plus probables en entretien,
   avec pour chacune une réponse de 30 secondes construite
   sur mon parcours réel.`,
      },
    ],
  },
  {
    label: "Développeurs",
    intro: "Les deux tâches où Claude fait gagner le plus, parce qu'on les repousse toujours.",
    prompts: [
      {
        title: "Le bug traqué méthodiquement",
        remplace: "Les deux heures à relancer le même code en changeant une ligne au hasard.",
        body: `J'ai cette erreur : [message d'erreur complet].
Voici le code concerné : [colle].
Voici ce que j'ai déjà essayé : [tes tentatives].
Propose 3 hypothèses de cause classées par probabilité,
et pour chacune comment la vérifier rapidement.`,
      },
      {
        title: "Les tests que tu n'écris jamais",
        remplace: "Le « je testerai plus tard » qui finit en bug en production.",
        body: `Écris une suite de tests pour cette fonction.
Couvre : cas nominal, cas limites, entrées invalides, et un cas
auquel un développeur penserait rarement. Framework : [ex. Jest, pytest].
Fonction : [colle].`,
      },
    ],
  },
  {
    label: "Data, Excel, chiffres",
    intro: "Pour ceux qui vivent dans un tableur sans être analystes, et pour les analystes.",
    prompts: [
      {
        title: "Le tableau Excel ou Sheets démêlé",
        remplace: "La formule copiée d'un forum, qui marche sans que tu saches pourquoi.",
        body: `J'ai un tableau avec ces colonnes : [liste].
Je veux [objectif : tableau croisé, formule, nettoyage...].
Donne-moi la formule exacte (Excel et Google Sheets),
et explique-la pour que je puisse l'adapter seul la prochaine fois.`,
      },
      {
        title: "L'analyse qui trouve l'histoire dans les chiffres",
        remplace: "Le rapport mensuel qui dit « le CA a augmenté » sans dire pourquoi.",
        body: `Voici un jeu de données : [colle ou décris].
Agis comme un analyste senior. Donne-moi : les 3 tendances notables,
une anomalie qui mérite investigation, et la visualisation la plus
parlante à produire (et pourquoi).
Pour chaque chiffre que tu avances, cite la ligne ou la colonne
d'où il vient.`,
      },
    ],
  },
  {
    label: "Marketing, contenu",
    intro: "Claude écrit correct et plat par défaut. La différence se joue dans le brief.",
    prompts: [
      {
        title: "Le contenu qui ne sent pas l'IA",
        remplace: "Le post LinkedIn générique que personne ne lit jusqu'au bout.",
        body: `Écris [type de contenu] sur [sujet] pour [audience précise].
Contraintes : ton [adjectif], phrases courtes, exemples concrets,
zéro formule creuse ("dans un monde où", "il est important de noter").
Voici un texte que j'ai écrit, imite son rythme : [colle].
Donne-moi 3 angles différents avant de rédiger, je choisirai.`,
      },
    ],
  },
  {
    label: "Managers, consultants",
    intro: "Avant de déployer l'IA dans une équipe, savoir où elle rend vraiment.",
    prompts: [
      {
        title: "Le cadre de décision IA pour ton équipe",
        remplace: "La réunion « il faudrait qu'on fasse quelque chose avec l'IA » sans suite.",
        body: `Tu es consultant en transformation IA. Mon équipe fait [activité].
Identifie les 5 tâches où l'IA générative apporterait le plus de gain,
classe-les par (impact × facilité de mise en œuvre), et pour la n°1
donne-moi un plan de test sur 2 semaines, avec ce qu'on mesure.`,
      },
    ],
  },
];

// Offset de numérotation par groupe (somme des prompts des groupes précédents).
const GROUP_OFFSETS = GROUPS.reduce<number[]>((acc, group, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + GROUPS[i - 1].prompts.length);
  return acc;
}, []);

/** La frontière entre coller un prompt dans le chat et faire travailler Claude Code. */
const FRONTIERE: { tache: string; prompt: string; claudeCode: string }[] = [
  {
    tache: "Le coût matière",
    prompt: "Tu colles une recette et une liste de prix, tu obtiens un tableau.",
    claudeCode:
      "Il lit tes fiches techniques et tes factures fournisseurs, recalcule tous les plats quand un prix change, et te dit lesquels passent sous la marge.",
  },
  {
    tache: "Les emails",
    prompt: "Tu colles dix emails, il te propose dix brouillons.",
    claudeCode:
      "Branché sur ta boîte, il trie chaque matin, prépare les réponses dans ton ton, et ne laisse partir que ce que tu as validé.",
  },
  {
    tache: "Le menu",
    prompt: "Il propose des plats à partir d'une liste que tu tapes.",
    claudeCode:
      "Il part de ton stock réel, de tes ventes de la semaine passée et de ton food cost cible, et sort la carte prête à imprimer, allergènes compris.",
  },
  {
    tache: "Un outil à toi",
    prompt: "Il te donne du code. Tu ne sais pas quoi en faire.",
    claudeCode:
      "Il crée l'application, la lance, corrige ses propres erreurs et la met en ligne. Tu décris, tu vérifies.",
  },
  {
    tache: "Une tâche qui revient",
    prompt: "Tu la refais à la main, avec le même prompt, chaque semaine.",
    claudeCode:
      "Elle devient une commande ou un agent planifié. Tu reçois le résultat, tu ne lances plus rien.",
  },
];

/** Ce que chaque profil peut avoir construit en un mois, avec le programme complet. */
const PROFILS: { qui: string; quoi: string }[] = [
  {
    qui: "Restaurateur, commerçant",
    quoi: "Fiches techniques et food cost recalculés automatiquement, carte générée depuis le stock, réponses aux avis et aux groupes préparées chaque matin.",
  },
  {
    qui: "Artisan, indépendant",
    quoi: "Un assistant qui connaît tes tarifs et tes clients : devis, factures, relances, tri de la boîte mail. L'admin tient en une heure par semaine.",
  },
  {
    qui: "Salarié, chef d'équipe",
    quoi: "Tes comptes rendus, tes reportings et tes présentations produits à partir de tes fichiers réels, et un cadre pour déployer l'IA dans ton équipe sans risque.",
  },
  {
    qui: "Étudiant, en reconversion, sans emploi",
    quoi: "Une compétence qui se montre : une application que tu as construite toi-même, un CV ciblé par offre, et la certification ClaudeAI Academy sur ton profil.",
  },
  {
    qui: "Développeur",
    quoi: "Claude Code configuré sur ton projet : contexte, commandes, hooks, sous-agents, connexions à tes outils. Tu passes du code à l'architecture.",
  },
  {
    qui: "Créateur, marketeur",
    quoi: "Un brief de voix de marque réutilisable, une production de contenu industrialisée sans perdre ton ton, et des emails qui convertissent, mesurés.",
  },
  {
    qui: "Analyste, contrôleur de gestion",
    quoi: "Du SQL fiable depuis ton schéma, des anomalies détectées dans tes factures ou tes ventes, et la méthode pour vérifier ce que l'IA sort.",
  },
];

/** Le programme complet, parcours par parcours. Les titres sont ceux des leçons en ligne. */
const PARCOURS: { nom: string; lecons: number; pour: string }[] = [
  { nom: "Bien démarrer avec Claude", lecons: 8, pour: "plan, modèle, réglages, mémoire et projets : Claude sait qui tu es" },
  { nom: "Prompt Engineering pro", lecons: 7, pour: "clarté, contexte, exemples, structure, rôle, raisonnement" },
  { nom: "Claude Code et l'IA agentique", lecons: 8, pour: "Claude sur tes fichiers et tes outils, commandes, hooks, MCP, sous-agents" },
  { nom: "Claude pour data et SQL", lecons: 6, pour: "SQL fiable, anomalies, vérification, synthèses qui parlent" },
  { nom: "Contenu et marketing avec Claude", lecons: 6, pour: "voix de marque, industrialiser, SEO, emails qui convertissent" },
  { nom: "Stratégie et conduite IA en entreprise", lecons: 6, pour: "bon cas d'usage, vrai coût, RGPD et AI Act, adoption" },
  { nom: "Prompts, skills, MCP et GitHub", lecons: 5, pour: "trouver, installer et sécuriser ce que l'écosystème propose" },
  { nom: "Construire ton agent IA avec Claude", lecons: 7, pour: "agent personnel, tâches planifiées, n8n, Agent SDK, production, sécurité" },
  { nom: "Trading et Claude Code", lecons: 4, pour: "backtester sans se mentir, coder le risque, automatiser la recherche" },
];

export default function KitRessourcesPage() {
  const totalLecons = PARCOURS.reduce((n, p) => n + p.lecons, 0);
  return (
    <article className="pt-12 pb-24 md:pt-16 md:pb-32">
      <Container size="narrow">
        <Eyebrow>Le Kit · 15 prompts</Eyebrow>
        <h1 className="mt-4 font-serif text-[clamp(2rem,4.5vw,3.25rem)] font-medium leading-[1.08] tracking-tight text-ink">
          15 prompts, et ce que Claude change
          <br />
          dans une vraie journée de travail
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted">
          Ce kit a deux parties. D&apos;abord ce que je fais, moi, avec Claude
          tous les jours, en dirigeant un restaurant. Ensuite 15 prompts à
          copier, classés par situation de travail, avec pour chacun la tâche
          qu&apos;il remplace. À la fin, la frontière entre un prompt et un vrai
          système : c&apos;est là que la plupart des gens s&apos;arrêtent, et c&apos;est là
          que ça devient intéressant.
        </p>

        {/* Le cas du fondateur */}
        <section className="mt-12 rounded-[18px] border border-line bg-cream-soft p-6 md:p-8">
          <p className="text-[13px] uppercase tracking-[0.08em] text-coral-dark mb-3">
            Ce que je fais avec Claude Code, tous les jours
          </p>
          <p className="font-serif text-2xl font-medium text-ink mb-4">
            Je dirige un restaurant en Suisse. Je ne suis pas développeur.
          </p>
          <div className="flex flex-col gap-4 text-[15px] leading-relaxed text-ink-soft">
            <p>
              Claude Code, c&apos;est Claude qui travaille directement dans mes
              fichiers, au lieu d&apos;un chat où je colle des bouts de texte. Il lit
              mes fiches techniques, mes factures fournisseurs, mes exports de
              caisse, et il agit dessus. Voici à quoi ressemble ma semaine avec.
            </p>
            <ul className="flex flex-col gap-3 list-none pl-0">
              <li className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-[9px] h-[7px] w-[7px] flex-shrink-0 rounded-full bg-coral" />
                <span>
                  <strong className="text-ink">La carte.</strong> Je lui donne la saison,
                  les produits à écouler et le style de la maison. Il propose les
                  plats, écrit les intitulés et les descriptions, liste les
                  allergènes à déclarer. Je vérifie, je tranche, et la carte
                  mise en forme sort dans la foulée.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-[9px] h-[7px] w-[7px] flex-shrink-0 rounded-full bg-coral" />
                <span>
                  <strong className="text-ink">Le food cost.</strong> Chaque plat a sa fiche
                  technique dans un dossier. Quand un fournisseur change un prix,
                  Claude Code recalcule le coût matière de tous les plats
                  concernés et me dit lesquels passent sous ma marge cible. Avant,
                  c&apos;était un tableur que je mettais à jour quand j&apos;avais le temps,
                  donc rarement.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-[9px] h-[7px] w-[7px] flex-shrink-0 rounded-full bg-coral" />
                <span>
                  <strong className="text-ink">Les prix.</strong> À partir du coût matière, du
                  positionnement et de ce que vendent les plats comparables, il me
                  propose un prix de vente et le food cost qui en résulte. La
                  décision reste la mienne, mais je la prends avec les chiffres
                  sous les yeux, pas au doigt mouillé.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-[9px] h-[7px] w-[7px] flex-shrink-0 rounded-full bg-coral" />
                <span>
                  <strong className="text-ink">Les menus.</strong> Menu du jour, menus de
                  groupe, événements : il part des fiches existantes, compose,
                  met en forme, et je n&apos;ouvre plus un logiciel de mise en page.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-[9px] h-[7px] w-[7px] flex-shrink-0 rounded-full bg-coral" />
                <span>
                  <strong className="text-ink">Les emails.</strong> Demandes de groupe,
                  réservations particulières, fournisseurs, candidatures : il trie
                  ce qui arrive, prépare les réponses dans mon ton, signale tout ce
                  qui contient une date ou un montant. Je relis et j&apos;envoie. Rien
                  ne part sans moi.
                </span>
              </li>
            </ul>
            <p>
              Ce n&apos;est pas une démo. C&apos;est ma façon de travailler depuis des
              mois, et c&apos;est ce qui m&apos;a décidé à construire cette formation :
              tout ce que je viens de décrire s&apos;apprend, et ça s&apos;apprend vite
              quand quelqu&apos;un t&apos;a montré le chemin. Les 15 prompts qui suivent
              sont le premier pas. La frontière, en bas de page, est le deuxième.
            </p>
          </div>
        </section>

        {/* La règle */}
        <div className="mt-12 rounded-[18px] border border-line bg-white p-6 md:p-8">
          <p className="font-serif text-xl text-ink mb-3">
            La règle qui change tout
          </p>
          <p className="text-[15px] leading-relaxed text-ink-soft mb-4">
            La plupart des gens écrivent à Claude comme dans une barre de
            recherche. Les pros donnent trois choses que l&apos;amateur oublie :
          </p>
          <ol className="flex flex-col gap-2 text-[15px] leading-relaxed text-ink-soft list-decimal pl-5">
            <li><strong className="text-ink">Un rôle</strong> : « Tu es un chef de cuisine et contrôleur de gestion », pas « explique-moi ».</li>
            <li><strong className="text-ink">Du contexte</strong> : ce que tu sais déjà, ta contrainte, ton objectif réel.</li>
            <li><strong className="text-ink">Un format de sortie</strong> : tableau, étapes numérotées, 3 options classées.</li>
          </ol>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
            Les 15 prompts ci-dessous appliquent cette règle. Copie, remplace le{" "}
            <code className="font-mono text-[0.9em] text-coral-dark">[texte entre crochets]</code>,
            adapte. Ce sont des squelettes, pas des incantations.
          </p>
        </div>

        {GROUPS.map((group, gi) => (
          <section key={group.label} className="mt-14">
            <h2 className="font-serif text-2xl font-medium text-ink mb-2">
              {group.label}
            </h2>
            <p className="text-[15px] leading-relaxed text-muted mb-6">{group.intro}</p>
            <div className="flex flex-col gap-8">
              {group.prompts.map((prompt, pi) => {
                const num = GROUP_OFFSETS[gi] + pi + 1;
                return (
                  <div key={prompt.title}>
                    <p className="text-[15px] font-semibold text-ink mb-1">
                      <span className="text-coral-dark font-mono text-[13px] mr-2">
                        {String(num).padStart(2, "0")}
                      </span>
                      {prompt.title}
                    </p>
                    <p className="text-[14px] leading-relaxed text-muted mb-3">
                      Remplace : {prompt.remplace}
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

        {/* La frontière */}
        <section className="mt-20">
          <Eyebrow>La frontière</Eyebrow>
          <h2 className="mt-4 font-serif text-[clamp(1.75rem,3.5vw,2.5rem)] font-medium leading-[1.1] tracking-tight text-ink">
            Ce qu&apos;un prompt ne fera jamais
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-ink-soft">
            Un prompt, c&apos;est toi qui colles, qui lances, qui récupères, à chaque
            fois. Ça fait gagner des minutes. Ce qui fait gagner des heures,
            c&apos;est quand Claude travaille dans tes fichiers, tes outils et ton
            calendrier sans que tu le relances. Même tâche, deux mondes :
          </p>
          <div className="mt-8 overflow-hidden rounded-[18px] border border-line">
            <table className="w-full border-collapse text-[14.5px] leading-relaxed">
              <thead>
                <tr className="bg-cream-soft text-left">
                  <th scope="col" className="px-4 py-3 font-semibold text-ink w-[22%]">Tâche</th>
                  <th scope="col" className="px-4 py-3 font-semibold text-ink w-[34%]">Avec un prompt dans le chat</th>
                  <th scope="col" className="px-4 py-3 font-semibold text-coral-dark">Avec Claude Code</th>
                </tr>
              </thead>
              <tbody>
                {FRONTIERE.map((r) => (
                  <tr key={r.tache} className="border-t border-line align-top">
                    <td className="px-4 py-4 font-semibold text-ink">{r.tache}</td>
                    <td className="px-4 py-4 text-muted">{r.prompt}</td>
                    <td className="px-4 py-4 text-ink-soft">{r.claudeCode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-[15px] leading-relaxed text-ink-soft">
            La colonne de droite n&apos;est pas réservée aux développeurs. Claude Code
            écrit le code, le lance et corrige ses erreurs ; toi, tu décris le
            résultat voulu et tu vérifies. Il est inclus dans l&apos;abonnement Claude
            Pro, il n&apos;y a pas d&apos;outil de plus à acheter. Ce qu&apos;il faut, c&apos;est
            la méthode : donner un contexte durable, transformer une tâche qui
            revient en procédure, brancher tes outils, garder la main sur ce qui
            part. C&apos;est exactement le programme.
          </p>
        </section>

        {/* Par profil */}
        <section className="mt-16">
          <h2 className="font-serif text-2xl font-medium text-ink mb-2">
            Ce que tu peux avoir construit dans un mois
          </h2>
          <p className="text-[15px] leading-relaxed text-muted mb-6">
            Selon ta situation, avec le programme complet. Pas des promesses de
            résultat : des choses que les leçons t&apos;apprennent à faire, étape par
            étape.
          </p>
          <dl className="flex flex-col divide-y divide-line border-y border-line">
            {PROFILS.map((pr) => (
              <div key={pr.qui} className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-1 md:gap-6 py-4">
                <dt className="font-semibold text-ink text-[15px]">{pr.qui}</dt>
                <dd className="text-[15px] leading-relaxed text-ink-soft">{pr.quoi}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Le programme et l'offre */}
        <section className="mt-16 rounded-[18px] border border-line bg-ink p-8 md:p-10 text-cream">
          <p className="text-[13px] uppercase tracking-[0.08em] text-coral mb-3">
            Pass Mastery · le programme complet
          </p>
          <p className="font-serif text-[clamp(1.6rem,3vw,2.1rem)] font-medium leading-[1.15] mb-4">
            Tout le chemin, du premier réglage à l&apos;agent qui travaille seul.
          </p>
          <p className="text-[15px] leading-relaxed text-cream/80 mb-7 max-w-[600px]">
            {PARCOURS.length} parcours, {totalLecons} leçons, 170 prompts prêts à
            adapter, un Mentor IA qui connaît toutes les leçons et répond à tes
            questions sur ton cas, un examen de certification. Contenu vérifié
            au {CONTENU_A_JOUR_AU}, mis à jour à vie.
          </p>
          <ol className="flex flex-col gap-2.5 text-[14.5px] leading-relaxed text-cream/85 mb-8">
            {PARCOURS.map((pc, i) => (
              <li key={pc.nom} className="flex gap-3">
                <span className="font-mono text-[12.5px] text-coral mt-[3px] w-[18px] flex-shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="text-cream font-semibold">{pc.nom}</span>
                  <span className="text-cream/60"> · {pc.lecons} leçons</span>
                  <span className="text-cream/75"> : {pc.pour}.</span>
                </span>
              </li>
            ))}
          </ol>
          <div className="rounded-[12px] border border-cream/15 p-5 mb-7">
            <p className="text-[15px] leading-relaxed text-cream/90 mb-2">
              <strong className="text-cream">497 €</strong>, une fois, ou 3 × 165,67 € sans frais.
              Accès à vie, mises à jour comprises. Pas d&apos;abonnement.
            </p>
            <p className="text-[14px] leading-relaxed text-cream/70">
              Garantie 14 jours : un email dans ce délai et tu es remboursé
              intégralement, sans justification. Le risque est de mon côté.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href="/tarifs" variant="primary" size="lg">
              Voir le Pass Mastery
            </Button>
          </div>
          <p className="mt-6 text-[13.5px] leading-relaxed text-cream/60">
            Tu veux juste poser la méthode avant d&apos;aller plus loin ? Le Pass
            Starter, 47 €, couvre les trois premiers parcours (23 leçons), et
            son montant est déduit si tu passes ensuite au Mastery.
          </p>
        </section>
      </Container>
    </article>
  );
}
