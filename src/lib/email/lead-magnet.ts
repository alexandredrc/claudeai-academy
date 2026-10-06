import { SITE_URL, sendEmail } from "@/lib/email/send";
import { enTetesDesinscription, lienDesinscription } from "@/lib/email/desinscription";
import {
  CONTENU_A_JOUR_AU,
  NOTES_DE_MISE_A_JOUR,
  SOURCES_SURVEILLEES,
} from "@/lib/content/fraicheur";

/**
 * Emails envoyés aux leads du kit gratuit (prospects, pas encore clients).
 *
 * Le planning (âge minimal, écart minimal entre deux emails) vit dans
 * `api/cron/lead-nurture`. Ici, seulement le contenu.
 *
 * - lead_magnet : livraison du kit, immédiate.
 * - lead_a1..a5 : les dix premiers jours, méthode puis offre d'entrée (47 €).
 * - lead_b1..b8 : un cas concret par semaine. C'est la promesse écrite sur le
 *   formulaire du kit depuis juin (« un usage concret de Claude par semaine »),
 *   restée sans contenu jusqu'au 04/10/2026.
 *
 * Règles de contenu, non négociables : chaque chiffre a sa source en lien
 * dans l'email ; un calcul de gain est présenté comme un calcul, avec ses
 * hypothèses, jamais comme une promesse de revenu ; pas de tiret cadratin.
 */
export const LEAD_EMAIL_KINDS = [
  "lead_magnet",
  "lead_a1",
  "lead_a2",
  "lead_a3",
  "lead_a4",
  "lead_a5",
  "lead_b1",
  "lead_b2",
  "lead_b3",
  "lead_b4",
  "lead_b5",
  "lead_b6",
  "lead_b7",
  "lead_b8",
] as const;
export type LeadEmailKind = (typeof LEAD_EMAIL_KINDS)[number];

const KIT_URL = `${SITE_URL}/kit/ressources`;

/**
 * Lien tracé vers le site : `?src=email-lead-b3` devient « email / newsletter »,
 * campagne `email-lead-b3`, jusque dans la vente (voir lib/attribution.ts).
 */
function lien(chemin: string, kind: LeadEmailKind): string {
  const sep = chemin.includes("?") ? "&" : "?";
  return `${SITE_URL}${chemin}${sep}src=email-${kind.replace("_", "-")}`;
}

// --- Charte : coquille HTML commune (crème / coral / serif), identique au nurture ---
function shell(inner: string, desinscription: string | null): string {
  const sortie = desinscription
    ? `Pour ne plus rien recevoir : <a href="${desinscription}" style="color:#8A857B;">se désinscrire en un clic</a>.`
    : "Pour ne plus rien recevoir, réponds simplement « STOP » à cet email.";
  return `<!DOCTYPE html>
<html lang="fr">
  <body style="margin:0;padding:32px 16px;background:#F5F1EB;font-family:Georgia,'Times New Roman',serif;color:#1F1F1E;">
    <div style="max-width:560px;margin:0 auto;">
      <p style="font-size:14px;letter-spacing:0.08em;text-transform:uppercase;color:#D97757;margin:0 0 24px;">ClaudeAI Academy</p>
      ${inner}
      <hr style="border:none;border-top:1px solid #E2DCD0;margin:28px 0 20px;" />
      <p style="font-size:13px;line-height:1.7;color:#8A857B;margin:0 0 4px;">Tu reçois ce message parce que tu as téléchargé le kit ClaudeAI Academy. ${sortie}</p>
      <p style="font-size:13px;line-height:1.7;color:#8A857B;margin:0;">Une question ? <a href="mailto:contact@claudeai-academy.com" style="color:#8A857B;">contact@claudeai-academy.com</a></p>
    </div>
  </body>
</html>`;
}

function p(text: string): string {
  return `<p style="font-size:16px;line-height:1.7;margin:0 0 16px;">${text}</p>`;
}

function h(text: string): string {
  return `<p style="font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#D97757;margin:24px 0 8px;">${text}</p>`;
}

function bullets(items: string[]): string {
  const lis = items.map((i) => `<li style="margin:0 0 8px;">${i}</li>`).join("");
  return `<ul style="font-size:16px;line-height:1.7;margin:0 0 20px;padding-left:20px;">${lis}</ul>`;
}

