#!/usr/bin/env node
// =========================================
// ClaudeAI Academy — Vérificateur de faits périssables
//
// Usage : node scripts/veille/check-facts.mjs [--json]
//
// Prix du Pass Mastery : lus dans src/lib/offre/prix.ts (497 € jusqu'au
// 31/10/2026, 697 € dès le 01/11/2026, heure de Paris), au jour de l'exécution.
// Pour simuler un autre jour (comme le site en développement) :
//   PowerShell : $env:OFFRE_DATE_TEST = "2026-11-01T09:00:00+01:00"; node scripts/veille/check-facts.mjs
//   (puis Remove-Item Env:OFFRE_DATE_TEST)
//
// Répond à la seule question qui compte avant de toucher au contenu :
//   « quelle phrase, dans quel fichier, est devenue fausse ? »
//
// Ne réécrit RIEN. Produit un ordre de travail. La correction reste un geste
// délibéré — réécrire 48 leçons sans relecture est le geste le plus risqué de
// ce business : un tarif faux dans une formation payante est pire qu'un
// tarif vieux de deux semaines.
//
// Sortie : code 0 si rien n'est prouvé faux, 1 si une phrase du site contredit
// sa source (à corriger), 2 si le vérificateur lui-même a échoué. Une simple
// relecture demandée (la source a bougé) ne vaut jamais un code 1.
// =========================================

import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { FAITS } from "./facts.mjs";
import { SOURCES } from "./sources.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const RACINE = join(HERE, "..", "..");
const CHANGES_PATH = join(HERE, ".last-changes.json");
const REVUES_PATH = join(HERE, "revues.json");
const JSON_MODE = process.argv.includes("--json");
// --telegram : une ligne par point, pas de « pourquoi », pas de liste des
// alignés. C'est ce qui part sur le téléphone ; la version longue reste la
// sortie normale, pour le terminal.
const TELEGRAM_MODE = process.argv.includes("--telegram");

// ── Vérifications locales : comparer la promesse à ce qu'on livre vraiment ──

async function compterPrompts() {
  const { readdirSync, readFileSync } = await import("node:fs");
  const dir = join(RACINE, "src/lib/prompts/categories");
  let total = 0;
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
    const j = JSON.parse(readFileSync(join(dir, f), "utf8"));
    total += Array.isArray(j) ? j.length : (j.prompts || []).length;
  }
  return String(total);
}

/** Compte les leçons déclarées par les générateurs de contenu (source de vérité du dépôt). */
async function compterLecons() {
  const { readdirSync, readFileSync } = await import("node:fs");
  const dir = join(RACINE, "scripts/content");
  let total = 0;
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".mjs"))) {
    total += (readFileSync(join(dir, f), "utf8").match(/^\s{4,6}title:\s*"/gm) || []).length;
  }
  return String(total);
}

async function compterParcours() {
  const { readdirSync } = await import("node:fs");
  return String(readdirSync(join(RACINE, "scripts/content")).filter((f) => f.endsWith(".mjs")).length);
}

/** Le catalogue Starter, c'est-a-dire les parcours accessibles au premier
 *  palier. Chiffre affiche sur la page tarifs et dans l'espace compte : il
 *  reste en arriere des qu'on ajoute une lecon a l'un de ces parcours. */
async function compterLeconsStarter() {
  const { readdirSync, readFileSync } = await import("node:fs");
  const dir = join(RACINE, "scripts/content");
  let total = 0;
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".mjs"))) {
    const src = readFileSync(join(dir, f), "utf8");
    if (!/tier_required:\s*"starter"/.test(src)) continue;
    total += (src.match(/^\s{4,6}title:\s*"/gm) || []).length;
  }
  // Chaine, comme les autres compteurs : la valeur lue dans le contenu vient
  // d'un regex, donc d'une chaine. Un nombre ici et tout ressort « FAUX ».
  return String(total);
}

/** Les parcours que seul le Pass Mastery ouvre : tout ce qui n'est pas au
 *  palier Starter. C'est ce que l'upgrade promet (« les six autres »). */
async function compterParcoursMastery() {
  const { readdirSync, readFileSync } = await import("node:fs");
  const dir = join(RACINE, "scripts/content");
  const fichiers = readdirSync(dir).filter((f) => f.endsWith(".mjs"));
  const starter = fichiers.filter((f) => /tier_required:\s*"starter"/.test(readFileSync(join(dir, f), "utf8")));
  return String(fichiers.length - starter.length);
}

/** Tous les en-têtes de blocs `:::maj` des générateurs de contenu. */
async function entetesMaj() {
  const { readdirSync, readFileSync } = await import("node:fs");
  const dir = join(RACINE, "scripts/content");
  const entetes = [];
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".mjs"))) {
    for (const m of readFileSync(join(dir, f), "utf8").matchAll(/^:::maj (.+?)\r?$/gm)) entetes.push(m[1]);
  }
  return entetes;
}

