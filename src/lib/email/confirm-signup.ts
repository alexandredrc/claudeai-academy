import { SITE_URL, sendEmail } from "@/lib/email/send";

/**
 * Email de confirmation d'inscription, envoyé par nous via Resend.
 *
 * Ce n'est plus Supabase qui l'envoie : son template pointait sur
 * `/auth/v1/verify`, un GET qui consomme le jeton à usage unique — les
 * antivirus de messagerie l'ouvraient avant le destinataire. Ici le lien
 * passe par /auth/confirm, qui n'active le jeton qu'après un clic humain.
 */
function renderHtml(confirmLink: string, firstName: string | null): string {
  const greeting = firstName ? `Bonjour ${firstName},` : "Bonjour,";
  return `<!DOCTYPE html>
<html lang="fr">
  <body style="margin:0;padding:32px 16px;background:#F5F1EB;font-family:Georgia,'Times New Roman',serif;color:#1F1F1E;">
    <div style="max-width:560px;margin:0 auto;">
      <p style="font-size:14px;letter-spacing:0.08em;text-transform:uppercase;color:#D97757;margin:0 0 24px;">ClaudeAI Academy</p>
      <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">${greeting}</p>
      <p style="font-size:16px;line-height:1.7;margin:0 0 24px;">Bienvenue. Il ne reste qu'une étape pour activer ton compte et accéder à tes parcours&nbsp;: confirme que cette adresse est bien la tienne.</p>
      <p style="margin:0 0 24px;">
        <a href="${confirmLink}" style="display:inline-block;background:#D97757;color:#FFFFFF;text-decoration:none;padding:13px 26px;border-radius:6px;font-size:16px;">Confirmer mon adresse</a>
      </p>
      <p style="font-size:14px;line-height:1.7;color:#5A5750;margin:0 0 8px;">Si le bouton ne fonctionne pas, copie-colle ce lien dans ton navigateur&nbsp;:</p>
      <p style="font-size:13px;line-height:1.6;color:#5A5750;word-break:break-all;margin:0 0 24px;"><a href="${confirmLink}" style="color:#5A5750;">${confirmLink}</a></p>
      <p style="font-size:14px;line-height:1.7;color:#5A5750;margin:0 0 8px;">Le lien ne marche plus ? Redemande un accès en 10 secondes sur <a href="${SITE_URL}/acces" style="color:#5A5750;">claudeai-academy.com/acces</a>.</p>
      <p style="font-size:14px;line-height:1.7;color:#5A5750;margin:0;">Tu n'as pas créé de compte sur ClaudeAI Academy ? Ignore simplement cet email, aucune action ne sera entreprise.</p>
    </div>
  </body>
</html>`;
}

function renderText(confirmLink: string, firstName: string | null): string {
  return [
    firstName ? `Bonjour ${firstName},` : "Bonjour,",
    "",
    "Bienvenue. Il ne reste qu'une étape pour activer ton compte et accéder à tes parcours : confirme que cette adresse est bien la tienne.",
    "",
    `Confirmer mon adresse : ${confirmLink}`,
    "",
    `Le lien ne marche plus ? Redemande un accès en 10 secondes : ${SITE_URL}/acces`,
    "Tu n'as pas créé de compte sur ClaudeAI Academy ? Ignore simplement cet email.",
  ].join("\n");
}

export async function sendSignupConfirmationEmail(params: {
  to: string;
  confirmLink: string;
  firstName: string | null;
}): Promise<boolean> {
  return sendEmail({
    to: params.to,
    subject: "Confirme ton adresse — ClaudeAI Academy",
    html: renderHtml(params.confirmLink, params.firstName),
    text: renderText(params.confirmLink, params.firstName),
  });
}
