import { SITE_URL, sendEmail } from "@/lib/email/send";

/**
 * Séquence d'activation — le seul canal qui s'adresse aux comptes qui ne se
 * sont jamais mis en marche.
 *
 * Constat du 27/08/2026 : 4 comptes sur 67 avaient validé au moins une leçon,
 * pour 14 leçons terminées sur un catalogue de 48. C'est la cause racine du
 * reste — sans utilisateurs qui avancent, il n'y a ni témoignage d'acheteur,
 * ni résultat à montrer, ni montée du Starter vers le Mastery. Le nurture
 * existant (`nurture.ts`) parle aux acheteurs récents et suppose qu'ils ont
 * commencé ; personne ne parlait à ceux qui n'ont jamais ouvert une leçon.
 *
 * Trois messages, et le dernier est le plus important : il ne vend rien, il
 * demande « qu'est-ce qui t'a arrêté ? ». C'est la seule façon d'apprendre
 * pourquoi 94 % des comptes restent immobiles.
 */
export type ActivationKind =
  | "activation_j3"
  | "activation_j10"
  | "activation_j21";

/** Leçon d'ouverture — en aperçu gratuit, donc lisible même sans achat. */
const FIRST_LESSON = `${SITE_URL}/courses/bien-demarrer-avec-claude/creer-son-compte-et-installer-claude-partout`;

