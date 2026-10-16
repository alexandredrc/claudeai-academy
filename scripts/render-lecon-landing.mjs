// Capture une vraie leçon en aperçu gratuit pour la section « méthode » de
// l'accueil (src/components/landing/method.tsx). Remplace l'ancienne maquette
// vide par le produit réel.
// Pilote Edge/Chrome en headless via le protocole DevTools (WebSocket natif de
// Node 22+) : il faut taire le bandeau cookies avant le chargement et rogner
// sur la zone utile, ce que --screenshot ne sait pas faire. Aucune dépendance npm.
//
// Usage : node scripts/render-lecon-landing.mjs [url_de_base]
//   défaut : https://www.claudeai-academy.com
//   sortie : public/landing/lecon-apercu.png
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const BASE = (process.argv[2] ?? "https://www.claudeai-academy.com").replace(/\/$/, "");
const LESSON_PATH = "/courses/prompt-engineering-pro/intro-pourquoi-le-prompt-est-de-l-ingenierie";
const OUT = path.resolve("public/landing/lecon-apercu.png");
const PORT = 9333;
const W = 1100;
const H = 1400;
const COL_W = 640;

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

// Profil jetable : aucun cookie ni consentement hérité du navigateur du user.
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "cai-capture-"));
const proc = spawn(browser, [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${profile}`,
  "about:blank",
]);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function pageSocketUrl() {
  for (let i = 0; i < 50; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      const page = list.find((t) => t.type === "page");
      if (page) return page.webSocketDebuggerUrl;
    } catch {}
    await sleep(200);
  }
  throw new Error("Navigateur injoignable sur le port DevTools.");
}

const ws = new WebSocket(await pageSocketUrl());
await new Promise((r) => ws.addEventListener("open", r, { once: true }));

let nextId = 1;
const pending = new Map();
const listeners = new Map();
ws.addEventListener("message", (e) => {
  const msg = JSON.parse(e.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) reject(new Error(msg.error.message));
    else resolve(msg.result);
  } else if (msg.method && listeners.has(msg.method)) {
    listeners.get(msg.method)();
    listeners.delete(msg.method);
  }
});
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const id = nextId++;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
const once = (method) => new Promise((r) => listeners.set(method, r));

try {
  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", {
    width: W,
    height: H,
    deviceScaleFactor: 2,
    mobile: false,
  });
  // Refus du cookie de mesure posé avant tout script de la page : le bandeau
  // ne s'affiche pas et aucun cookie Google n'est déposé pendant la capture.
  await send("Page.addScriptToEvaluateOnNewDocument", {
    source: "try { localStorage.setItem('cai-consent', 'denied'); } catch {}",
  });

  const loaded = once("Page.loadEventFired");
  await send("Page.navigate", { url: `${BASE}${LESSON_PATH}` });
  await loaded;
  await sleep(2500); // polices et hydratation

  const { result } = await send("Runtime.evaluate", {
    returnByValue: true,
    awaitPromise: true,
    expression: `(async () => {
      await document.fonts.ready;
      // Badges flottants, barre d'achat collante, barre de lecture : hors sujet dans la capture.
      for (const el of document.querySelectorAll("body *")) {
        const pos = getComputedStyle(el).position;
        if (pos === "fixed" || pos === "sticky") el.style.visibility = "hidden";
      }
      const back = document.querySelector('a[href="/courses/prompt-engineering-pro"]');
      const col = back.parentElement;
      // Colonne resserrée (760 → ${COL_W} px) : affichée sur ~540 px dans
      // l'accueil, le texte y apparaît plus grand qu'à la largeur réelle.
      col.style.maxWidth = "${COL_W}px";
      const leaf = (text) =>
        [...col.querySelectorAll("*")].find(
          (el) => el.children.length === 0 && el.textContent.trim() === text,
        );
      // Capture courte, donc lisible une fois réduite : titre, progression et
      // objectifs. Le sommaire replié et la description sautent.
      const toc = col.querySelector("details");
      const desc = col.querySelector("header p.text-lg");
      if (!toc || !desc) return null;
      toc.style.display = "none";
      desc.style.display = "none";
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      const goals = leaf("Tu sauras faire ça");
      let card = goals;
      while (card && !/rounded-/.test(card.className)) card = card.parentElement;
      const c = col.getBoundingClientRect();
      const b = back.getBoundingClientRect();
      const k = card.getBoundingClientRect();
      return {
        x: c.left + scrollX,
        y: b.top + scrollY - 32,
        width: c.width,
        height: k.bottom - b.top + 32 + 24,
      };
    })()`,
  });
  const clip = result.value;
  if (!clip || clip.width < 300 || clip.height < 300) {
    throw new Error(`Zone de capture incohérente : ${JSON.stringify(clip)}`);
  }

  const shot = await send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: true,
    clip: { ...clip, scale: 1 },
  });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, Buffer.from(shot.data, "base64"));
  console.log(
    "✓",
    path.relative(process.cwd(), OUT),
    `${Math.round(clip.width * 2)}×${Math.round(clip.height * 2)} px`,
  );
} finally {
  ws.close();
  proc.kill();
  await sleep(500);
  fs.rmSync(profile, { recursive: true, force: true });
}