async function compterBlocsMaj() {
  return String((await entetesMaj()).length);
}

/** La date la plus récente portée par un bloc `:::maj`, au format affiché
 *  sur le site (« 29 septembre 2026 », « 1er septembre 2026 »). Un en-tête peut
 *  porter une plage (« 22 au 29 septembre 2026 ») : on lit la dernière date. */
async function dernierBlocMaj() {
  const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  let max = null;
  for (const entete of await entetesMaj()) {
    for (const m of entete.matchAll(/(\d{1,2})(?:er)? (\p{L}+) (\d{4})/gu)) {
      const mois = MOIS.indexOf(m[2].toLowerCase());
      if (mois < 0) continue;
      const cle = Number(m[3]) * 10000 + (mois + 1) * 100 + Number(m[1]);
      if (!max || cle > max.cle) max = { cle, jour: Number(m[1]), mois, annee: m[3] };
    }
  }
  if (!max) return null;
  return `${max.jour === 1 ? "1er" : max.jour} ${MOIS[max.mois]} ${max.annee}`;
}

async function compterSources() {
  const { SOURCES } = await import("./sources.mjs");
  return String(SOURCES.length);
}

/** L'instant de référence, comme `maintenant()` dans src/lib/offre/prix.ts :
 *  `OFFRE_DATE_TEST` (date ISO) simule un autre jour, pour vérifier la bascule
 *  du 01/11/2026 avant qu'elle arrive. */
function instantDeReference() {
  const force = process.env.OFFRE_DATE_TEST;
  if (force) {
    const d = new Date(force);
    if (Number.isNaN(d.getTime())) throw new Error(`OFFRE_DATE_TEST illisible : « ${force} »`);
    return d;
  }
  return new Date();
}

/** Le prix daté du Pass Mastery, lu dans « src/lib/offre/prix.ts » (décision du
 *  16/10/2026 : 497 € jusqu'au 31/10/2026 inclus, 697 € dès le 01/11/2026 à
 *  minuit, heure de Paris). Jusqu'au 16/10/2026, il était lu dans `amountEur`
 *  de plans.ts ; c'est désormais une expression (`prixMastery(at)`), plus un
 *  littéral. Lu par regex, comme plans.ts : le fichier est en TypeScript et ce
 *  vérificateur doit tourner sans compilation ni .env.local. */