// --- Charte : coquille HTML commune (crème / coral / serif) ---
function shell(inner: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
  <body style="margin:0;padding:32px 16px;background:#F5F1EB;font-family:Georgia,'Times New Roman',serif;color:#1F1F1E;">
    <div style="max-width:560px;margin:0 auto;">
      <p style="font-size:14px;letter-spacing:0.08em;text-transform:uppercase;color:#D97757;margin:0 0 24px;">ClaudeAI Academy</p>
      ${inner}
      <hr style="border:none;border-top:1px solid #E2DCD0;margin:28px 0 20px;" />
      <p style="font-size:13px;line-height:1.7;color:#8A857B;margin:0 0 4px;">Tu reçois ce message parce que tu as un compte sur ClaudeAI Academy. Pour ne plus en recevoir, réponds simplement « STOP » à cet email.</p>
      <p style="font-size:13px;line-height:1.7;color:#8A857B;margin:0;">Une question ? <a href="mailto:contact@claudeai-academy.com" style="color:#8A857B;">contact@claudeai-academy.com</a></p>
    </div>
  </body>
</html>`;
}

function p(text: string): string {
  return `<p style="font-size:16px;line-height:1.7;margin:0 0 16px;">${text}</p>`;
}

function cta(label: string, href: string): string {
  return `<p style="margin:8px 0 24px;"><a href="${href}" style="display:inline-block;background:#D97757;color:#FFFFFF;text-decoration:none;padding:12px 24px;border-radius:6px;font-size:16px;">${label}</a></p>`;
}

function quote(text: string): string {
  return `<p style="font-size:15px;line-height:1.7;margin:0 0 20px;padding:14px 18px;background:#FFFFFF;border-left:3px solid #D97757;color:#3A3A38;font-family:'SFMono-Regular',Consolas,monospace;">${text}</p>`;
}

/** Rappel d'accès : le lien magique est la seule voie d'entrée (pas de mot de passe). */
const LOGIN_HINT = `<p style="font-size:13px;line-height:1.7;color:#8A857B;margin:0 0 16px;">Si l'accès te redemande de te connecter : <a href="${SITE_URL}/login" style="color:#8A857B;">claudeai-academy.com/login</a> t'envoie un lien d'accès par email, sans mot de passe à retenir.</p>`;

type Rendered = { subject: string; html: string; text: string };

function greeting(firstName: string | null): string {
  return firstName ? `Bonjour ${firstName},` : "Bonjour,";
}

// =========================================
// J+3 — la première leçon, et rien d'autre
// =========================================
function renderJ3(hasAccess: boolean, firstName: string | null): Rendered {
  const subject = hasAccess
    ? "Ta première leçon fait 12 minutes"
    : "Tu as un compte — voici par où commencer";

  const inner = hasAccess
    ? [
        p(greeting(firstName)),
        p(
          "Ton accès est ouvert, mais aucune leçon n'a encore été validée. C'est normal : on remet toujours à demain ce qui n'a pas de point d'entrée évident.",
        ),
        p("Alors je te donne le point d'entrée. Une seule leçon, 12 minutes :"),
        cta("Commencer la leçon 1", FIRST_LESSON),
        LOGIN_HINT,
        p(
          "Elle ne parle pas de théorie. Elle installe Claude là où tu travailles déjà — navigateur, téléphone, bureau — pour que l'outil soit à portée de main au moment où tu en as besoin. Le reste du parcours en découle.",
        ),
        p("À tout de suite,<br />Alexandre"),
      ].join("")
    : [
        p(greeting(firstName)),
        p(
          "Tu as créé un compte sur l'académie mais tu n'as pas encore de pass. Pas de relance commerciale ici : commence par lire une leçon complète, en accès libre, et juge sur pièces.",
        ),
        cta("Lire la leçon d'ouverture", FIRST_LESSON),
        p(
          `Si le format te parle, les formules sont sur <a href="${SITE_URL}/tarifs" style="color:#D97757;">la page tarifs</a> — 47 € pour les trois parcours fondateurs, 497 € pour les huit. Garantie 14 jours dans les deux cas.`,
        ),
        p("Bonne lecture,<br />Alexandre"),
      ].join("");

  const text = hasAccess
    ? `${greeting(firstName)}\n\nTon accès est ouvert, mais aucune leçon n'a encore été validée.\n\nUne seule leçon, 12 minutes : ${FIRST_LESSON}\n\nSi l'accès te redemande de te connecter : ${SITE_URL}/login t'envoie un lien d'accès par email.\n\nÀ tout de suite,\nAlexandre`
    : `${greeting(firstName)}\n\nTu as créé un compte mais pas encore de pass. Commence par lire une leçon complète, en accès libre : ${FIRST_LESSON}\n\nLes formules : ${SITE_URL}/tarifs\n\nBonne lecture,\nAlexandre`;

  return { subject, html: shell(inner), text };
}

// =========================================
// J+10 — un usage concret, applicable aujourd'hui
// =========================================
function renderJ10(hasAccess: boolean, firstName: string | null): Rendered {
  const subject = "Le prompt que j'utilise le plus souvent";

  const inner = [
    p(greeting(firstName)),
    p(
      "Une formation qu'on n'ouvre pas ne sert à rien. Alors plutôt que de te rappeler qu'elle existe, voici quelque chose à utiliser dans les dix prochaines minutes.",
    ),
    p("Copie ça dans Claude, en remplaçant ce qui est entre crochets :"),
    quote(
      "Tu es [le métier de la personne à qui je m'adresse]. Voici ma situation : [3 lignes de contexte]. Je veux [le résultat attendu, précis]. Avant de répondre, pose-moi les 3 questions dont tu as besoin pour ne pas te tromper.",
    ),
    p(
      "La dernière phrase est celle qui change tout : elle empêche Claude de deviner, et te fait gagner deux ou trois allers-retours à chaque demande. C'est la base du parcours Prompt Engineering.",
    ),
    hasAccess
      ? cta("Reprendre où tu en es", `${SITE_URL}/account`)
      : cta("Lire la leçon d'ouverture", FIRST_LESSON),
    hasAccess ? LOGIN_HINT : "",
    p("Bonne journée,<br />Alexandre"),
  ].join("");

  const text = `${greeting(firstName)}\n\nUne formation qu'on n'ouvre pas ne sert à rien. Voici quelque chose à utiliser tout de suite.\n\nCopie ça dans Claude :\n\n« Tu es [le métier]. Voici ma situation : [3 lignes de contexte]. Je veux [le résultat attendu, précis]. Avant de répondre, pose-moi les 3 questions dont tu as besoin pour ne pas te tromper. »\n\nLa dernière phrase est celle qui change tout.\n\n${hasAccess ? `Reprendre : ${SITE_URL}/account` : `Lire la leçon d'ouverture : ${FIRST_LESSON}`}\n\nBonne journée,\nAlexandre`;

  return { subject, html: shell(inner), text };
}

// =========================================
// J+21 — la question, pas l'offre
// =========================================
function renderJ21(hasAccess: boolean, firstName: string | null): Rendered {
  const subject = "Qu'est-ce qui t'a arrêté ?";

  const inner = [
    p(greeting(firstName)),
    p(
      hasAccess
        ? "Trois semaines que ton accès est ouvert, et aucune leçon validée. Je ne vais pas te relancer une quatrième fois — je préfère comprendre."
        : "Trois semaines que ton compte existe, sans que rien ne se passe. Je ne vais pas te relancer une quatrième fois — je préfère comprendre.",
    ),
    p(
      "Réponds à cet email en une ligne, même brutale. Le manque de temps ? Un contenu qui ne correspond pas à ton métier ? Un problème d'accès ? Un achat regretté ?",
    ),
    p(
      "Je lis tout, et je réponds moi-même. Si c'est un problème technique, on le règle dans la journée. Si c'est le contenu, ça m'aide à le corriger pour les suivants.",
    ),
    hasAccess
      ? p(
          "Et si la réponse est « je ne l'utiliserai pas » : la garantie 14 jours est passée, mais dis-le quand même — je préfère un remboursement à un client fâché.",
        )
      : "",
    p("Merci d'avance,<br />Alexandre"),
  ].join("");

  const text = `${greeting(firstName)}\n\nTrois semaines, et rien ne s'est passé. Je préfère comprendre plutôt que de relancer.\n\nRéponds à cet email en une ligne, même brutale : le temps ? le contenu ? un problème d'accès ?\n\nJe lis tout et je réponds moi-même.\n\nMerci d'avance,\nAlexandre`;

  return { subject, html: shell(inner), text };
}

export function renderActivation(
  kind: ActivationKind,
  hasAccess: boolean,
  firstName: string | null,
): Rendered {
  switch (kind) {
    case "activation_j3":
      return renderJ3(hasAccess, firstName);
    case "activation_j10":
      return renderJ10(hasAccess, firstName);
    case "activation_j21":
      return renderJ21(hasAccess, firstName);
  }
}

export async function sendActivationEmail(params: {
  kind: ActivationKind;
  to: string;
  hasAccess: boolean;
  firstName: string | null;
}): Promise<boolean> {
  const r = renderActivation(params.kind, params.hasAccess, params.firstName);
  return await sendEmail({
    to: params.to,
    subject: r.subject,
    html: r.html,
    text: r.text,
    kind: params.kind,
  });
}
