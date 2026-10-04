#!/usr/bin/env node
// =========================================
// ClaudeAI Academy — Vérificateur de faits périssables
//
// Usage : node scripts/veille/check-facts.mjs [--json]
//
// Répond à la seule question qui compte avant de toucher au contenu :
//   « quelle phrase, dans quel fichier, est devenue fausse ? »
//
// Ne réécrit RIEN. Produit un ordre de travail. La correction reste un geste
// délibéré — réécrire 48 leçons sans relecture est le geste le plus risqué de
// ce business : un tarif faux dans une formation payante est pire qu'un
// tarif vieux de deux semaines.
//
// Sortie : code 0 si tout est aligné, 1 s'il y a du critique à corriger.
// =========================================

import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { FAITS } from "./facts.mjs";

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

/** Les prix que Stripe facture, lus dans « src/lib/stripe/plans.ts » (amountEur).
 *  Lus par regex plutôt qu'importés : le fichier est en TypeScript et getPlan()
 *  exige les identifiants de prix Stripe en variables d'environnement, alors
 *  que ce vérificateur doit tourner sans .env.local. */
async function prixDesPass() {
  const src = await readFile(join(RACINE, "src/lib/stripe/plans.ts"), "utf8");
  const prix = {};
  for (const m of src.matchAll(/case "(\w+)":[\s\S]*?amountEur: (\d+)/g)) prix[m[1]] = Number(m[2]);
  for (const code of ["starter", "mastery", "elite"]) {
    if (!prix[code]) throw new Error(`amountEur introuvable pour « ${code} » dans plans.ts`);
  }
  return prix;
}

// Chaînes sans séparateur de milliers (« 1497 ») : la forme canonique vers
// laquelle le registre ramène « 1 497 » et « 1&nbsp;497 » avant de comparer.
const prixPassStarter = async () => String((await prixDesPass()).starter);
const prixPassMastery = async () => String((await prixDesPass()).mastery);
const prixPassAccompagnement = async () => String((await prixDesPass()).elite);

/** Ce que Klarna prélève trois fois pour le Mastery : le tiers du prix, arrondi
 *  au centime supérieur, écrit à la française (« 165,67 »). Dérivé du prix
 *  réel plutôt qu'écrit en dur : si le Mastery change, la mensualité suit. */
async function mensualiteKlarnaMastery() {
  const { mastery } = await prixDesPass();
  return (Math.ceil((mastery / 3) * 100) / 100).toFixed(2).replace(".", ",");
}

/** Idem pour l'Accompagnement (« 499 » quand il est à 1 497 €) : valeur à
 *  ignorer quand on cherche la mensualité du Mastery dans les mêmes fichiers. */
async function mensualiteKlarnaAccompagnement() {
  const { elite } = await prixDesPass();
  return (Math.ceil((elite / 3) * 100) / 100).toFixed(2).replace(".", ",").replace(/,00$/, "");
}

const LOCALES = {
  compterPrompts,
  compterLecons,
  compterParcours,
  compterLeconsStarter,
  compterBlocsMaj,
  dernierBlocMaj,
  compterSources,
  prixPassStarter,
  prixPassMastery,
  prixPassAccompagnement,
  mensualiteKlarnaMastery,
  mensualiteKlarnaAccompagnement,
};

// ── Lecture de ce que le contenu affirme aujourd'hui ─────────────────────────

async function valeursAffirmees(fait) {
  const trouvees = [];
  // Une même valeur peut s'écrire de plusieurs façons (« 1 497 », « 1&nbsp;497 »,
  // « 1497 ») : le fait peut fournir `canon` pour les ramener à une forme unique.
  const canon = fait.canon ?? ((v) => v);
  // Valeurs légitimes d'un AUTRE fait dans les mêmes fichiers (la mensualité
  // de l'Accompagnement à côté de celle du Mastery) : on ne les lit pas.
  const exclues = fait.exclureValeurs?.kind === "local"
    ? [canon(String(await LOCALES[fait.exclureValeurs.fn]()))]
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
    trouvees.push({
      fichier: emplacement.fichier,
      valeur: vues.length ? [...new Set(vues)].join(", ") : null,
      lignes,
      note: vues.length ? null : "motif non trouvé — le contenu a peut-être été reformulé",
    });
  }
  return trouvees;
}

// ── Vérification ─────────────────────────────────────────────────────────────

