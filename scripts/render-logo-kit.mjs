// Rend le kit logo en PNG : planche complète, chaque partie de la planche, fichiers logo
// (fond transparent) et visuels Instagram. Chaque élément est découpé au pixel par son #id.
// Pilote Edge/Chrome headless par le protocole DevTools (WebSocket natif de Node ≥ 22),
// aucune dépendance npm.
//
// Usage : node scripts/render-logo-kit.mjs [dossier_sortie]
//   défaut : marketing/exports/logo
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const outDir = path.resolve(process.argv[2] ?? "marketing/exports/logo");
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

const fileUrl = (f) => "file:///" + path.resolve(f).replace(/\\/g, "/");

// dsf = facteur d'échelle : sortie = taille CSS × dsf. transparent = fond alpha 0.
const JOBS = [
  {
    page: "marketing/logo-proposition.html",
    viewport: [1600, 940],
    dsf: 2,
    shots: [
      ["planche", "planche-complete.png"],
      ["c-symbole", "parties/01-symbole.png"],
      ["c-fond-encre", "parties/02-fond-encre.png"],
      ["c-petites-tailles", "parties/03-petites-tailles.png"],
      ["c-instagram", "parties/04-instagram-tiktok.png"],
      ["c-onglet", "parties/05-onglet-navigateur.png"],
      ["c-entete", "parties/06-entete-site.png"],
    ],
  },
  {
    page: "marketing/logo-kit.html",
    viewport: [1200, 900],
    dsf: 1,
    transparent: true,
    shots: [
      ["symbole", "fichiers/symbole.png"],
      ["symbole-creme", "fichiers/symbole-creme.png"],
      ["icone-512", "fichiers/icone-512.png"],
      ["icone-180", "fichiers/icone-180.png"],
      ["favicon-32", "fichiers/favicon-32.png"],
      ["favicon-16", "fichiers/favicon-16.png"],
    ],
  },
  {
    page: "marketing/logo-kit.html",
    viewport: [1200, 900],
    dsf: 2,
    transparent: true,
    shots: [
      ["logotype-horizontal", "fichiers/logotype-horizontal.png"],
      ["logotype-horizontal-creme", "fichiers/logotype-horizontal-creme.png"],
      ["logo-vertical", "fichiers/logo-vertical.png"],
      ["logo-vertical-creme", "fichiers/logo-vertical-creme.png"],
    ],
  },
  {
    page: "marketing/logo-kit.html",
    viewport: [1200, 900],
    dsf: 1,
    shots: [
      ["avatar-1080", "instagram/avatar-1080.png"],
      ["avatar-1080-avec-nom", "instagram/avatar-1080-avec-nom-ecarte.png"],
      ["post-1", "instagram/post-1-logo-1080x1440.png"],
      ["post-2", "instagram/post-2-pourquoi-1080x1440.png"],
      ["story", "instagram/story-1080x1920.png"],
    ],
  },
];

const port = 9300 + Math.floor(Math.random() * 500);
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "logo-kit-"));
const proc = spawn(browser, [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`,
  "about:blank",
], { stdio: "ignore" });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function pageWsUrl() {
  for (let i = 0; i < 100; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
      const page = list.find((t) => t.type === "page");
      if (page) return page.webSocketDebuggerUrl;
    } catch {}
    await sleep(100);
  }
  throw new Error("Le navigateur headless ne répond pas.");
}

const ws = new WebSocket(await pageWsUrl());
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let seq = 0;
const pending = new Map();
const waiters = [];
ws.addEventListener("message", (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
  } else if (msg.method) {
    for (const w of [...waiters]) if (w.method === msg.method) { waiters.splice(waiters.indexOf(w), 1); w.resolve(msg.params); }
  }
});
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++seq;
  pending.set(id, { resolve, reject });
  ws.send(JSON.stringify({ id, method, params }));
});
const once = (method) => new Promise((resolve) => waiters.push({ method, resolve }));
const evaluate = async (expression) =>
  (await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true })).result.value;

await send("Page.enable");
await send("Runtime.enable");

let count = 0;
try {
  for (const job of JOBS) {
    await send("Emulation.setDeviceMetricsOverride", {
      width: job.viewport[0], height: job.viewport[1], deviceScaleFactor: job.dsf, mobile: false,
    });
    await send("Emulation.setDefaultBackgroundColorOverride", job.transparent ? { color: { r: 0, g: 0, b: 0, a: 0 } } : {});
    const loaded = once("Page.loadEventFired");
    await send("Page.navigate", { url: fileUrl(job.page) });
    await loaded;
    await evaluate("document.fonts.ready.then(() => document.fonts.size)");
    await sleep(300);
    for (const [id, out] of job.shots) {
      const r = await evaluate(`(() => { const e = document.getElementById(${JSON.stringify(id)}); if (!e) return null;
        const b = e.getBoundingClientRect(); return { x: b.left + scrollX, y: b.top + scrollY, width: b.width, height: b.height }; })()`);
      if (!r) throw new Error(`#${id} introuvable dans ${job.page}`);
      const { data } = await send("Page.captureScreenshot", {
        format: "png", clip: { ...r, scale: 1 }, captureBeyondViewport: true, fromSurface: true,
      });
      const file = path.join(outDir, out);
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, Buffer.from(data, "base64"));
      const png = fs.readFileSync(file);
      console.log(`${out}  ${png.readUInt32BE(16)}×${png.readUInt32BE(20)}`);
      count++;
    }
  }
} finally {
  ws.close();
  proc.kill();
}
console.log(`${count} fichiers dans ${outDir}`);
