import type { PlanTier } from "@/lib/stripe/plans";
import { SITE_URL, sendEmail } from "@/lib/email/send";

export type NurtureKind = "nurture_d1" | "nurture_d7";

// --- Charte : coquille HTML commune (crème / coral / serif) ---
function shell(inner: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
  <body style="margin:0;padding:32px 16px;background:#F5F1EB;font-family:Georgia,'Times New Roman',serif;color:#1F1F1E;">
    <div style="max-width:560px;margin:0 auto;">
      <p style="font-size:14px;letter-spacing:0.08em;text-transform:uppercase;color:#D97757;margin:0 0 24px;">ClaudeAI Academy</p>
      ${inner}
      <hr style="border:none;border-top:1px solid #E2DCD0;margin:28px 0 20px;" />
      <p style="font-size:13px;line-height:1.7;color:#8A857B;margin:0 0 4px;">Tu reçois ce message parce que tu as rejoint ClaudeAI Academy. Pour ne plus recevoir ces conseils, réponds simplement « STOP » à cet email.</p>
      <p style="font-size:13px;line-height:1.7;color:#8A857B;margin:0;">Une question ? <a href="mailto:contact@claudeai-academy.com" style="color:#8A857B;">contact@claudeai-academy.com</a></p>
    </div>
  </body>
</html>`;
}

function p(text: string): string {
  return `<p style="font-size:16px;line-height:1.7;margin:0 0 16px;">${text}</p>`;
}

function bullets(items: string[]): string {
  const lis = items
    .map((i) => `<li style="margin:0 0 8px;">${i}</li>`)
    .join("");
  return `<ul style="font-size:16px;line-height:1.7;margin:0 0 24px;padding-left:20px;">${lis}</ul>`;
}

function cta(label: string, href: string): string {
  return `<p style="margin:8px 0 24px;"><a href="${href}" style="display:inline-block;background:#D97757;color:#FFFFFF;text-decoration:none;padding:12px 24px;border-radius:6px;font-size:16px;">${label}</a></p>`;
}

type Rendered = { subject: string; html: string; text: string };

function greeting(firstName: string | null): string {
  return firstName ? `Bonjour ${firstName},` : "Bonjour,";
}

// =========================================
// J+1 — démarrer pour de vrai
// =========================================
function renderD1(tier: PlanTier, firstName: string | null): Rendered {
  const subject = "Tes 20 premières minutes sur ClaudeAI Academy";
  const courseHref =
    tier === "starter"
      ? `${SITE_URL}/courses/prompt-engineering-pro`
      : `${SITE_URL}/courses`;

  const mentorLine =
    tier === "mastery"
      ? p(
          `Et garde ça en tête : le <a href="${SITE_URL}/mentor" style="color:#1F1F1E;">Mentor IA</a> est là dès que tu bloques — il répond à tes questions et corrige tes exercices.`,
        )
      : "";

  const inner = [
    p(greeting(firstName)),
    p(
      "Hier, tu as rejoint ClaudeAI Academy. Le meilleur moment pour transformer cet achat en vraie compétence, c'est <strong>maintenant</strong> — avant que le quotidien ne reprenne le dessus.",
    ),
    p(
      "Un seul conseil pour aujourd'hui : ne vise pas tout le programme. Vise <strong>une</strong> leçon, faite à fond.",
    ),
    p("Ta première session, concrètement :"),
    bullets([
      "Ouvre le Parcours 1, leçon 1 — 8 minutes de lecture.",
      "Applique le prompt d'exemple dans ta propre conversation Claude.",
      "Réponds au QCM en bas de la leçon pour ancrer l'essentiel.",
    ]),
    cta("Ouvrir le Parcours 1", courseHref),
    mentorLine,
    p("À demain dans tes leçons."),
  ].join("\n");

  const text = [
    greeting(firstName),
    "",
    "Hier, tu as rejoint ClaudeAI Academy. Le meilleur moment pour transformer cet achat en vraie compétence, c'est maintenant — avant que le quotidien ne reprenne le dessus.",
    "",
    "Un seul conseil pour aujourd'hui : ne vise pas tout le programme. Vise UNE leçon, faite à fond.",
    "",
    "Ta première session, concrètement :",
    "- Ouvre le Parcours 1, leçon 1 — 8 minutes de lecture.",
    "- Applique le prompt d'exemple dans ta propre conversation Claude.",
    "- Réponds au QCM en bas de la leçon pour ancrer l'essentiel.",
    "",
    `Ouvrir le Parcours 1 : ${courseHref}`,
    ...(tier === "mastery"
      ? [
          "",
          `Le Mentor IA est là dès que tu bloques (questions + correction d'exercices) : ${SITE_URL}/mentor`,
        ]
      : []),
    "",
    "À demain dans tes leçons.",
    "",
    "— Pour ne plus recevoir ces conseils, réponds « STOP ». Une question ? contact@claudeai-academy.com",
  ].join("\n");

  return { subject, html: shell(inner), text };
}