async function offreMastery() {
  const src = await readFile(join(RACINE, "src/lib/offre/prix.ts"), "utf8");
  const lire = (motif, nom) => {
    const m = src.match(motif);
    if (!m) throw new Error(`${nom} introuvable dans src/lib/offre/prix.ts`);
    return m[1];
  };
  const avant = Number(lire(/PRIX_MASTERY_AVANT = (\d+);/, "PRIX_MASTERY_AVANT"));
  const apres = Number(lire(/PRIX_MASTERY_APRES = (\d+);/, "PRIX_MASTERY_APRES"));
  const hausseLe = new Date(lire(/MASTERY_HAUSSE_LE = new Date\("([^"]+)"\)/, "MASTERY_HAUSSE_LE"));
  if (Number.isNaN(hausseLe.getTime())) throw new Error("MASTERY_HAUSSE_LE illisible dans src/lib/offre/prix.ts");
  const appliquee = instantDeReference() >= hausseLe;
  return { avant, apres, hausseLe, appliquee, duJour: appliquee ? apres : avant };
}

/** « 1er novembre », « 31 octobre » : un jour tel que le site l'écrit, à Paris. */
function jourLibelle(date) {
  const parts = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", day: "numeric", month: "long" })
    .formatToParts(date);
  const jour = Number(parts.find((p) => p.type === "day").value);
  const mois = parts.find((p) => p.type === "month").value;
  return `${jour === 1 ? "1er" : jour} ${mois}`;
}

/** Valeur du jour, plus la valeur future tant que la hausse n'est qu'annoncée :
 *  avant le 01/11/2026, « 697 € à partir du 1er novembre » est exact et ne doit
 *  pas ressortir FAUX. Après, seul 697 est accepté : un 497 oublié ressort. */
function avecHausseAnnoncee(o, duJour, futur, ancien) {
  // `periodes` : les deux prix d'une clause DATÉE (CGV : « 497 € jusqu'au
  // 31 octobre 2026 inclus ; 697 € à partir du 1er novembre »). Une telle
  // clause reste exacte après la bascule et doit citer les deux, toujours.
  const periodes = [ancien, futur];
  if (o.appliquee || duJour === futur) return { valeur: duJour, acceptees: [duJour], periodes };
  return {
    valeur: duJour,
    acceptees: [duJour, futur],
    periodes,
    note: `${futur} accepté, hausse annoncée pour le ${jourLibelle(o.hausseLe)}`,
  };
}

/** Le tiers d'un prix, arrondi au centime SUPÉRIEUR, écrit à la française :
 *  497 → « 165,67 », 697 → « 232,34 ». Même formule que `mensualiteKlarna3x()`
 *  du module (l'arrondi intermédiaire au millionième évite qu'une erreur de
 *  virgule flottante fasse monter d'un centime un tiers exact). */
function tiersAuCentimeSuperieur(prix) {
  return (Math.ceil(Math.round((prix / 3) * 1e6) / 1e4) / 100).toFixed(2).replace(".", ",");
}

/** Les prix que Stripe facture pour le Starter et l'Accompagnement, lus dans
 *  « src/lib/stripe/plans.ts » (amountEur). Lus par regex plutôt qu'importés :
 *  le fichier est en TypeScript et getPlan() exige les identifiants de prix
 *  Stripe en variables d'environnement. Le motif est borné à son `case` : un
 *  motif paresseux non borné avait lu, le 16/10/2026, le 1497 de l'Accompagnement
 *  comme prix du Mastery dès que celui-ci est devenu une expression. */
async function prixDesPass() {
  const src = await readFile(join(RACINE, "src/lib/stripe/plans.ts"), "utf8");
  const prix = {};
  for (const code of ["starter", "elite"]) {
    const m = src.match(new RegExp(String.raw`case "${code}":(?:(?!case ")[\s\S])*?amountEur: (\d+)`));
    if (!m) throw new Error(`amountEur introuvable pour « ${code} » dans plans.ts`);
    prix[code] = Number(m[1]);
  }
  prix.mastery = (await offreMastery()).duJour;
  return prix;
}

// Chaînes sans séparateur de milliers (« 1497 ») : la forme canonique vers
// laquelle le registre ramène « 1 497 » et « 1&nbsp;497 » avant de comparer.
const prixPassStarter = async () => String((await prixDesPass()).starter);
const prixPassAccompagnement = async () => String((await prixDesPass()).elite);

/** Prix du Mastery du jour (497 puis 697), et 697 accepté tant qu'il est annoncé. */
async function prixPassMastery() {
  const o = await offreMastery();
  return avecHausseAnnoncee(o, String(o.duJour), String(o.apres), String(o.avant));
}

/** Ce que Klarna prélève trois fois pour le Mastery : le tiers du prix du jour,
 *  au centime supérieur (« 165,67 », puis « 232,34 »). Dérivé du module plutôt
 *  qu'écrit en dur : si le Mastery change, la mensualité suit. */
async function mensualiteKlarnaMastery() {
  const o = await offreMastery();
  return avecHausseAnnoncee(
    o,
    tiersAuCentimeSuperieur(o.duJour),
    tiersAuCentimeSuperieur(o.apres),
    tiersAuCentimeSuperieur(o.avant),
  );
}

/** Idem pour l'Accompagnement (« 499 » quand il est à 1 497 €) : valeur à
 *  ignorer quand on cherche la mensualité du Mastery dans les mêmes fichiers. */
async function mensualiteKlarnaAccompagnement() {
  const { elite } = await prixDesPass();
  return tiersAuCentimeSuperieur(elite).replace(/,00$/, "");
}

/** Ce que le checkout facture pour le Mastery : `amountEur` de plans.ts doit
 *  appeler le module (`prixMastery(at)`). Un littéral n'est accepté que s'il
 *  vaut le prix DU JOUR : 697 avant le 01/11 ferait payer la hausse trop tôt,
 *  497 après la ferait oublier. */
async function montantFactureMastery() {
  const o = await offreMastery();
  return { valeur: String(o.duJour), acceptees: [String(o.duJour), "prixMastery()"] };
}

/** Les libellés du module doivent dire la même date que MASTERY_HAUSSE_LE. */
async function libelleHausseMastery() {
  return jourLibelle((await offreMastery()).hausseLe);
}
async function dernierJourPrixMastery() {
  return jourLibelle(new Date((await offreMastery()).hausseLe.getTime() - 1));
}

const LOCALES = {
  compterPrompts,
  compterLecons,
  compterParcours,
  compterLeconsStarter,
  compterParcoursMastery,
  compterBlocsMaj,
  dernierBlocMaj,
  compterSources,
  prixPassStarter,
  prixPassMastery,
  prixPassAccompagnement,
  mensualiteKlarnaMastery,
  mensualiteKlarnaAccompagnement,
  montantFactureMastery,
  libelleHausseMastery,
  dernierJourPrixMastery,
};

/** Une vérification locale rend une chaîne, ou { valeur, acceptees, note }
 *  quand plusieurs valeurs sont exactes en même temps (prix du jour et hausse
 *  annoncée). Ramène les deux formes à la seconde. */
async function valeurLocale(fn) {
  const r = await LOCALES[fn]();
  return r !== null && typeof r === "object" ? r : { valeur: r };
}

// ── Lecture de ce que le contenu affirme aujourd'hui ─────────────────────────

async function valeursAffirmees(fait) {
  const trouvees = [];
  // Une même valeur peut s'écrire de plusieurs façons (« 1 497 », « 1&nbsp;497 »,
  // « 1497 ») : le fait peut fournir `canon` pour les ramener à une forme unique.
  const canon = fait.canon ?? ((v) => v);
  // Valeurs légitimes d'un AUTRE fait dans les mêmes fichiers (la mensualité
  // de l'Accompagnement à côté de celle du Mastery) : on ne les lit pas.
  const exclues = fait.exclureValeurs?.kind === "local"
    ? [canon(String((await valeurLocale(fait.exclureValeurs.fn)).valeur))]
    : [];
  for (const emplacement of fait.ou) {
    const chemin = join(RACINE, emplacement.fichier);
    if (!existsSync(chemin)) {
      trouvees.push({ fichier: emplacement.fichier, valeur: null, note: "fichier introuvable" });
      continue;
    }
    if (!emplacement.motif) {
      trouvees.push({ fichier: emplacement.fichier, valeur: null, note: "revue humaine" });
      continue;
    }
    const texte = await readFile(chemin, "utf8");
    const motif = new RegExp(emplacement.motif.source, emplacement.motif.flags.includes("g")
      ? emplacement.motif.flags
      : emplacement.motif.flags + "g");
    const vues = [...texte.matchAll(motif)].map((m) => canon(m[1]))
      .filter((v) => !exclues.includes(v));
    const lignes = [];
    texte.split("\n").forEach((l, i) => {
      if (new RegExp(emplacement.motif.source, emplacement.motif.flags).test(l)) lignes.push(i + 1);
    });
    // Plus de littéral, mais le prix est lu dans le module daté (src/lib/offre/prix.ts) :
    // l'emplacement n'est pas muet, il ne peut plus diverger. Un littéral restant
    // est, lui, toujours lu et comparé ci-dessus.
    if (!vues.length && emplacement.dynamique?.test(texte)) {
      trouvees.push({ fichier: emplacement.fichier, valeur: null, valeurs: [], lignes: [], note: "dynamique" });
      continue;
    }
    const valeurs = [...new Set(vues)];
    trouvees.push({
      fichier: emplacement.fichier,
      valeur: valeurs.length ? valeurs.join(", ") : null,
      valeurs,
      periodes: Boolean(emplacement.periodes),
      lignes,
      note: vues.length ? null : "motif non trouvé — le contenu a peut-être été reformulé",
    });
  }
  return trouvees;
}

// ── Vérification ─────────────────────────────────────────────────────────────

async function valeurSource(fait, sourcesModifiees) {
  const v = fait.verif;
  if (v.kind === "local") return { ...(await valeurLocale(v.fn)), auto: true };
  if (v.kind === "http-regex") {
    try {
      const res = await fetch(v.url, { signal: AbortSignal.timeout(20000) });
      if (!res.ok) return { valeur: null, auto: true, erreur: `HTTP ${res.status}` };
      const m = (await res.text()).match(v.motif);
      return { valeur: m ? m[1] : null, auto: true, erreur: m ? null : "motif non trouvé" };
    } catch (e) {
      return { valeur: null, auto: true, erreur: e.message };
    }
  }
  // "revue" : rien à extraire. Le déclencheur est le mouvement de la source.
  const bougees = (v.sources || []).filter((s) => sourcesModifiees.includes(s));
  return { valeur: null, auto: false, bougees };
}

/** Acte qu'un fait a été relu et confirmé exact. Sans ça, le vérificateur
 *  redemanderait la même relecture à chaque passage — et on finirait par ne
 *  plus le lire. Un fait relu ne ressort que si sa source rebouge APRÈS. */
async function marquerRevu(ids, changes) {
  const { writeFile } = await import("node:fs/promises");
  const revues = existsSync(REVUES_PATH)
    ? JSON.parse(await readFile(REVUES_PATH, "utf8"))
    : {};
  const quand = changes.date || new Date().toISOString().slice(0, 10);
  for (const id of ids) {
    if (!FAITS.some((f) => f.id === id)) {
      console.error(`Fait inconnu : ${id}`);
      process.exit(2);
    }
    const fait = FAITS.find((f) => f.id === id);
    const src = await valeurSource(fait, changes.sourcesModifiees || []);
    // Pour un fait DATÉ (version courante…), on retient la valeur de la source
    // au moment de la relecture : il ne ressortira que si elle change encore.
    revues[id] = { revuLe: quand, note: "confirmé exact à la source", valeurSource: src.valeur ?? null };
    console.log(`✅ ${id} — relu et confirmé au ${quand}${src.valeur ? ` (source : ${src.valeur})` : ""}`);
  }
  await writeFile(REVUES_PATH, JSON.stringify(revues, null, 2), "utf8");
}

async function main() {
  const changes = existsSync(CHANGES_PATH)
    ? JSON.parse(await readFile(CHANGES_PATH, "utf8"))
    : { sourcesModifiees: [], date: null };
  const modifiees = changes.sourcesModifiees || [];

  const iRevu = process.argv.indexOf("--revu");
  if (iRevu !== -1) {
    await marquerRevu(process.argv.slice(iRevu + 1).filter((a) => !a.startsWith("--")), changes);
    return;
  }

  const revues = existsSync(REVUES_PATH)
    ? JSON.parse(await readFile(REVUES_PATH, "utf8"))
    : {};

  const aCorriger = [];
  const aRelire = [];
  const alignes = [];
  // Ce que le registre croit surveiller et ne surveille plus. Jusqu'au
  // 16/10/2026, un emplacement dont le motif ne trouvait plus rien était
  // simplement sauté, et le fait ressortait « aligné » sur les emplacements
  // restants : 20 copies de prix et de compteurs n'étaient plus contrôlées
  // (le tiret cadratin retiré du copy avait rendu leurs motifs muets). Et trois
  // faits attendaient des sources (« claude-blog », « eu-ai-act ») qui
  // n'existent pas dans sources.mjs : ils ne pouvaient jamais être relus.
  const muets = [];
  // Emplacements dont le prix est désormais lu dans src/lib/offre/prix.ts
  // (plus de littéral à comparer) : comptés et affichés, jamais cachés.
  const dynamiques = [];
  const idsSources = new Set(SOURCES.map((s) => s.id));
  const sourcesInconnues = [];

  for (const fait of FAITS) {
    const affirme = await valeursAffirmees(fait);
    for (const a of affirme) {
      if (a.note === "dynamique") dynamiques.push({ fait, fichier: a.fichier });
      else if (a.valeur === null && a.note !== "revue humaine") muets.push({ fait, fichier: a.fichier, note: a.note });
    }
    for (const id of fait.verif.sources || []) {
      if (!idsSources.has(id)) sourcesInconnues.push({ fait, id });
    }
    const src = await valeurSource(fait, modifiees);

    if (src.auto) {
      // Valeurs une à une (un fichier peut en porter deux : « 497 € », puis
      // « 697 € à partir du 1er novembre »), comparées à TOUTES les valeurs
      // exactes du moment, pas seulement à celle du jour.
      const canon = fait.canon ?? ((v) => v);
      // Clause datée (`periodes: true`, les CGV) : elle cite l'ancien ET le
      // nouveau prix, chacun avec sa période, et reste exacte après la bascule.
      // Elle n'est donc pas comparée au prix du jour : elle doit citer les deux.
      const periodes = (src.periodes ?? []).map((v) => canon(String(v)));
      const clausesFausses = affirme.filter((a) => a.periodes && a.valeurs?.length &&
        !(periodes.length && a.valeurs.length === periodes.length && periodes.every((v) => a.valeurs.includes(v))));
      const valeursDistinctes = [...new Set(affirme.filter((a) => !a.periodes).flatMap((a) => a.valeurs ?? []))];
      const acceptees = (src.acceptees ?? (src.valeur != null ? [src.valeur] : [])).map((v) => canon(String(v)));
      const derive = clausesFausses.length > 0 || (src.valeur && valeursDistinctes.some((v) =>
        fait.accepte ? !fait.accepte(v, src.valeur) : !acceptees.includes(v)));
      // Le prix du jour et la hausse annoncée côte à côte ne sont pas une contradiction.
      const incoherent = fait.accepte
        ? valeursDistinctes.length > 1
        : valeursDistinctes.length > 1 && valeursDistinctes.some((v) => !acceptees.includes(v));
      // Un fait non critique (DATÉ) déjà relu pour CETTE valeur de source ne
      // ressort pas : « Claude Code 2.1.289 » signalé trois fois par semaine
      // jusqu'à la prochaine passe, c'est ce qui fait ignorer le message.
      const dejaVu = fait.gravite !== "critique" && src.valeur &&
        revues[fait.id]?.valeurSource === src.valeur;
      if ((derive || incoherent) && !dejaVu) {
        // Les emplacements en cause, et eux seuls : un message qui cite aussi les
        // fichiers justes (le prix du jour bien écrit, une clause datée complète)
        // envoie relire ce qui n'a pas à l'être.
        const estFautif = (a) => a.periodes
          ? clausesFausses.includes(a)
          : (a.valeurs ?? []).some((v) => (fait.accepte ? !fait.accepte(v, src.valeur) : !acceptees.includes(v)));
        const fautifs = affirme.filter(estFautif);
        aCorriger.push({ fait, affirme, fautifs: fautifs.length ? fautifs : affirme, source: src, incoherent, clausesFausses, periodes });
      } else {
        alignes.push({ fait, valeur: src.valeur ?? valeursDistinctes[0], note: src.note });
      }
    } else if (src.bougees.length && (revues[fait.id]?.revuLe ?? "") < (changes.date ?? "")) {
      aRelire.push({ fait, affirme, bougees: src.bougees });
    } else {
      alignes.push({ fait, valeur: "—" });
    }
  }

  if (TELEGRAM_MODE) {
    // Lu sur un téléphone par quelqu'un qui n'a pas le code sous les yeux.
    // Une phrase par point, qui dit ce qui est faux (ou pas), et où. Les
    // identifiants techniques ne servent qu'à la commande d'acquittement, en bas.
    const court = (v) => String(v ?? "?").replace(/\s+/g, " ").slice(0, 40);
    const labelSource = (id) => SOURCES.find((x) => x.id === id)?.label ?? id;
    const fichiersDe = (x) => [...new Set((x.fautifs ?? x.affirme).filter((a) => a.valeur).map((a) =>
      a.fichier.replace(/^src\/(app|components|lib)\//, "").replace(/^scripts\/content\//, "leçons ").replace(/\/page\.tsx$/, "").replace(/\.(tsx|ts|mjs)$/, "")))]
      .slice(0, 3).join(", ");
    const ditPar = (x) => [...new Set((x.fautifs ?? x.affirme).map((a) => a.valeur).filter(Boolean))].join(" / ");
    const faux = aCorriger.filter((x) => x.fait.gravite === "critique");
    const dates = aCorriger.filter((x) => x.fait.gravite !== "critique");
    const L = [];
    for (const x of faux) {
      const clause = x.clausesFausses?.length
        ? ` Clause datée (CGV) : elle doit citer ${x.periodes.join(" et ")}, chacun avec sa période.`
        : "";
      L.push(`🔴 FAUX sur le site : ${x.fait.libelle}. Le site dit « ${court(ditPar(x))} », la source dit « ${court(x.source.valeur)} »${x.source.erreur ? ` (${x.source.erreur})` : ""}. Où : ${fichiersDe(x)}.${clause}`);
    }
    for (const x of dates) {
      L.push(`🟠 Daté, pas faux : ${x.fait.libelle}. Le site dit « ${court(ditPar(x))} », la source est à « ${court(x.source.valeur)} ». À rafraîchir à la prochaine passe.`);
    }
    // Une page qui bouge = une ligne, avec tout ce qu'elle oblige à relire.
    const parSource = new Map();
    for (const x of aRelire) for (const id of x.bougees) {
      if (!parSource.has(id)) parSource.set(id, []);
      parSource.get(id).push(x.fait.libelle);
    }
    for (const [id, libelles] of parSource) {
      L.push(`🟡 La page « ${labelSource(id)} » a changé. Rien de prouvé faux, mais à relire : ${libelles.join(" ; ")}.`);
    }
    for (const m of muets) {
      L.push(`🟡 Plus surveillé : ${m.fait.libelle}, dans ${m.fichier} (${m.note}). Le texte a changé ; à réancrer dans scripts/veille/facts.mjs.`);
    }
    for (const s of sourcesInconnues) {
      L.push(`🟡 Registre : « ${s.fait.libelle} » attend la source « ${s.id} », absente de sources.mjs. Ce fait ne sera jamais relu.`);
    }
    if (!L.length) L.push("✅ Rien à corriger dans le contenu.");
    const acquittables = [...new Set([...dates, ...aRelire].map((x) => x.fait.id))];
    if (acquittables.length) L.push(`\nQuand c'est relu, pour ne plus le voir : check-facts --revu ${acquittables.join(" ")}`);
    const n = alignes.length;
    L.push(`${n} fait${n > 1 ? "s" : ""} sur ${FAITS.length} vérifié${n > 1 ? "s" : ""} et exact${n > 1 ? "s" : ""}.`);
    console.log(L.join("\n"));
  } else if (JSON_MODE) {
    console.log(JSON.stringify({
      date: changes.date,
      aCorriger: aCorriger.map((x) => ({ id: x.fait.id, gravite: x.fait.gravite })),
      aRelire: aRelire.map((x) => ({ id: x.fait.id, gravite: x.fait.gravite, sources: x.bougees })),
      muets: muets.map((m) => ({ id: m.fait.id, fichier: m.fichier, note: m.note })),
      dynamiques: dynamiques.map((d) => ({ id: d.fait.id, fichier: d.fichier })),
      sourcesInconnues: sourcesInconnues.map((s) => ({ id: s.fait.id, source: s.id })),
      alignes: alignes.length,
    }, null, 2));
  } else {
    const critiques = aCorriger.filter((x) => x.fait.gravite === "critique");
    const relecturesPrioritaires = aRelire.filter((x) => x.fait.gravite === "critique");
    console.log(`\n🔎 Faits périssables — ${FAITS.length} suivis`);
    if (changes.date) console.log(`   (dernière détection de sources : ${changes.date})`);

    if (!aCorriger.length && !aRelire.length && !muets.length && !sourcesInconnues.length) {
      console.log(`\n✅ Tout est aligné. Rien à corriger dans le contenu.\n`);
    }

    if (muets.length) {
      console.log(`\n🟡 PLUS SURVEILLÉ — ${muets.length} emplacement(s) dont le motif ne lit plus rien`);
      for (const m of muets) console.log(`   ${m.fait.id} — ${m.fichier} : ${m.note}`);
      console.log(`   à réancrer dans scripts/veille/facts.mjs (le fait ressort « aligné » sans les contrôler)`);
    }
    for (const s of sourcesInconnues) {
      console.log(`\n🟡 REGISTRE — ${s.fait.id} attend la source « ${s.id} », absente de sources.mjs`);
    }

    for (const x of aCorriger) {
      const t = x.fait.gravite === "critique" ? "🔴 FAUX" : "🟠 DATÉ";
      console.log(`\n${t} — ${x.fait.libelle}`);
      const aussi = (x.source.acceptees ?? []).filter((v) => v !== x.source.valeur);
      console.log(`   source dit  : ${x.source.valeur ?? "?"}${aussi.length ? ` (ou ${aussi.join(", ")} : ${x.source.note ?? "accepté"})` : ""}${x.source.erreur ? ` (${x.source.erreur})` : ""}`);
      for (const a of x.affirme.filter((a) => a.note !== "dynamique")) {
        const marque = x.fautifs?.includes(a) && x.fautifs !== x.affirme ? "  ← à corriger" : "";
        console.log(`   contenu dit : ${a.valeur ?? a.note} — ${a.fichier}${a.lignes?.length ? ` (l. ${a.lignes.join(", ")})` : ""}${marque}`);
      }
      const nDyn = x.affirme.filter((a) => a.note === "dynamique").length;
      if (nDyn) console.log(`   (+ ${nDyn} emplacement(s) qui lisent src/lib/offre/prix.ts, rien à corriger)`);
      if (x.incoherent) console.log(`   ⚠️ le contenu se contredit d'un fichier à l'autre`);
      for (const c of x.clausesFausses ?? []) {
        console.log(`   ⚠️ clause datée de ${c.fichier} : doit citer ${x.periodes.join(" et ")} (chacun avec sa période), elle cite ${c.valeur}`);
      }
      console.log(`   pourquoi    : ${x.fait.pourquoi}`);
    }

    for (const x of aRelire) {
      console.log(`\n🟡 À RELIRE — ${x.fait.libelle}`);
      console.log(`   source modifiée : ${x.bougees.join(", ")}`);
      console.log(`   fichiers        : ${x.fait.ou.map((o) => o.fichier).join(", ")}`);
      console.log(`   pourquoi        : ${x.fait.pourquoi}`);
      console.log(`   une fois relu   : node scripts/veille/check-facts.mjs --revu ${x.fait.id}`);
    }

    if (dynamiques.length) {
      const parFait = new Map();
      for (const d of dynamiques) parFait.set(d.fait.id, (parFait.get(d.fait.id) ?? 0) + 1);
      console.log(`\n🔗 Prix lus dans src/lib/offre/prix.ts (plus de littéral à comparer) : ${dynamiques.length} emplacement(s) — ${[...parFait].map(([id, n]) => `${id} ×${n}`).join(" · ")}`);
    }

    if (alignes.length) {
      console.log(`\n✅ Alignés : ${alignes.map((a) => `${a.fait.id}${a.valeur && a.valeur !== "—" ? `=${a.valeur}` : ""}${a.note ? ` (${a.note})` : ""}`).join(" · ")}`);
    }
    console.log(
      critiques.length
        ? `\n🔴 ${critiques.length} phrase(s) FAUSSE(s) sur le site, à corriger avant de laisser le contenu en l'état.\n`
        : relecturesPrioritaires.length
          ? `\n(rien de prouvé faux ; ${relecturesPrioritaires.length} relecture(s) prioritaire(s) : un tarif périmé rendrait le contenu faux)\n`
          : `\n(aucun point critique)\n`,
    );
  }

  // Code 1 = une phrase du site contredit sa source, rien d'autre. Une
  // relecture demandée n'est pas une erreur : la source a bougé, c'est tout.
  process.exit(aCorriger.some((x) => x.fait.gravite === "critique") ? 1 : 0);
}

main().catch((e) => {
  console.error("check-facts a échoué :", e.message);
  process.exit(2);
});
