// Rend chaque email de la séquence leads en HTML (+ texte brut) pour relecture.
// Rien n'est envoyé : on appelle seulement renderLeadEmail().
//
// Usage : node scripts/preview-lead-emails.mjs [dossier_sortie]
//   défaut : .preview/emails-leads (ignoré par git), avec un index.html.
import { createJiti } from "jiti";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.resolve(process.argv[2] ?? path.join(root, ".preview/emails-leads"));
fs.mkdirSync(outDir, { recursive: true });

// `server-only` refuse d'être importé hors du serveur Next : on le neutralise.
// Même chose pour le client Supabase, inutile pour rendre un email et qui
// exige des variables d'environnement.
const stub = path.join(outDir, "server-only-stub.cjs");
fs.writeFileSync(stub, "module.exports = {};\n");
const supabaseStub = path.join(outDir, "supabase-stub.cjs");
fs.writeFileSync(supabaseStub, "module.exports = { supabaseAdmin: {} };\n");
process.env.CRON_SECRET ??= "secret-de-previsualisation";

const jiti = createJiti(import.meta.url, {
  alias: {
    "@/lib/supabase/admin": supabaseStub,
    "@": path.join(root, "src"),
    "server-only": stub,
  },
});
const { renderLeadEmail, LEAD_EMAIL_KINDS } = await jiti.import(path.join(root, "src/lib/email/lead-magnet.ts"));

const LEAD_ID = "00000000-0000-4000-8000-000000000000";
const rows = [];
for (const kind of LEAD_EMAIL_KINDS) {
  const r = renderLeadEmail(kind, "Camille", LEAD_ID);
  fs.writeFileSync(path.join(outDir, `${kind}.html`), r.html);
  fs.writeFileSync(path.join(outDir, `${kind}.txt`), `Objet : ${r.subject}\n\n${r.text}\n`);
  const mots = r.text.split(/\s+/).filter(Boolean).length;
  const tirets = (r.subject + r.text + r.html).includes("—");
  rows.push({ kind, subject: r.subject, mots, tirets });
  console.log(`${kind.padEnd(12)} ${String(mots).padStart(4)} mots ${tirets ? "⚠ TIRET CADRATIN" : ""} ${r.subject}`);
}

const index = `<!doctype html><meta charset="utf-8"><title>Séquence leads</title>
<body style="font-family:system-ui;margin:24px;background:#F5F1EB;color:#1F1F1E">
<h1 style="font-family:Georgia">Séquence leads : ${rows.length} emails</h1>
${rows.map((r) => `<h2 style="font-size:15px;margin:28px 0 6px">${r.kind} · ${r.mots} mots${r.tirets ? " · ⚠ tiret cadratin" : ""}<br><span style="font-weight:400">${r.subject}</span></h2>
<iframe src="${r.kind}.html" style="width:100%;max-width:680px;height:760px;border:1px solid #E5DED0;border-radius:10px;background:#fff"></iframe>`).join("\n")}
</body>`;
fs.writeFileSync(path.join(outDir, "index.html"), index);
console.log(`\n→ ${path.join(outDir, "index.html")}`);
