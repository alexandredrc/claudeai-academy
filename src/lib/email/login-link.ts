import { sendEmail } from "@/lib/email/send";

function renderHtml(accessLink: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
  <body style="margin:0;padding:32px 16px;background:#F5F1EB;font-family:Georgia,'Times New Roman',serif;color:#1F1F1E;">
    <div style="max-width:560px;margin:0 auto;">
      <p style="font-size:14px;letter-spacing:0.08em;text-transform:uppercase;color:#D97757;margin:0 0 24px;">ClaudeAI Academy</p>
      <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">Bonjour,</p>
      <p style="font-size:16px;line-height:1.7;margin:0 0 24px;">Voici ton lien de connexion à ClaudeAI Academy. Un clic suffit — aucun mot de passe à saisir.</p>
      <p style="margin:0 0 24px;">
        <a href="${accessLink}" style="display:inline-block;background:#D97757;color:#FFFFFF;text-decoration:none;padding:12px 24px;border-radius:6px;font-size:16px;">Me connecter</a>
      </p>
      <p style="font-size:14px;line-height:1.7;color:#5A5750;margin:0 0 8px;">Ce lien est à usage unique et expire rapidement. S'il ne fonctionne plus, redemande-en un depuis la page de connexion.</p>
      <p style="font-size:14px;line-height:1.7;color:#5A5750;margin:0 0 8px;">Tu n'es pas à l'origine de cette demande ? Ignore simplement cet email — ton compte reste protégé.</p>
      <p style="font-size:14px;line-height:1.7;color:#5A5750;margin:0;">Une question ? Écris-nous : <a href="mailto:contact@claudeai-academy.com" style="color:#5A5750;">contact@claudeai-academy.com</a></p>
    </div>
  </body>
</html>`;
}

function renderText(accessLink: string): string {
  return [
    "Bonjour,",
    "",
    "Voici ton lien de connexion à ClaudeAI Academy. Un clic suffit — aucun mot de passe à saisir.",
    "",
    `Me connecter : ${accessLink}`,
    "",
    "Ce lien est à usage unique et expire rapidement. S'il ne fonctionne plus, redemande-en un depuis la page de connexion.",
    "Tu n'es pas à l'origine de cette demande ? Ignore simplement cet email — ton compte reste protégé.",
    "Une question ? contact@claudeai-academy.com",
  ].join("\n");
}

export async function sendLoginLinkEmail(params: {
  to: string;
  accessLink: string;
}): Promise<void> {
  await sendEmail({
    to: params.to,
    subject: "Ton lien de connexion — ClaudeAI Academy",
    html: renderHtml(params.accessLink),
    text: renderText(params.accessLink),
  });
}
