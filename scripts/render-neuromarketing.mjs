// Rend les visuels « Neuromarketing appliqué » (cartes portrait 1080×1350) en PNG.
// Chaque carte est isolée via son ancre #nm-N (voir le CSS :target du gabarit).
// Utilise Edge/Chrome en headless — aucune dépendance npm.
//
// Usage : node scripts/render-neuromarketing.mjs [dossier_sortie]
//   défaut : marketing/exports/neuromarketing
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const outDir = path.resolve(process.argv[2] ?? "marketing/exports/neuromarketing");
fs.mkdirSync(outDir, { recursive: true });

// Localise un binaire Chromium (Edge puis Chrome), Windows ou *nix.
const candidates = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
];
const browser = candidates.find((p) => fs.existsSync(p));
if (!browser) {
  console.error("Aucun navigateur Chromium trouvé. Édite la liste `candidates`.");
  process.exit(1);
}

const FILE = "marketing/neuromarketing-visuals.html";
const W = 1080;
const H = 1350;

// Ancres présentes dans le gabarit (doivent matcher les id="" des <section>).
const anchors = ["nm-1"];

const url = "file:///" + path.resolve(FILE).replace(/\\/g, "/");

for (const anchor of anchors) {
  const out = path.join(outDir, `${anchor}.png`);
  execFileSync(browser, [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--force-device-scale-factor=2",
    `--window-size=${W},${H}`,
    "--virtual-time-budget=15000",
    `--screenshot=${out}`,
    `${url}#${anchor}`,
  ]);
  console.log("✓", out);
}

console.log(`\n${anchors.length} visuel(s) rendu(s) dans ${outDir}`);