/** Encadré « le calcul » : hypothèses visibles, résultat, et la phrase qui dit que c'est un calcul. */
function calcul(lignes: string[]): string {
  const corps = lignes.map((l) => `<p style="font-size:15px;line-height:1.6;margin:0 0 6px;">${l}</p>`).join("");
  return `<div style="background:#EDE6D9;border-radius:10px;padding:16px 18px;margin:4px 0 20px;">${corps}<p style="font-size:13px;line-height:1.5;color:#6B6557;margin:10px 0 0;">Un ordre de grandeur à partir des sources citées, pas une promesse de revenu : le résultat dépend de ton métier, de tes clients et du temps que tu y mets.</p></div>`;
}

/** Ligne de sources en petit, liens cliquables. */
function sources(items: { label: string; url: string }[]): string {
  const liens = items.map((s) => `<a href="${s.url}" style="color:#8A857B;">${s.label}</a>`).join(" · ");
  return `<p style="font-size:13px;line-height:1.6;color:#8A857B;margin:0 0 20px;">Sources : ${liens}</p>`;
}

function cta(label: string, href: string): string {
  return `<p style="margin:8px 0 24px;"><a href="${href}" style="display:inline-block;background:#D97757;color:#FFFFFF;text-decoration:none;padding:12px 24px;border-radius:6px;font-size:16px;">${label}</a></p>`;
}

/**
 * Prénom tel que saisi dans le formulaire du kit. Au 04/10/2026, 11 leads sur
 * 83 l'avaient tapé tout en minuscules : « Bonjour camille, » fait envoi de
 * masse. On ne corrige que ce cas-là (un « McLean » saisi tel quel est gardé).
 */
