// Rend les variantes de photo de profil Instagram (carrés 1080×1080) en PNG.
// Chaque vignette est isolée via son ancre #logo-N (voir le CSS :target du gabarit).
// Utilise Edge/Chrome en headless, aucune dépendance npm.
//
// Usage : node scripts/render-instagram-logo.mjs [dossier_sortie]
//   défaut : marketing/exports/instagram
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const outDir = path.resolve(process.argv[2] ?? "marketing/exports/instagram");
fs.mkdirSync(outDir, { recursive: true });

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

const FILE = "marketing/instagram-logo.html";
const SIZE = 1080;
const anchors = ["logo-1", "logo-2"];
const url = "file:///" + path.resolve(FILE).replace(/\\/g, "/");

for (const anchor of anchors) {
  const out = path.join(outDir, `${anchor}.png`);
  execFileSync(browser, [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    `--window-size=${SIZE},${SIZE}`,
    "--virtual-time-budget=15000",
    `--screenshot=${out}`,
    `${url}#${anchor}`,
  ]);
  console.log("✓", out);
}

console.log(`\n${anchors.length} logos rendus dans ${outDir}`);
