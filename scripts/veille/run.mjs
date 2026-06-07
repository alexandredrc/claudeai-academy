// =========================================
// ClaudeAI Academy — Agent de veille
//
// Usage : node scripts/veille/run.mjs
//
// Compare l'état actuel des sources fiables (cf. sources.mjs) avec le dernier
// snapshot, et écrit un rapport daté listant ce qui a changé + les parcours
// potentiellement impactés.
//
// 100 % déterministe (fetch + diff). Pas d'IA, pas de clé API requise.
// L'analyse "quelle leçon réécrire" est faite par toi à la lecture du rapport.
//
// État : scripts/veille/.state.json (gitignored)
// Rapports : scripts/veille/reports/AAAA-MM-JJ.md
// =========================================

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { SOURCES } from "./sources.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const STATE_PATH = join(HERE, ".state.json");
const REPORTS_DIR = join(HERE, "reports");

const UA =
  "ClaudeAI-Academy-Veille/1.0 (+https://claudeai-academy.com; veille interne)";

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { "user-agent": UA, accept: "*/*" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} on ${url}`);
  return res.text();
}

function sha(s) {
  return createHash("sha256").update(s).digest("hex").slice(0, 16);
}

// CHANGELOG.md : la 1re ligne "## x.y.z" est la version courante.
function parseChangelogVersion(md) {
  const m = md.match(/^##\s+([0-9]+\.[0-9]+\.[0-9]+)/m);
  return m ? m[1] : null;
}

// Extrait les blocs de versions postérieures à `sinceVersion`.
function changelogEntriesSince(md, sinceVersion) {
  const blocks = md.split(/^##\s+/m).slice(1);
  const out = [];
  for (const b of blocks) {
    const ver = (b.match(/^([0-9]+\.[0-9]+\.[0-9]+)/) || [])[1];
    if (!ver) continue;
    if (sinceVersion && cmpVer(ver, sinceVersion) <= 0) break;
    out.push(`## ${b.trim()}`);
  }
  return out;
}

function cmpVer(a, b) {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) - (pb[i] || 0);
  }
  return 0;
}

// Atom : récupère les <entry> (id + title + updated).
function parseAtom(xml) {
  const entries = [];
  const re = /<entry[\s\S]*?<\/entry>/g;
  let m;
  while ((m = re.exec(xml)) !== null) {
    const block = m[0];
    const id = (block.match(/<id>(.*?)<\/id>/) || [])[1] || "";
    const title = decodeXml(
      (block.match(/<title[^>]*>([\s\S]*?)<\/title>/) || [])[1] || "",
    ).trim();
    const updated =
      (block.match(/<updated>(.*?)<\/updated>/) || [])[1] ||
      (block.match(/<published>(.*?)<\/published>/) || [])[1] ||
      "";
    if (id) entries.push({ id, title, updated });
  }
  return entries.slice(0, 15);
}

