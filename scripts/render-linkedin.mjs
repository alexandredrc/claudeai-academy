// Rend les visuels LinkedIn (cartes portrait 1080×1350) en PNG.
// Chaque carte est isolée via son ancre #post-N / #cover-N (voir le CSS :target du gabarit).
// Utilise Edge/Chrome en headless — aucune dépendance npm.
//
// Usage : node scripts/render-linkedin.mjs [dossier_sortie]
//   défaut : marketing/exports/linkedin
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const outDir = path.resolve(process.argv[2] ?? "marketing/exports/linkedin");
fs.mkdirSync(outDir, { recursive: true });

// Localise un binaire Chromium (Edge puis Chrome), Windows ou *nix.
const candidates = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
];
const browser = candidates.find((p) => fs.existsSync(p));
if (!browser) {
  console.error("Aucun navigateur Chromium trouvé. Édite la liste `candidates`.");
  process.exit(1);
}

const FILE = "marketing/linkedin-visuals.html";
const W = 1080;
const H = 1350;

// Ancres présentes dans le gabarit (doivent matcher les id="" des <section>).
const anchors = [
  "post-1", "post-2", "post-5", "post-6", "post-7",
  "post-10", "post-12", "post-13",
  "cover-1", "cover-2", "cover-3",
];

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

console.log(`\n${anchors.length} visuels rendus dans ${outDir}`);