// =========================================
// J+7 — point d'étape + ressources sous-utilisées
// =========================================
function renderD7(tier: PlanTier, firstName: string | null): Rendered {
  const subject = "Une semaine avec Claude — on fait le point ?";

  const resources =
    tier === "mastery"
      ? bullets([
          `La <a href="${SITE_URL}/prompts" style="color:#1F1F1E;">bibliothèque de 170 prompts</a> — prêts à copier, classés par usage (engineering, data, marketing, sécurité…).`,
          `Le <a href="${SITE_URL}/mentor" style="color:#1F1F1E;">Mentor IA en mode correction</a> — colle ton travail, il te renvoie une version améliorée et un verdict.`,
        ])
      : bullets([
          `Les <a href="${SITE_URL}/prompts" style="color:#1F1F1E;">prompts gratuits</a> — déjà prêts à copier dans ton espace.`,
          "Le QCM en fin de leçon — la façon la plus rapide de vérifier que ça rentre vraiment.",
        ]);

  const ctaBlock =
    tier === "mastery"
      ? cta("Explorer les prompts", `${SITE_URL}/prompts`)
      : "";

  const upsell =
    tier === "starter"
      ? [
          p(
            "Tu as fait le tour des deux parcours du Pass Starter ? Les cinq autres — Claude Code, Data &amp; SQL, Marketing, Stratégie, Trading &amp; Sécurité — et le Mentor IA sont dans le <strong>Pass Mastery</strong>. La différence se paie une seule fois, l'accès est à vie.",
          ),
          cta("Voir le Pass Mastery", `${SITE_URL}/tarifs`),
        ].join("\n")
      : p(
          "Continue à ton rythme — l'accès est à vie, et les parcours se complètent. Le plus dur, c'est de garder l'élan : une leçon par jour suffit.",
        );

  const inner = [
    p(greeting(firstName)),
    p(
      "Ça fait une semaine que tu as accès à ClaudeAI Academy. Que tu aies dévoré trois parcours ou à peine ouvert le premier : aucun souci, on reprend exactement où tu en es.",
    ),
    p("Deux ressources que l'on oublie souvent la première semaine :"),
    resources,
    ctaBlock,
    upsell,
  ]
    .filter(Boolean)
    .join("\n");

  const textResources =
    tier === "mastery"
      ? [
          `- La bibliothèque de 170 prompts (classés par usage) : ${SITE_URL}/prompts`,
          `- Le Mentor IA en mode correction (version améliorée + verdict) : ${SITE_URL}/mentor`,
        ]
      : [
          `- Les prompts gratuits, prêts à copier : ${SITE_URL}/prompts`,
          "- Le QCM en fin de leçon, pour vérifier que ça rentre.",
        ];

  const textUpsell =
    tier === "starter"
      ? [
          "",
          "Tu as fait le tour des deux parcours du Pass Starter ? Les cinq autres (Claude Code, Data & SQL, Marketing, Stratégie, Trading & Sécurité) et le Mentor IA sont dans le Pass Mastery. La différence se paie une seule fois, l'accès est à vie.",
          `Voir le Pass Mastery : ${SITE_URL}/tarifs`,
        ]
      : [
          "",
          "Continue à ton rythme — l'accès est à vie. Le plus dur, c'est de garder l'élan : une leçon par jour suffit.",
        ];

  const text = [
    greeting(firstName),
    "",
    "Ça fait une semaine que tu as accès à ClaudeAI Academy. Que tu aies dévoré trois parcours ou à peine ouvert le premier : aucun souci, on reprend où tu en es.",
    "",
    "Deux ressources que l'on oublie souvent la première semaine :",
    ...textResources,
    ...textUpsell,
    "",
    "— Pour ne plus recevoir ces conseils, réponds « STOP ». Une question ? contact@claudeai-academy.com",
  ].join("\n");

  return { subject, html: shell(inner), text };
}

export function renderNurture(
  kind: NurtureKind,
  tier: PlanTier,
  firstName: string | null,
): Rendered {
  return kind === "nurture_d1"
    ? renderD1(tier, firstName)
    : renderD7(tier, firstName);
}

export async function sendNurtureEmail(params: {
  kind: NurtureKind;
  to: string;
  tier: PlanTier;
  firstName: string | null;
}): Promise<boolean> {
  const r = renderNurture(params.kind, params.tier, params.firstName);
  return sendEmail({
    to: params.to,
    subject: r.subject,
    html: r.html,
    text: r.text,
  });
}
