import { SITE_URL, sendEmail } from "@/lib/email/send";

// Emails côté "leads" (prospects non-clients captés via lead magnet).
// kind aligné sur lead_email_log : lead_magnet = livraison, lead_a1..a5 = séquence de vente Starter.
export type LeadEmailKind =
  | "lead_magnet"
  | "lead_a1"
  | "lead_a2"
  | "lead_a3"
  | "lead_a4"
  | "lead_a5";

const KIT_URL = `${SITE_URL}/kit/ressources`;
const TARIFS_URL = `${SITE_URL}/tarifs`;

// --- Charte : coquille HTML commune (crème / coral / serif), identique au nurture ---
function shell(inner: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
  <body style="margin:0;padding:32px 16px;background:#F5F1EB;font-family:Georgia,'Times New Roman',serif;color:#1F1F1E;">
    <div style="max-width:560px;margin:0 auto;">
      <p style="font-size:14px;letter-spacing:0.08em;text-transform:uppercase;color:#D97757;margin:0 0 24px;">ClaudeAI Academy</p>
      ${inner}
      <hr style="border:none;border-top:1px solid #E2DCD0;margin:28px 0 20px;" />
      <p style="font-size:13px;line-height:1.7;color:#8A857B;margin:0 0 4px;">Tu reçois ce message parce que tu as téléchargé le Kit ClaudeAI Academy. Pour ne plus rien recevoir, réponds simplement « STOP » à cet email.</p>
      <p style="font-size:13px;line-height:1.7;color:#8A857B;margin:0;">Une question ? <a href="mailto:contact@claudeai-academy.com" style="color:#8A857B;">contact@claudeai-academy.com</a></p>
    </div>
  </body>
</html>`;
}

function p(text: string): string {
  return `<p style="font-size:16px;line-height:1.7;margin:0 0 16px;">${text}</p>`;
}

function bullets(items: string[]): string {
  const lis = items.map((i) => `<li style="margin:0 0 8px;">${i}</li>`).join("");
  return `<ul style="font-size:16px;line-height:1.7;margin:0 0 24px;padding-left:20px;">${lis}</ul>`;
}

function cta(label: string, href: string): string {
  return `<p style="margin:8px 0 24px;"><a href="${href}" style="display:inline-block;background:#D97757;color:#FFFFFF;text-decoration:none;padding:12px 24px;border-radius:6px;font-size:16px;">${label}</a></p>`;
}

function greeting(firstName: string | null): string {
  return firstName ? `Bonjour ${firstName},` : "Bonjour,";
}

type Rendered = { subject: string; html: string; text: string };

// =========================================
// Livraison immédiate du lead magnet
// =========================================
function renderMagnet(firstName: string | null): Rendered {
  const subject = "Ton Kit — 15 prompts Claude prêts à l'emploi";
  const inner = [
    p(greeting(firstName)),
    p("Merci — voici ton accès. Tout est sur cette page, prêt à copier :"),
    cta("Ouvrir le Kit (15 prompts)", KIT_URL),
    p("Un conseil pour qu'il te serve vraiment : choisis <strong>un seul</strong> prompt aujourd'hui, celui qui colle à une tâche que tu fais ce soir. Applique-le. Le reste suivra."),
    p("Je t'écris dans deux jours pour te montrer comment passer d'un prompt isolé à un vrai gain de temps quotidien."),
    p("À bientôt,<br />Alexandre — ClaudeAI Academy"),
  ].join("\n");
  const text = [
    greeting(firstName),
    "",
    "Merci — voici ton accès. Tout est sur cette page, prêt à copier :",
    KIT_URL,
    "",
    "Un conseil pour qu'il te serve vraiment : choisis UN seul prompt aujourd'hui, celui qui colle à une tâche que tu fais ce soir. Applique-le. Le reste suivra.",
    "",
    "Je t'écris dans deux jours pour te montrer comment passer d'un prompt isolé à un vrai gain de temps quotidien.",
    "",
    "À bientôt,",
    "Alexandre — ClaudeAI Academy",
  ].join("\n");
  return { subject, html: shell(inner), text };
}

// =========================================
// A1 — J+2 · Le vrai problème
// =========================================
function renderA1(firstName: string | null): Rendered {
  const subject = "Tu n'utilises pas Claude. Tu le sous-utilises.";
  const inner = [
    p(greeting(firstName)),
    p("Tu as récupéré le Kit. Tu as sûrement déjà testé deux ou trois prompts."),
    p("Voici ce qui va se passer si tu t'arrêtes là : tu vas gagner vingt minutes par jour, t'habituer, et plafonner. Comme la plupart des gens."),
    p("La différence entre quelqu'un qui « utilise l'IA » et quelqu'un qui en tire un facteur 10, ce n'est pas le nombre de prompts qu'il connaît. C'est qu'il a arrêté de poser des questions une par une, et qu'il a construit des <strong>systèmes</strong>."),
    p("Demain, je te montre concrètement à quoi ça ressemble."),
    p("À demain,<br />Alexandre"),
  ].join("\n");
  const text = [
    greeting(firstName),
    "",
    "Tu as récupéré le Kit. Tu as sûrement déjà testé deux ou trois prompts.",
    "",
    "Voici ce qui va se passer si tu t'arrêtes là : tu vas gagner vingt minutes par jour, t'habituer, et plafonner. Comme la plupart des gens.",
    "",
    "La différence entre quelqu'un qui « utilise l'IA » et quelqu'un qui en tire un facteur 10, ce n'est pas le nombre de prompts qu'il connaît. C'est qu'il a arrêté de poser des questions une par une, et qu'il a construit des systèmes.",
    "",
    "Demain, je te montre concrètement à quoi ça ressemble.",
    "",
    "À demain,",
    "Alexandre",
  ].join("\n");
  return { subject, html: shell(inner), text };
}

// =========================================
// A2 — J+3 · La démonstration
// =========================================
function renderA2(firstName: string | null): Rendered {
  const subject = "Avant / après : la même tâche, 8× plus vite";
  const inner = [
    p(greeting(firstName)),
    p("Un exemple réel, pas une promesse."),
    p("<strong>Avant</strong> : un analyste écrit sa requête SQL, la teste, corrige, recommence. Quarante minutes."),
    p("<strong>Après</strong> : il décrit son besoin en français, Claude génère la requête optimisée, signale l'index manquant, propose la visualisation. Cinq minutes."),
    p("Ce n'est pas magique. C'est une méthode : le bon rôle, le bon contexte, le bon format de sortie — appliqués à un workflow, pas à une question isolée."),
    p("C'est exactement ce que le <strong>Pass Starter</strong> t'apprend à faire, sur ton métier. 47 €, accès à vie, et si ça ne te sert pas, 14 jours pour être remboursé."),
    cta("Voir le Pass Starter", TARIFS_URL),
    p("Alexandre"),
  ].join("\n");
  const text = [
    greeting(firstName),
    "",
    "Un exemple réel, pas une promesse.",
    "",
    "Avant : un analyste écrit sa requête SQL, la teste, corrige, recommence. Quarante minutes.",
    "Après : il décrit son besoin en français, Claude génère la requête optimisée, signale l'index manquant, propose la visualisation. Cinq minutes.",
    "",
    "Ce n'est pas magique. C'est une méthode : le bon rôle, le bon contexte, le bon format de sortie — appliqués à un workflow, pas à une question isolée.",
    "",
    "C'est exactement ce que le Pass Starter t'apprend à faire, sur ton métier. 47 €, accès à vie, garantie 14 jours.",
    "",
    `Voir le Pass Starter : ${TARIFS_URL}`,
    "",
    "Alexandre",
  ].join("\n");
  return { subject, html: shell(inner), text };
}

// =========================================
// A3 — J+5 · L'objection « j'apprendrai seul »
// =========================================
function renderA3(firstName: string | null): Rendered {
  const subject = "« Je trouverai bien sur YouTube »";
  const inner = [
    p(greeting(firstName)),
    p("Probablement. Tu trouveras des vidéos, des threads, des prompts en vrac."),
    p("Le problème n'est pas l'accès à l'information. C'est qu'elle est en anglais, dispersée, souvent produite par des gens qui n'utilisent pas vraiment ces outils, et périmée en trois mois vu la vitesse de l'écosystème."),
    p("ClaudeAI Academy, c'est l'inverse : un parcours structuré, en français, opérationnel, <strong>mis à jour à vie</strong>. Tu paies une fois, tu suis un chemin clair, et tu arrêtes de bricoler."),
    p("Le Pass Starter est le point d'entrée le moins risqué : 47 €, garantie 14 jours."),
    cta("Commencer avec le Pass Starter", TARIFS_URL),
    p("Alexandre"),
  ].join("\n");
  const text = [
    greeting(firstName),
    "",
    "Probablement. Tu trouveras des vidéos, des threads, des prompts en vrac.",
    "",
    "Le problème n'est pas l'accès à l'information. C'est qu'elle est en anglais, dispersée, souvent produite par des gens qui n'utilisent pas vraiment ces outils, et périmée en trois mois vu la vitesse de l'écosystème.",
    "",
    "ClaudeAI Academy, c'est l'inverse : un parcours structuré, en français, opérationnel, mis à jour à vie. Tu paies une fois, tu suis un chemin clair, et tu arrêtes de bricoler.",
    "",
    "Le Pass Starter est le point d'entrée le moins risqué : 47 €, garantie 14 jours.",
    "",
    `Commencer avec le Pass Starter : ${TARIFS_URL}`,
    "",
    "Alexandre",
  ].join("\n");
  return { subject, html: shell(inner), text };
}

// =========================================
// A4 — J+7 · La garantie
// =========================================
function renderA4(firstName: string | null): Rendered {
  const subject = "Pourquoi la garantie 14 jours existe";
  const inner = [
    p(greeting(firstName)),
    p("Je vais être direct : je mets une garantie 14 jours satisfait ou remboursé parce que je sais qu'une personne sur deux qui suit le premier parcours change sa façon de travailler dès la première semaine."),
    p("Si ce n'est pas ton cas, tu demandes le remboursement, sans justification. Le risque est de mon côté, pas du tien."),
    p("La seule mauvaise décision ici, c'est de continuer à exploiter 20 % d'un outil que tu utilises déjà tous les jours."),
    cta("Commencer avec le Pass Starter", TARIFS_URL),
    p("Alexandre"),
  ].join("\n");
  const text = [
    greeting(firstName),
    "",
    "Je vais être direct : je mets une garantie 14 jours satisfait ou remboursé parce que je sais qu'une personne sur deux qui suit le premier parcours change sa façon de travailler dès la première semaine.",
    "",
    "Si ce n'est pas ton cas, tu demandes le remboursement, sans justification. Le risque est de mon côté, pas du tien.",
    "",
    "La seule mauvaise décision ici, c'est de continuer à exploiter 20 % d'un outil que tu utilises déjà tous les jours.",
    "",
    `Commencer avec le Pass Starter : ${TARIFS_URL}`,
    "",
    "Alexandre",
  ].join("\n");
  return { subject, html: shell(inner), text };
}

// =========================================
// A5 — J+10 · Dernier rappel, sobre
// =========================================
function renderA5(firstName: string | null): Rendered {
  const subject = "Je n'insisterai plus";
  const inner = [
    p(greeting(firstName)),
    p("C'est le dernier email de cette série sur le Pass Starter. Tu resteras abonné à la lettre hebdo (un usage concret de Claude par semaine), mais je n'y reviendrai pas."),
    p("Si tu hésites encore, pose-toi une question simple : combien d'heures as-tu perdues cette semaine sur des tâches que Claude ferait en quelques minutes ?"),
    p("47 €. Accès à vie. 14 jours pour changer d'avis."),
    cta("Voir le Pass Starter", TARIFS_URL),
    p("Alexandre"),
  ].join("\n");
  const text = [
    greeting(firstName),
    "",
    "C'est le dernier email de cette série sur le Pass Starter. Tu resteras abonné à la lettre hebdo (un usage concret de Claude par semaine), mais je n'y reviendrai pas.",
    "",
    "Si tu hésites encore, pose-toi une question simple : combien d'heures as-tu perdues cette semaine sur des tâches que Claude ferait en quelques minutes ?",
    "",
    "47 €. Accès à vie. 14 jours pour changer d'avis.",
    "",
    `Voir le Pass Starter : ${TARIFS_URL}`,
    "",
    "Alexandre",
  ].join("\n");
  return { subject, html: shell(inner), text };
}

export function renderLeadEmail(
  kind: LeadEmailKind,
  firstName: string | null,
): Rendered {
  switch (kind) {
    case "lead_magnet":
      return renderMagnet(firstName);
    case "lead_a1":
      return renderA1(firstName);
    case "lead_a2":
      return renderA2(firstName);
    case "lead_a3":
      return renderA3(firstName);
    case "lead_a4":
      return renderA4(firstName);
    case "lead_a5":
      return renderA5(firstName);
  }
}

export async function sendLeadEmail(params: {
  kind: LeadEmailKind;
  to: string;
  firstName: string | null;
}): Promise<boolean> {
  const r = renderLeadEmail(params.kind, params.firstName);
  return sendEmail({ to: params.to, subject: r.subject, html: r.html, text: r.text });
}
