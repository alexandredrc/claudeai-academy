import type { PlanTier } from "@/lib/stripe/plans";

const SITE_URL = "https://www.claudeai-academy.com";

// Envoi via l'API REST Resend (pas de dépendance npm).
// No-op si RESEND_API_KEY absent : l'email ne doit jamais bloquer le webhook.
async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    console.warn(
      "[email] RESEND_API_KEY ou EMAIL_FROM non défini — email de bienvenue non envoyé.",
    );
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend ${res.status}: ${body}`);
  }
}

type WelcomeContent = {
  subject: string;
  intro: string;
  unlocked: { label: string; href: string }[];
  ctaLabel: string;
  ctaHref: string;
};

function welcomeContent(tier: PlanTier): WelcomeContent {
  if (tier === "mastery") {
    return {
      subject: "Ton Pass Mastery est actif — tout est débloqué",
      intro:
        "Ton paiement est confirmé. Tu as maintenant accès à l'intégralité de ClaudeAI Academy, à vie, mises à jour comprises.",
      unlocked: [
        { label: "Les 7 parcours complets (40 leçons)", href: `${SITE_URL}/courses` },
        { label: "La bibliothèque de 170 prompts opérationnels", href: `${SITE_URL}/prompts` },
        { label: "Le Mentor IA, pour tes questions et la correction de tes exercices", href: `${SITE_URL}/mentor` },
      ],
      ctaLabel: "Commencer le premier parcours",
      ctaHref: `${SITE_URL}/courses`,
    };
  }
  return {
    subject: "Ton Pass Starter est actif",
    intro:
      "Ton paiement est confirmé. Tu as maintenant accès aux deux premiers parcours, à vie, mises à jour comprises.",
    unlocked: [
      { label: "Parcours 1 — Prompt Engineering pro (7 leçons)", href: `${SITE_URL}/courses/prompt-engineering-pro` },
      { label: "Parcours 2 — Claude Code et IA agentic (6 leçons)", href: `${SITE_URL}/courses/claude-code-ia-agentic` },
    ],
    ctaLabel: "Commencer le premier parcours",
    ctaHref: `${SITE_URL}/courses/prompt-engineering-pro`,
  };
}

function renderHtml(c: WelcomeContent, firstName: string | null): string {
  const greeting = firstName ? `Bonjour ${firstName},` : "Bonjour,";
  const items = c.unlocked
    .map(
      (u) =>
        `<li style="margin:0 0 8px;"><a href="${u.href}" style="color:#1F1F1E;">${u.label}</a></li>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="fr">
  <body style="margin:0;padding:32px 16px;background:#F5F1EB;font-family:Georgia,'Times New Roman',serif;color:#1F1F1E;">
    <div style="max-width:560px;margin:0 auto;">
      <p style="font-size:14px;letter-spacing:0.08em;text-transform:uppercase;color:#D97757;margin:0 0 24px;">ClaudeAI Academy</p>
      <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">${greeting}</p>
      <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">${c.intro}</p>
      <p style="font-size:16px;line-height:1.7;margin:0 0 8px;">Ce qui est débloqué sur ton compte :</p>
      <ul style="font-size:16px;line-height:1.7;margin:0 0 24px;padding-left:20px;">${items}</ul>
      <p style="margin:0 0 32px;">
        <a href="${c.ctaHref}" style="display:inline-block;background:#D97757;color:#FFFFFF;text-decoration:none;padding:12px 24px;border-radius:6px;font-size:16px;">${c.ctaLabel}</a>
      </p>
      <p style="font-size:14px;line-height:1.7;color:#5A5750;margin:0 0 8px;">Garantie 14 jours : si la formation ne te convient pas, réponds simplement à cet email et on te rembourse, sans question.</p>
      <p style="font-size:14px;line-height:1.7;color:#5A5750;margin:0;">Une question ? Écris-nous : <a href="mailto:contact@claudeai-academy.com" style="color:#5A5750;">contact@claudeai-academy.com</a></p>
    </div>
  </body>
</html>`;
}

function renderText(c: WelcomeContent, firstName: string | null): string {
  const greeting = firstName ? `Bonjour ${firstName},` : "Bonjour,";
  const items = c.unlocked.map((u) => `- ${u.label} : ${u.href}`).join("\n");
  return [
    greeting,
    "",
    c.intro,
    "",
    "Ce qui est débloqué sur ton compte :",
    items,
    "",
    `${c.ctaLabel} : ${c.ctaHref}`,
    "",
    "Garantie 14 jours : si la formation ne te convient pas, réponds simplement à cet email et on te rembourse, sans question.",
    "Une question ? contact@claudeai-academy.com",
  ].join("\n");
}

export async function sendPurchaseWelcomeEmail(params: {
  to: string;
  tier: PlanTier;
  firstName: string | null;
}): Promise<void> {
  const content = welcomeContent(params.tier);
  await sendEmail({
    to: params.to,
    subject: content.subject,
    html: renderHtml(content, params.firstName),
    text: renderText(content, params.firstName),
  });
}
