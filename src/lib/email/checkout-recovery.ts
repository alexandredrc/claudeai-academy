import type { PlanTier } from "@/lib/stripe/plans";
import { SITE_URL, sendEmail } from "@/lib/email/send";

/**
 * Relance d'un paiement qui n'est pas allé au bout.
 *
 * Le 19/08/2026, un Pass Mastery à 497 € a échoué sur une authentification
 * 3DS lancée depuis Link, puis la session a expiré sans que personne ne soit
 * prévenu — ni le client, ni nous. Cet email part désormais tout seul.
 *
 * Le contenu dit explicitement quoi faire différemment : saisir la carte à la
 * main plutôt que de repasser par le paiement enregistré. C'est l'information
 * qui manquait au client resté bloqué devant son échec.
 */
function renderHtml(params: {
  recoveryUrl: string;
  tier: PlanTier;
  firstName: string | null;
}): string {
  const greeting = params.firstName ? `Bonjour ${params.firstName},` : "Bonjour,";
  const pass = params.tier === "mastery" ? "Pass Mastery" : "Pass Starter";

  return `<!DOCTYPE html>
<html lang="fr">
  <body style="margin:0;padding:32px 16px;background:#F5F1EB;font-family:Georgia,'Times New Roman',serif;color:#1F1F1E;">
    <div style="max-width:560px;margin:0 auto;">
      <p style="font-size:14px;letter-spacing:0.08em;text-transform:uppercase;color:#D97757;margin:0 0 24px;">ClaudeAI Academy</p>
      <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">${greeting}</p>
      <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">Votre paiement pour le <strong>${pass}</strong> n'est pas allé au bout : votre banque a demandé une validation 3D&nbsp;Secure qui n'a pas abouti. Rien n'a été débité.</p>
      <p style="font-size:16px;line-height:1.7;margin:0 0 24px;">Votre commande est toujours là, il suffit de reprendre où vous en étiez&nbsp;:</p>
      <p style="margin:0 0 28px;">
        <a href="${params.recoveryUrl}" style="display:inline-block;background:#D97757;color:#FFFFFF;text-decoration:none;padding:13px 26px;border-radius:6px;font-size:16px;">Reprendre mon paiement</a>
      </p>
      <div style="border-left:3px solid #D97757;padding:2px 0 2px 16px;margin:0 0 28px;">
        <p style="font-size:15px;line-height:1.7;margin:0;"><strong>Un conseil qui règle le problème neuf fois sur dix&nbsp;:</strong> choisissez <strong>« Carte bancaire »</strong> et saisissez les numéros à la main, plutôt que de passer par le paiement enregistré (Link). La validation 3D&nbsp;Secure se déroule alors directement avec votre banque, sans intermédiaire — c'est là que ça coince habituellement.</p>
      </div>
      <p style="font-size:14px;line-height:1.7;color:#5A5750;margin:0 0 8px;">Si ça bloque encore, répondez simplement à cet email&nbsp;: on vous envoie un lien de paiement sur mesure, ou une facture à régler par virement.</p>
      <p style="font-size:14px;line-height:1.7;color:#5A5750;margin:0;">Garantie 14 jours&nbsp;: si la formation ne vous convient pas, on vous rembourse sans question. <a href="${SITE_URL}/tarifs" style="color:#5A5750;">Revoir le détail des pass</a></p>
    </div>
  </body>
</html>`;
}

function renderText(params: {
  recoveryUrl: string;
  tier: PlanTier;
  firstName: string | null;
}): string {
  const pass = params.tier === "mastery" ? "Pass Mastery" : "Pass Starter";
  return [
    params.firstName ? `Bonjour ${params.firstName},` : "Bonjour,",
    "",
    `Votre paiement pour le ${pass} n'est pas allé au bout : votre banque a demandé une validation 3D Secure qui n'a pas abouti. Rien n'a été débité.`,
    "",
    `Reprendre mon paiement : ${params.recoveryUrl}`,
    "",
    "Un conseil qui règle le problème neuf fois sur dix : choisissez « Carte bancaire » et saisissez les numéros à la main, plutôt que de passer par le paiement enregistré (Link). La validation 3D Secure se déroule alors directement avec votre banque.",
    "",
    "Si ça bloque encore, répondez à cet email : on vous envoie un lien de paiement sur mesure, ou une facture à régler par virement.",
    "Garantie 14 jours, remboursement sans question.",
  ].join("\n");
}

export async function sendCheckoutRecoveryEmail(params: {
  to: string;
  recoveryUrl: string;
  tier: PlanTier;
  firstName: string | null;
}): Promise<boolean> {
  return sendEmail({
    to: params.to,
    subject: "Votre paiement n'est pas allé au bout — on vous remet le lien",
    html: renderHtml(params),
    text: renderText(params),
    kind: "checkout_recovery",
  });
}
