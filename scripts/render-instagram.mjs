// Rend les visuels Instagram (stories 1080×1920 + carrousel 1080×1350) en PNG.
// Chaque slide est isolé via son ancre #s1..#s4 (voir le CSS :target des gabarits).
// Utilise Edge/Chrome en headless — aucune dépendance npm.
//
// Usage : node scripts/render-instagram.mjs [dossier_sortie]
//   défaut : marketing/exports/
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const outDir = path.resolve(process.argv[2] ?? "marketing/exports");
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

const jobs = [
  { file: "marketing/instagram-stories.html", w: 1080, h: 1920, prefix: "story" },
  { file: "marketing/instagram-carrousel.html", w: 1080, h: 1350, prefix: "carrousel" },
];

for (const job of jobs) {
  const url = "file:///" + path.resolve(job.file).replace(/\\/g, "/");
  for (let i = 1; i <= 4; i++) {
    const out = path.join(outDir, `claudeai-academy-${job.prefix}-0${i}.png`);
    execFileSync(browser, [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--force-device-scale-factor=2",
      `--window-size=${job.w},${job.h}`,
      "--virtual-time-budget=15000",
      `--screenshot=${out}`,
      `${url}#s${i}`,
    ]);
    console.log("✓", out);
  }
}