async function valeurSource(fait, sourcesModifiees) {
  const v = fait.verif;
  if (v.kind === "local") return { valeur: await LOCALES[v.fn](), auto: true };
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

  for (const fait of FAITS) {
    const affirme = await valeursAffirmees(fait);
    const src = await valeurSource(fait, modifiees);

    if (src.auto) {
      const valeursDistinctes = [...new Set(affirme.map((a) => a.valeur).filter(Boolean))];
      const canon = fait.canon ?? ((v) => v);
      const derive = src.valeur && valeursDistinctes.some((v) =>
        fait.accepte ? !fait.accepte(v, src.valeur) : v !== canon(src.valeur));
      const incoherent = valeursDistinctes.length > 1;
      // Un fait non critique (DATÉ) déjà relu pour CETTE valeur de source ne
      // ressort pas : « Claude Code 2.1.289 » signalé trois fois par semaine
      // jusqu'à la prochaine passe, c'est ce qui fait ignorer le message.
      const dejaVu = fait.gravite !== "critique" && src.valeur &&
        revues[fait.id]?.valeurSource === src.valeur;
      if ((derive || incoherent) && !dejaVu) {
        aCorriger.push({ fait, affirme, source: src, incoherent });
      } else {
        alignes.push({ fait, valeur: src.valeur ?? valeursDistinctes[0] });
      }
    } else if (src.bougees.length && (revues[fait.id]?.revuLe ?? "") < (changes.date ?? "")) {
      aRelire.push({ fait, affirme, bougees: src.bougees });
    } else {
      alignes.push({ fait, valeur: "—" });
    }
  }

  if (TELEGRAM_MODE) {
    // Une ligne par point. La commande d'acquittement est donnée une seule
    // fois, en bas, pour les faits qui s'acquittent.
    const court = (v) => String(v ?? "?").replace(/\s+/g, " ").slice(0, 40);
    const fichiersDe = (x) => [...new Set(x.affirme.filter((a) => a.valeur).map((a) =>
      a.fichier.replace(/^src\/(app|components|lib)\//, "").replace(/\/page\.tsx$/, "").replace(/\.(tsx|ts|mjs)$/, "")))]
      .slice(0, 3).join(", ");
    const L = [];
    for (const x of aCorriger) {
      const faux = x.fait.gravite === "critique";
      const dit = [...new Set(x.affirme.map((a) => a.valeur).filter(Boolean))].join(" / ");
      L.push(`${faux ? "🔴" : "🟠"} ${x.fait.libelle} : site « ${court(dit)} », source « ${court(x.source.valeur)} »${x.source.erreur ? ` (${x.source.erreur})` : ""} · ${fichiersDe(x)}`);
    }
    for (const x of aRelire) {
      L.push(`🟡 À relire : ${x.fait.libelle} · ${x.bougees.join(", ")} a bougé`);
    }
    const acquittables = [...aCorriger.filter((x) => x.fait.gravite !== "critique"), ...aRelire].map((x) => x.fait.id);
    if (acquittables.length) L.push(`Une fois relu : check-facts --revu ${acquittables.join(" ")}`);
    L.push(`${alignes.length} fait${alignes.length > 1 ? "s" : ""} aligné${alignes.length > 1 ? "s" : ""} sur ${FAITS.length}`);
    console.log(L.join("\n"));
  } else if (JSON_MODE) {
    console.log(JSON.stringify({
      date: changes.date,
      aCorriger: aCorriger.map((x) => ({ id: x.fait.id, gravite: x.fait.gravite })),
      aRelire: aRelire.map((x) => ({ id: x.fait.id, gravite: x.fait.gravite, sources: x.bougees })),
      alignes: alignes.length,
    }, null, 2));
  } else {
    const critiques = [...aCorriger, ...aRelire].filter((x) => x.fait.gravite === "critique");
    console.log(`\n🔎 Faits périssables — ${FAITS.length} suivis`);
    if (changes.date) console.log(`   (dernière détection de sources : ${changes.date})`);

    if (!aCorriger.length && !aRelire.length) {
      console.log(`\n✅ Tout est aligné. Rien à corriger dans le contenu.\n`);
    }

    for (const x of aCorriger) {
      const t = x.fait.gravite === "critique" ? "🔴 FAUX" : "🟠 DATÉ";
      console.log(`\n${t} — ${x.fait.libelle}`);
      console.log(`   source dit  : ${x.source.valeur ?? "?"}${x.source.erreur ? ` (${x.source.erreur})` : ""}`);
      for (const a of x.affirme) {
        console.log(`   contenu dit : ${a.valeur ?? a.note} — ${a.fichier}${a.lignes?.length ? ` (l. ${a.lignes.join(", ")})` : ""}`);
      }
      if (x.incoherent) console.log(`   ⚠️ le contenu se contredit d'un fichier à l'autre`);
      console.log(`   pourquoi    : ${x.fait.pourquoi}`);
    }

    for (const x of aRelire) {
      console.log(`\n🟡 À RELIRE — ${x.fait.libelle}`);
      console.log(`   source modifiée : ${x.bougees.join(", ")}`);
      console.log(`   fichiers        : ${x.fait.ou.map((o) => o.fichier).join(", ")}`);
      console.log(`   pourquoi        : ${x.fait.pourquoi}`);
      console.log(`   une fois relu   : node scripts/veille/check-facts.mjs --revu ${x.fait.id}`);
    }

    if (alignes.length) {
      console.log(`\n✅ Alignés : ${alignes.map((a) => `${a.fait.id}${a.valeur && a.valeur !== "—" ? `=${a.valeur}` : ""}`).join(" · ")}`);
    }
    console.log(
      critiques.length
        ? `\n🔴 ${critiques.length} point(s) CRITIQUE(s) à traiter avant de laisser le contenu en l'état.\n`
        : `\n(aucun point critique)\n`,
    );
  }

  process.exit([...aCorriger, ...aRelire].some((x) => x.fait.gravite === "critique") ? 1 : 0);
}

main().catch((e) => {
  console.error("check-facts a échoué :", e.message);
  process.exit(2);
});