function prenomPropre(prenom: string): string {
  const p = prenom.trim();
  if (p !== p.toLowerCase()) return p;
  return p.replace(/(^|[\s'-])(\p{L})/gu, (_, sep: string, l: string) => sep + l.toUpperCase());
}

function greeting(firstName: string | null): string {
  return firstName?.trim() ? `Bonjour ${prenomPropre(firstName)},` : "Bonjour,";
}

/** Version texte : on retire le HTML des paragraphes déjà écrits pour le HTML. */
function texte(html: string): string {
  return html
    .replace(/<br\s*\/?>/g, "\n")
    .replace(/<li[^>]*>/g, "- ")
    .replace(/<\/(p|li|div|ul)>/g, "\n")
    .replace(/<a [^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/g, "$2 ($1)")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

type Rendered = { subject: string; html: string; text: string };

function rendre(subject: string, blocs: string[], desinscription: string | null): Rendered {
  const inner = blocs.join("\n");
  const pied = desinscription
    ? `\n\n---\nPour ne plus rien recevoir : ${desinscription}`
    : "\n\n---\nPour ne plus rien recevoir, réponds « STOP » à cet email.";
  return { subject, html: shell(inner, desinscription), text: texte(inner) + pied };
}

// Faits produit, une seule copie (vérifiés sur le site et en base le 04/10/2026).
const MASTERY_PRIX = "497 €, ou 3 × 165,67 € sans frais";
const GARANTIE =
  "Garantie 14 jours : un email à contact@claudeai-academy.com dans ce délai et tu es remboursé intégralement, sans justification.";

/**
 * Sources, ouvertes et relues le 04/10/2026. Les cas clients sont des pages
 * Anthropic : chiffres déclarés par les entreprises, dits comme tels.
 * Les études académiques portent sur ChatGPT ou GPT-4, pas sur Claude : dit
 * aussi, à chaque fois.
 */
const SRC = {
  anthropicGains: { label: "Anthropic, nov. 2025", url: "https://www.anthropic.com/research/estimating-productivity-gains" },
  indexJanv: { label: "Anthropic Economic Index, janv. 2026", url: "https://www.anthropic.com/research/anthropic-economic-index-january-2026-report" },
  indexMars: { label: "Anthropic Economic Index, mars 2026", url: "https://www.anthropic.com/research/economic-index-march-2026-report" },
  indexJuin: { label: "Anthropic Economic Index, juin 2026", url: "https://www.anthropic.com/research/economic-index-june-2026-report" },
  noyZhang: { label: "Noy et Zhang, Science, 2023", url: "https://europepmc.org/article/MED/37440646" },
  bcg: { label: "Dell'Acqua et al., Harvard Business School, 2023", url: "https://mitsloan.mit.edu/sites/default/files/2023-10/SSRN-id4573321.pdf" },
  brynjolfsson: { label: "Brynjolfsson, Li et Raymond, QJE, 2025", url: "https://www.nber.org/papers/w31161" },
  insee: { label: "INSEE Première n° 2079, 2025", url: "https://www.insee.fr/fr/statistiques/8657156" },
  malt: { label: "baromètre des tarifs Malt, août 2026", url: "https://www.malt.fr/t/barometre-tarifs" },
  pricing: { label: "tarifs Claude", url: "https://claude.com/pricing" },
  qonto: { label: "cas Qonto, Anthropic", url: "https://claude.com/customers/qonto" },
  petitesBoites: { label: "Claude pour les petites entreprises, Anthropic", url: "https://claude.com/solutions/small-business" },
  chatplace: { label: "cas ChatPlace, Anthropic", url: "https://claude.com/customers/chatplace" },
  evenup: { label: "cas EvenUp, Anthropic", url: "https://claude.com/customers/evenup" },
  gcai: { label: "cas GC AI, Anthropic", url: "https://claude.com/customers/gc-ai" },
};

type Rendu = (prenom: string | null, d: string | null) => Rendered;

const EMAILS: Record<LeadEmailKind, Rendu> = {
  // ── J0 · livraison ────────────────────────────────────────────────────────
  lead_magnet: (prenom, d) =>
    rendre(
      "Ton kit : 15 prompts Claude prêts à l'emploi",
      [
        p(greeting(prenom)),
        p("Voici ton accès. Le kit est sur cette page, prêt à copier :"),
        cta("Ouvrir le kit (15 prompts)", KIT_URL),
        p("Il a trois parties. D'abord ce que je fais avec Claude Code tous les jours en dirigeant un restaurant : la carte, le food cost, les prix, les menus, les emails. Ensuite les 15 prompts, classés par situation de travail (restauration et commerce, indépendants, recherche d'emploi, dev, data, marketing, management), avec pour chacun la tâche qu'il remplace. Enfin la frontière entre un prompt et un vrai système, celle que la plupart des gens ne franchissent jamais."),
        p("Un conseil pour qu'il te serve vraiment : choisis <strong>un seul</strong> prompt aujourd'hui, celui qui colle à une tâche que tu fais cette semaine. Applique-le, garde le résultat."),
        p("Dans deux jours, je t'écris pour te montrer comment passer d'un prompt isolé à un vrai gain de temps. Ensuite, comme promis, un cas concret par semaine : ce que des gens font réellement avec Claude, et ce que ça vaut en heures et en euros, sources à l'appui."),
        p("À bientôt,<br />Alexandre, fondateur de ClaudeAI Academy"),
      ],
      d,
    ),

  // ── A1 · J+2 · le vrai problème ───────────────────────────────────────────
  lead_a1: (prenom, d) =>
    rendre(
      "Tu n'utilises pas Claude. Tu le sous-utilises.",
      [
        p(greeting(prenom)),
        p("Tu as récupéré le kit, tu as sûrement testé deux ou trois prompts. Voici ce qui arrive à la plupart des gens ensuite : ils gagnent quelques minutes par jour, s'habituent, et plafonnent."),
        p("Ce qui sépare quelqu'un qui « utilise l'IA » de quelqu'un qui en tire un vrai levier tient en trois habitudes :"),
        bullets([
          "<strong>Un contexte durable.</strong> Projets, mémoire, instructions : Claude sait qui tu es et sur quoi tu travailles, tu ne réexpliques plus tout à chaque conversation.",
          "<strong>Des procédures, pas des questions.</strong> Une tâche qui revient devient un prompt structuré, une skill ou un agent qu'on relance en une ligne.",
          "<strong>La vérification.</strong> Même sur des tâches de niveau licence, Claude réussit environ deux fois sur trois selon Anthropic (66 %). Savoir relire vite et bien, c'est ce qui rend le reste fiable.",
        ]),
        p("Et ça se mesure : dans les données d'Anthropic, les utilisateurs les plus anciens réussissent mieux leurs conversations que les nouveaux venus (10 % de réussite en plus, et l'écart reste net une fois les autres facteurs neutralisés). La maîtrise n'est pas une impression, c'est une compétence."),
        sources([SRC.indexJanv, SRC.indexMars]),
        p("Demain : ce que les études mesurent vraiment comme gain de temps, et ce que ça vaut en euros."),
        p("À demain,<br />Alexandre"),
      ],
      d,
    ),

  // ── A2 · J+3 · la preuve, chiffrée ────────────────────────────────────────
  lead_a2: (prenom, d) =>
    rendre(
      "40 % de temps en moins : ce que les études mesurent vraiment",
      [
        p(greeting(prenom)),
        p("Des chiffres plutôt que des promesses : voici ce qui a été mesuré, par qui, et avec quelles limites."),
        bullets([
          "<strong>Rédaction professionnelle</strong> : 453 diplômés, temps de rédaction <strong>−40 %</strong> et qualité <strong>+18 %</strong> (revue Science, 2023, avec ChatGPT).",
          "<strong>Conseil</strong> : 758 consultants du BCG, tâches bouclées <strong>25 % plus vite</strong> et qualité jugée supérieure de plus de 40 % (Harvard, 2023, avec GPT-4).",
          "<strong>Claude</strong> : à partir de conversations réelles, Anthropic estime qu'une tâche de 90 minutes en moyenne est accélérée d'environ <strong>80 %</strong>. Estimation, pas chronomètre : le temps passé à vérifier n'est pas compté.",
        ]),
        p("La même étude Harvard montre aussi le revers : sur une tâche hors de portée de l'IA, les consultants équipés de l'IA ont eu <strong>19 points de bonnes réponses en moins</strong>. Le gain va à ceux qui savent quand déléguer, et quand ne pas le faire."),
        h("Le calcul"),
        calcul([
          "Tu passes 5 heures par semaine à écrire : emails, comptes rendus, propositions.",
          "Avec les −40 % mesurés, tu en récupères 2.",
          "Au salaire brut moyen du privé en France (3 602 € par mois, soit ≈ 24 € de l'heure), ces 2 heures valent ≈ <strong>47 €</strong>. Par semaine.",
        ]),
        p("47 €, c'est justement le prix du Pass Starter : 3 parcours, 23 leçons, accès à vie. On y apprend la méthode qui fait la différence : contexte, structure, vérification."),
        cta("Voir le Pass Starter", lien("/tarifs", "lead_a2")),
        sources([SRC.noyZhang, SRC.bcg, SRC.anthropicGains, SRC.insee]),
        p("Alexandre"),
      ],
      d,
    ),

  // ── A3 · J+5 · l'objection « gratuit ailleurs » ──────────────────────────
  lead_a3: (prenom, d) =>
    rendre(
      "« Je trouverai bien sur YouTube »",
      [
        p(greeting(prenom)),
        p("Probablement. Tu trouveras des vidéos, des threads, des prompts en vrac."),
        p("Le problème n'est pas l'accès à l'information. Elle est en anglais, dispersée, et elle vieillit vite : les modèles, les réglages et les outils de Claude changent tous les mois. Un tuto d'il y a six mois peut t'apprendre un réglage qui n'existe plus."),
        p("ClaudeAI Academy, c'est l'inverse : un parcours structuré, en français, et tenu à jour. Concrètement, aujourd'hui :"),
        bullets([
          `dernière vérification du contenu : <strong>${CONTENU_A_JOUR_AU}</strong> ;`,
          `<strong>${NOTES_DE_MISE_A_JOUR} notes de mise à jour</strong> datées dans les leçons, pour voir ce qui a changé et quand ;`,
          `<strong>${SOURCES_SURVEILLEES} sources officielles</strong> surveillées en continu (notes de version, documentation, annonces).`,
        ]),
        p("Tu paies une fois, les mises à jour suivent, à vie."),
        cta("Voir le Pass Starter, 47 €", lien("/tarifs", "lead_a3")),
        p(GARANTIE),
        p("Alexandre"),
      ],
      d,
    ),

  // ── A4 · J+7 · ce qu'il y a derrière 47 € ────────────────────────────────
  lead_a4: (prenom, d) =>
    rendre(
      "Ce qu'il y a derrière les 47 €",
      [
        p(greeting(prenom)),
        p("Pas de promesse floue : voici exactement ce que débloque le Pass Starter."),
        bullets([
          "<strong>Bien démarrer avec Claude</strong> (8 leçons) : choisir son plan et son modèle, régler Claude, lui dire qui tu es, mémoire et projets pour un contexte durable.",
          "<strong>Prompt Engineering pro</strong> (7 leçons) : clarté, contexte, exemples, structure XML, rôle, raisonnement et auto-correction.",
          "<strong>Claude Code et l'IA agentique</strong> (8 leçons) : faire travailler Claude sur tes fichiers et tes outils, skills, hooks, MCP, sous-agents.",
        ]),
        p("23 leçons, accès à vie, mises à jour comprises. Claude Code est inclus dans l'abonnement Claude Pro (20 $ par mois) : pas d'outil de plus à payer pour suivre le troisième parcours."),
        p(GARANTIE),
        cta("Commencer avec le Pass Starter", lien("/tarifs", "lead_a4")),
        sources([SRC.pricing]),
        p("Alexandre"),
      ],
      d,
    ),

  // ── A5 · J+10 · le calcul, puis la suite ──────────────────────────────────
  lead_a5: (prenom, d) =>
    rendre(
      "47 €, rentabilisés en 2 heures (ou moins)",
      [
        p(greeting(prenom)),
        p("Avant de passer aux cas concrets, le Pass Starter en chiffres plutôt qu'en arguments :"),
        calcul([
          "Développeur freelance (576 € par jour sur Malt) : 47 € = <strong>34 minutes</strong> facturées.",
          "Rédacteur ou community manager (439 € par jour) : 47 € = <strong>45 minutes</strong>.",
          "Salarié au salaire brut moyen (≈ 24 € de l'heure, INSEE) : 47 € = <strong>2 heures</strong>.",
        ]),
        p("Autrement dit, la formation est rentabilisée dès la première ou la deuxième heure récupérée. Le reste, c'est du temps rendu, chaque semaine."),
        cta("Voir le Pass Starter", lien("/tarifs", "lead_a5")),
        p(`Et si tu veux tout de suite le chemin complet (data, contenu et marketing, stratégie, agents IA), le Pass Mastery couvre les 9 parcours et 57 leçons, avec le Mentor IA : ${MASTERY_PRIX}.`),
        p("À partir de la semaine prochaine, je change de format : <strong>un cas concret par semaine</strong>. Une vraie entreprise ou un vrai métier, ce que Claude y fait, et ce que ça vaut en heures et en euros. Tu peux te désinscrire en un clic en bas de chaque email."),
        sources([SRC.malt, SRC.insee]),
        p("Alexandre"),
      ],
      d,
    ),

  // ── B1 · l'administratif des indépendants ─────────────────────────────────
  lead_b1: (prenom, d) =>
    rendre(
      "Cas n° 1 : la demi-journée d'admin que Qonto rend aux indépendants",
      [
        p(greeting(prenom)),
        p("Quand tu as pris le kit ClaudeAI Academy, je t'ai promis un usage concret de Claude par semaine. Voici le premier, et il est français : une vraie entreprise, ce que Claude y fait, et ce que ça vaut en heures et en euros."),
        h("Le cas"),
        p("Qonto, la banque en ligne des indépendants et des TPE, a intégré Claude dans ses outils d'administratif. Le constat de départ, mesuré par Forrester pour Qonto : ses clients passent <strong>jusqu'à 8 heures par mois</strong> sur l'admin financière. Avec les nouveaux outils, un entrepreneur seul récupère <strong>une demi-journée par mois</strong> ; les factures se créent 3 fois plus vite."),
        h("Le calcul"),
        calcul([
          "Une demi-journée, c'est environ 4 heures par mois.",
          "Pour un rédacteur freelance (439 € par jour sur Malt, ≈ 63 € de l'heure) : ≈ <strong>250 € de temps facturable</strong> récupéré chaque mois.",
        ]),
        h("Ce que tu peux faire toi-même, sans attendre ta banque"),
        bullets([
          "un projet Claude qui connaît tes tarifs, tes clients et tes modèles : devis et factures rédigés en une phrase ;",
          "les relances de paiement, polies puis fermes, écrites dans ton ton ;",
          "le tri d'un export bancaire : catégories, anomalies, ce qui manque pour le comptable.",
        ]),
        p("Le contexte durable (projets, mémoire, instructions) s'apprend dans le premier parcours du Pass Starter."),
        cta("Voir le Pass Starter, 47 €", lien("/tarifs", "lead_b1")),
        sources([SRC.qonto, SRC.malt]),
        p("La semaine prochaine : construire un outil sur mesure sans être développeur.<br />Alexandre"),
      ],
      d,
    ),

  // ── B2 · Claude Code pour non-développeurs ────────────────────────────────
  lead_b2: (prenom, d) =>
    rendre(
      "Cas n° 2 : un outil sur mesure, sans être développeur",
      [
        p(greeting(prenom)),
        h("Le cas"),
        p("Chez Liberty Trailers, la directrice financière Ashley Wells le résume ainsi : des tableaux de bord qui demandaient <strong>des semaines, voire des mois</strong>, l'équipe les construit maintenant <strong>en un ou deux jours</strong> avec Claude."),
        p("Ce n'est pas réservé aux développeurs. Claude Code lit tes fichiers, écrit le code, le lance et corrige ses erreurs ; toi, tu décris le résultat voulu et tu vérifies. Le code est d'ailleurs l'usage n° 1 de Claude : 35 % des conversations selon Anthropic."),
        h("Ce que ça vaut"),
        calcul([
          "Un développeur freelance affiche 576 € par jour sur Malt.",
          "Un livrable vendu au forfait qui prenait une semaine et en prend deux jours libère 3 jours pour un autre client : ≈ <strong>1 700 € de capacité</strong> en plus.",
          "Côté salarié ou dirigeant : l'outil existe enfin, au lieu d'attendre un budget de développement.",
        ]),
        p("Exemples réalistes pour commencer : un tableau de bord sur un export Excel, un générateur de devis, un petit site vitrine, un script qui range tes fichiers."),
        p("Le troisième parcours du Pass Starter, <strong>Claude Code et l'IA agentique</strong> (8 leçons), part de zéro. Claude Code est inclus dans l'abonnement Claude Pro."),
        cta("Voir le Pass Starter, 47 €", lien("/tarifs", "lead_b2")),
        sources([SRC.petitesBoites, SRC.indexMars, SRC.malt, SRC.pricing]),
        p("La semaine prochaine : produire plus de contenu sans perdre ta voix.<br />Alexandre"),
      ],
      d,
    ),

  // ── B3 · contenu et marketing ─────────────────────────────────────────────
  lead_b3: (prenom, d) =>
    rendre(
      "Cas n° 3 : plus de contenu, sans perdre ta voix",
      [
        p(greeting(prenom)),
        h("Le cas"),
        p("ChatPlace équipe des créateurs solo sur Instagram. Selon l'entreprise, Claude leur fait gagner <strong>15 à 20 heures par semaine</strong> sur la production de contenu et la gestion des messages privés, et les utilisateurs actifs voient leurs revenus progresser de 15 à 40 %. Ce sont les chiffres de l'éditeur sur ses propres clients : à prendre comme un signal, pas comme une moyenne."),
        p("Le piège, c'est le contenu « qui sent l'IA ». Par défaut, Claude écrit correct et sans relief. La différence se joue dans le brief : ta voix, tes exemples, tes interdits."),
        h("Le calcul, en hypothèse basse"),
        calcul([
          "Prends le bas de la fourchette et divise-le par trois : 5 heures récupérées par semaine.",
          "Au tarif rédacteur ou community manager sur Malt (439 € par jour, ≈ 63 € de l'heure) : ≈ <strong>310 € de capacité par semaine</strong>.",
          "Le débouché concret : un pack mensuel de contenus pour 2 ou 3 commerces de ton secteur.",
        ]),
        p("C'est le parcours <strong>Contenu et marketing avec Claude</strong> du Pass Mastery : pourquoi Claude est médiocre par défaut, le brief de voix de marque, industrialiser sans perdre la voix, l'email qui convertit, mesurer sans halluciner."),
        cta("Voir le Pass Mastery", lien("/tarifs", "lead_b3")),
        sources([SRC.chatplace, SRC.malt]),
        p("La semaine prochaine : 21 heures par semaine rendues à un dirigeant.<br />Alexandre"),
      ],
      d,
    ),

  // ── B4 · agents et automatisation ─────────────────────────────────────────
  lead_b4: (prenom, d) =>
    rendre(
      "Cas n° 4 : 21 heures par semaine rendues à un dirigeant",
      [
        p(greeting(prenom)),
        h("Le cas"),
        p("Pat Miller anime une communauté de patrons de petites entreprises. Avec Cowork, le mode de Claude qui prend en charge des tâches complètes, il dit économiser <strong>plus de 21 heures par semaine</strong>. Son mot : ça a « complètement changé » son activité."),
        p("C'est la bascule en cours : dans les données d'Anthropic, <strong>45 %</strong> des conversations sur Claude.ai consistent déjà à lui confier une tâche entière plutôt qu'à se faire aider."),
        h("Ce que ça vaut"),
        calcul([
          "21 heures au salaire brut moyen français (≈ 24 € de l'heure, INSEE) : ≈ <strong>500 € par semaine</strong> de temps de travail.",
          "Côté freelance, c'est un service qui se vend : mettre en place pour une PME un agent qui trie les demandes entrantes, prépare les relances ou compile le reporting du lundi.",
        ]),
        p("Un agent qui agit seul demande des garde-fous : budget, secrets, droits limités, journal de ce qu'il fait. C'est ce qui sépare une démo d'un outil en production."),
        p("Le parcours <strong>Construire ton agent IA avec Claude</strong> du Pass Mastery couvre tout le chemin : choisir le bon type d'agent, Claude dans n8n, l'Agent SDK, la mise en production et la sécurité."),
        cta("Voir le Pass Mastery", lien("/tarifs", "lead_b4")),
        sources([SRC.petitesBoites, SRC.indexJanv, SRC.insee]),
        p("La semaine prochaine : 180 000 dollars retrouvés dans des factures.<br />Alexandre"),
      ],
      d,
    ),

  // ── B5 · data ─────────────────────────────────────────────────────────────
  lead_b5: (prenom, d) =>
    rendre(
      "Cas n° 5 : 180 000 $ retrouvés dans des factures",
      [
        p(greeting(prenom)),
        h("Le cas"),
        p("Rebel Cheese est une petite entreprise. Avec Claude, l'équipe a repéré des surfacturations sur ses frais de transport. Sa cofondatrice, Kirsten Maitland : « nous avons récupéré environ <strong>180 000 $</strong> »."),
        p("C'est typiquement l'analyse que personne n'a le temps de faire à la main. Dans beaucoup d'entreprises, les données sont là et l'analyse ne se fait jamais."),
        h("Ce que ça vaut"),
        calcul([
          "Un expert data freelance affiche en moyenne 666 € par jour sur Malt.",
          "Le débouché concret : un audit ponctuel pour une PME (factures fournisseurs, abonnements oubliés, marges par produit), livré avec les requêtes et la méthode pour le refaire.",
        ]),
        p("La condition : vérifier chaque chiffre. Une requête SQL fausse donne un résultat faux avec beaucoup d'aplomb. Le parcours <strong>Claude pour data et SQL</strong> du Pass Mastery y consacre une leçon entière, en plus de générer du SQL fiable, l'optimiser, explorer les anomalies et livrer des synthèses."),
        cta("Voir le Pass Mastery", lien("/tarifs", "lead_b5")),
        sources([SRC.petitesBoites, SRC.malt]),
        p("La semaine prochaine : pourquoi ce sont les débutants qui gagnent le plus.<br />Alexandre"),
      ],
      d,
    ),

  // ── B6 · rédaction experte, et les débutants ──────────────────────────────
  lead_b6: (prenom, d) =>
    rendre(
      "Cas n° 6 : 8 à 15 heures de rédaction ramenées à 30 minutes",
      [
        p(greeting(prenom)),
        h("Le cas"),
        p("Chez EvenUp, outil de rédaction pour les avocats, une rédaction qui demandait <strong>8 à 15 heures</strong> de travail qualifié revient aujourd'hui sous forme de brouillon fini <strong>en 30 minutes environ</strong>. Chez GC AI, les juristes d'entreprise interrogés (plus de 100 clients) déclarent gagner <strong>14 heures par semaine</strong> en moyenne."),
        h("Le plus intéressant"),
        p("Ce ne sont pas les experts qui gagnent le plus. Dans une étude de terrain portant sur 5 172 conseillers de service client, la productivité augmente de 15 % en moyenne, et d'environ <strong>30 % pour les moins expérimentés</strong>. Même constat au BCG : +43 % pour les consultants sous la moyenne, +17 % pour les meilleurs. (Ces deux études utilisaient des modèles GPT, pas Claude.)"),
        p("Si tu te sens « pas assez technique » pour l'IA, c'est précisément toi qui as le plus à y gagner. À une condition : apprendre à cadrer la demande et à relire."),
        p("C'est l'objet du parcours <strong>Prompt Engineering pro</strong>, dans le Pass Starter : 7 leçons, de la clarté au raisonnement en plusieurs étapes."),
        cta("Voir le Pass Starter, 47 €", lien("/tarifs", "lead_b6")),
        sources([SRC.evenup, SRC.gcai, SRC.brynjolfsson, SRC.bcg]),
        p("La semaine prochaine : trois façons réalistes de gagner de l'argent avec Claude.<br />Alexandre"),
      ],
      d,
    ),

  // ── B7 · créer un business ────────────────────────────────────────────────
  lead_b7: (prenom, d) =>
    rendre(
      "Cas n° 7 : trois façons réalistes de gagner de l'argent avec Claude",
      [
        p(greeting(prenom)),
        p("On te vend souvent « le business IA qui tourne tout seul ». Ce n'est pas ce que montrent les données. Voici ce qui tient debout."),
        h("1. Ton métier, en plus rapide"),
        p("Tu vends ce que tu sais déjà faire, mais tu livres plus vite et mieux. Au forfait plutôt qu'au temps passé, le gain de temps devient de la marge. Repères Malt : 439 € par jour en rédaction, 576 € en développement, 666 € en data."),
        h("2. Le service productisé"),
        p("Un livrable fixe, à prix fixe, où Claude fait le gros du travail et toi le jugement : audit de factures, pack de contenus mensuel, mise en place d'un agent de tri des demandes. Les cas des semaines précédentes en sont tous des exemples."),
        h("3. Le petit outil"),
        p("Avec Claude Code, un outil de niche (générateur de devis, tableau de bord métier) se construit en jours, pas en mois, puis se vend ou s'utilise pour vendre un service."),
        h("Ce qui ne marche pas"),
        p("Vendre ce que ton client fera bientôt seul. Dans l'enquête d'Anthropic sur près de 10 000 utilisateurs, <strong>27 %</strong> disent déjà économiser sur des services qu'ils auraient achetés. La valeur reste là où il faut du jugement : 57 % des répondants estiment que leurs compétences valent plus qu'avant."),
        p("Le parcours <strong>Stratégie et conduite IA</strong> du Pass Mastery t'apprend à choisir le bon cas d'usage et à calculer le vrai coût d'un projet IA, avant d'y mettre du temps."),
        cta("Voir le Pass Mastery", lien("/tarifs", "lead_b7")),
        sources([SRC.malt, SRC.indexJuin]),
        p("La semaine prochaine, le dernier email de cette série : les sept cas en une page.<br />Alexandre"),
      ],
      d,
    ),

  // ── B8 · récapitulatif et offre ───────────────────────────────────────────
  lead_b8: (prenom, d) =>
    rendre(
      "Les 7 cas en une page (et la suite)",
      [
        p(greeting(prenom)),
        p("Sept semaines, sept cas réels. En une page :"),
        bullets([
          "<strong>Admin</strong> : une demi-journée par mois rendue aux indépendants (Qonto).",
          "<strong>Outils sur mesure</strong> : des tableaux de bord en un ou deux jours au lieu de semaines (Liberty Trailers).",
          "<strong>Contenu</strong> : 15 à 20 heures par semaine selon l'éditeur, pour des créateurs solo (ChatPlace).",
          "<strong>Agents</strong> : plus de 21 heures par semaine pour un dirigeant (Cowork).",
          "<strong>Data</strong> : 180 000 $ de surfacturations retrouvées (Rebel Cheese).",
          "<strong>Rédaction experte</strong> : de 8 à 15 heures à 30 minutes (EvenUp), et les débutants qui progressent le plus.",
          "<strong>Business</strong> : ton métier en plus rapide, le service productisé, le petit outil.",
        ]),
        p("Le point commun : aucun de ces résultats ne vient d'un prompt magique. Ils viennent d'une méthode (contexte, procédure, vérification) appliquée à un vrai problème."),
        h("Les deux façons de l'apprendre"),
        bullets([
          `<strong>Pass Starter, 47 €</strong> : les 3 parcours fondateurs, 23 leçons. Pour poser la méthode.`,
          `<strong>Pass Mastery, ${MASTERY_PRIX}</strong> : les 9 parcours, 57 leçons, 170 prompts, le Mentor IA et l'examen de certification. Pour aller jusqu'aux agents, à la data et au business.`,
        ]),
        p(GARANTIE),
        cta("Choisir mon pass", lien("/tarifs", "lead_b8")),
        p("C'était le dernier email de cette série. Merci de m'avoir lu jusqu'ici ; si une question te bloque, réponds simplement à cet email, je lis tout."),
        p("Alexandre"),
      ],
      d,
    ),
};

export function renderLeadEmail(
  kind: LeadEmailKind,
  firstName: string | null,
  leadId?: string,
): Rendered {
  return EMAILS[kind](firstName, leadId ? lienDesinscription(leadId) : null);
}

export async function sendLeadEmail(params: {
  kind: LeadEmailKind;
  to: string;
  firstName: string | null;
  leadId: string;
}): Promise<boolean> {
  const r = renderLeadEmail(params.kind, params.firstName, params.leadId);
  return sendEmail({
    to: params.to,
    subject: r.subject,
    html: r.html,
    text: r.text,
    kind: params.kind,
    headers: enTetesDesinscription(params.leadId),
  });
}
