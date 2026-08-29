export const SITE_URL = "https://www.claudeai-academy.com";

/**
 * Adresse à laquelle aboutissent les réponses.
 *
 * La production expédie depuis `no-reply@`, qui n'est pas une boîte relevée.
 * Or nos emails invitent explicitement à répondre : « réponds STOP » pour se
 * désinscrire, « réponds à cet email et on te rembourse » pour la garantie
 * 14 jours. Sans en-tête Reply-To, ces réponses tombaient dans le vide — un
 * client demandant un remboursement n'obtenait que du silence.
 */
export const REPLY_TO = process.env.EMAIL_REPLY_TO ?? "contact@claudeai-academy.com";

// Envoi via l'API REST Resend (pas de dépendance npm).
// No-op si RESEND_API_KEY / EMAIL_FROM absent : un email ne doit jamais
// bloquer le flux appelant (webhook Stripe, cron nurture…).
export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  /**
   * Étape de séquence (`nurture_d1`, `lead_a3`, `activation_j10`, …).
   *
   * Transmise à Resend comme tag, elle revient sur chaque événement du
   * webhook : c'est ce qui permet de calculer un taux d'ouverture et de clic
   * *par étape* plutôt qu'un chiffre global illisible. Resend n'accepte que
   * lettres, chiffres, tirets et soulignés dans une valeur de tag — d'où le
   * nettoyage ci-dessous plutôt qu'un envoi refusé en bloc.
   */
  kind?: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    console.warn(
      "[email] RESEND_API_KEY ou EMAIL_FROM non défini — email non envoyé.",
    );
    return false;
  }

  const kind = params.kind?.replace(/[^A-Za-z0-9_-]/g, "").slice(0, 60);

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
      // Toujours présent : un email sans Reply-To renvoie vers `no-reply@`.
      reply_to: params.replyTo ?? REPLY_TO,
      ...(kind ? { tags: [{ name: "kind", value: kind }] } : {}),
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend ${res.status}: ${body}`);
  }
  return true;
}
