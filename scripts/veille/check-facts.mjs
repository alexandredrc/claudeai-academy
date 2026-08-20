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

const LOCALES = { compterPrompts, compterLecons, compterParcours };

// ── Lecture de ce que le contenu affirme aujourd'hui ─────────────────────────

async function valeursAffirmees(fait) {
  const trouvees = [];
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
    const vues = [...texte.matchAll(motif)].map((m) => m[1]);
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
    revues[id] = { revuLe: quand, note: "confirmé exact à la source" };
    console.log(`✅ ${id} — relu et confirmé au ${quand}`);
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
      const derive = src.valeur && valeursDistinctes.some((v) => v !== src.valeur);
      const incoherent = valeursDistinctes.length > 1;
      if (derive || incoherent) {
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

  if (JSON_MODE) {
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