function decodeXml(s) {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

// Réduit une page HTML à une empreinte STABLE du contenu textuel.
// Objectif : détecter un vrai changement de contenu sans crier au loup à
// cause du markup dynamique (build IDs, timestamps, nonces, compteurs).
function htmlToText(html) {
  let t = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, "")
    .replace(/<[^>]+>/g, " ");

  // Normalisation anti-bruit :
  t = t
    .toLowerCase()
    // entités HTML résiduelles
    .replace(/&[a-z#0-9]+;/g, " ")
    // tokens hex longs (hash de build, nonces CSP, ids)
    .replace(/\b[0-9a-f]{8,}\b/g, " ")
    // dates ISO et horodatages
    .replace(/\d{4}-\d{2}-\d{2}t?[\d:.]*z?/g, " ")
    // tous les nombres (compteurs, versions d'assets, etc.)
    .replace(/\d+/g, " ")
    // ne garder que lettres (a-z + accents) et espaces
    .replace(/[^a-zàâäéèêëïîôöùûüç ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Les release notes / articles ont leur substance dans les ~25k 1ers
  // caractères de texte ; on borne pour ignorer footer/nav répétitifs.
  return t.slice(0, 25000);
}

async function loadState() {
  if (!existsSync(STATE_PATH)) return {};
  try {
    return JSON.parse(await readFile(STATE_PATH, "utf8"));
  } catch {
    return {};
  }
}

async function main() {
  const state = await loadState();
  const nextState = { ...state };
  const findings = [];

  for (const src of SOURCES) {
    try {
      const raw = await fetchText(src.url);

      if (src.kind === "github-changelog") {
        const ver = parseChangelogVersion(raw);
        const prev = state[src.id]?.version ?? null;
        nextState[src.id] = { version: ver, checkedAt: new Date().toISOString() };
        if (prev && ver && cmpVer(ver, prev) > 0) {
          const entries = changelogEntriesSince(raw, prev);
          findings.push({
            src,
            type: "changelog",
            summary: `${prev} → ${ver}`,
            detail: entries.join("\n\n").slice(0, 4000),
          });
        } else if (!prev) {
          findings.push({
            src,
            type: "baseline",
            summary: `baseline posée à v${ver}`,
            detail: "",
          });
        }
      } else if (src.kind === "atom") {
        const entries = parseAtom(raw);
        const seen = new Set(state[src.id]?.ids ?? []);
        nextState[src.id] = {
          ids: entries.map((e) => e.id),
          checkedAt: new Date().toISOString(),
        };
        const fresh = entries.filter((e) => !seen.has(e.id));
        if (seen.size === 0) {
          findings.push({
            src,
            type: "baseline",
            summary: `baseline posée (${entries.length} entrées)`,
            detail: "",
          });
        } else if (fresh.length) {
          findings.push({
            src,
            type: "feed",
            summary: `${fresh.length} nouvelle(s) publication(s)`,
            detail: fresh.map((e) => `- ${e.title} (${e.updated})`).join("\n"),
          });
        }
      } else if (src.kind === "html-hash") {
        const h = sha(htmlToText(raw));
        const prev = state[src.id]?.hash ?? null;
        nextState[src.id] = { hash: h, checkedAt: new Date().toISOString() };
        if (prev && h !== prev) {
          findings.push({
            src,
            type: "page-changed",
            summary: "contenu de la page modifié (revue manuelle requise)",
            detail: `Ouvrir : ${src.url}`,
          });
        } else if (!prev) {
          findings.push({
            src,
            type: "baseline",
            summary: "baseline posée (hash page)",
            detail: "",
          });
        }
      }
    } catch (err) {
      findings.push({
        src,
        type: "error",
        summary: `échec fetch : ${err.message}`,
        detail: "",
      });
    }
  }

  await mkdir(REPORTS_DIR, { recursive: true });
  const date = new Date().toISOString().slice(0, 10);
  const reportPath = join(REPORTS_DIR, `${date}.md`);

  const actionable = findings.filter(
    (f) => f.type !== "baseline" && f.type !== "error",
  );
  const errors = findings.filter((f) => f.type === "error");

  let md = `# Veille ClaudeAI Academy — ${date}\n\n`;
  if (actionable.length === 0 && errors.length === 0) {
    md += `Rien de neuf sur les ${SOURCES.length} sources surveillées. Aucune action.\n`;
  } else {
    if (actionable.length) {
      md += `## ${actionable.length} changement(s) à examiner\n\n`;
      for (const f of actionable) {
        const impacts = f.src.impacts?.length
          ? f.src.impacts.join(", ")
          : "—";
        md += `### ${f.src.label} (tier ${f.src.tier})\n`;
        md += `- **Changement** : ${f.summary}\n`;
        md += `- **Parcours potentiellement impactés** : ${impacts}\n`;
        md += `- **Source** : ${f.src.url}\n`;
        if (f.detail) md += `\n<details><summary>Détail</summary>\n\n\`\`\`\n${f.detail}\n\`\`\`\n</details>\n`;
        md += `\n`;
      }
    }
    if (errors.length) {
      md += `## Sources en erreur (à vérifier)\n\n`;
      for (const f of errors) md += `- ${f.src.label} : ${f.summary}\n`;
    }
  }

  const baselines = findings.filter((f) => f.type === "baseline");
  if (baselines.length) {
    md += `\n## Baselines posées (premier run, normal)\n\n`;
    for (const f of baselines) md += `- ${f.src.label} : ${f.summary}\n`;
  }

  await writeFile(reportPath, md, "utf8");
  await writeFile(STATE_PATH, JSON.stringify(nextState, null, 2), "utf8");

  // Coopère avec GitHub Actions si présent (sans coupler le script à CI).
  if (process.env.GITHUB_OUTPUT) {
    const { appendFileSync } = await import("node:fs");
    appendFileSync(
      process.env.GITHUB_OUTPUT,
      `actionable=${actionable.length}\nerrors=${errors.length}\nreport_path=${reportPath}\nreport_date=${date}\n`,
    );
  }

  console.log(`Rapport écrit : ${reportPath}`);
  console.log(
    `${actionable.length} changement(s) actionnable(s), ${errors.length} erreur(s), ${baselines.length} baseline(s).`,
  );
  if (actionable.length) {
    console.log("\n--- Aperçu ---\n");
    console.log(md);
  }
}

main().catch((err) => {
  console.error("Veille échouée :", err);
  process.exit(1);
});
