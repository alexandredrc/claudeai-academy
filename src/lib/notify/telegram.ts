import "server-only";

/**
 * Alerte de vente, envoyée sur Telegram à l'instant de l'encaissement.
 *
 * Pourquoi Telegram et pas un email : l'email de vente arriverait dans la même
 * boîte que tout le reste et se perdrait. Telegram fait sonner le téléphone et
 * affiche le montant sur l'écran verrouillé, sans être ouvert.
 *
 * Règle de composition : la première ligne EST la notification. Sur l'écran
 * verrouillé, seul le début du message est lisible — c'est donc là que doivent
 * tenir le pass et le montant, pas dans un joli pavé plus bas.
 *
 * Ce module ne lève jamais. Une vente encaissée ne doit jamais échouer parce
 * qu'une notification n'est pas partie.
 */

const API = "https://api.telegram.org";

async function envoyer(texte: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.warn("[telegram] TELEGRAM_BOT_TOKEN ou TELEGRAM_CHAT_ID absent — notification non envoyée.");
    return false;
  }

  try {
    const res = await fetch(`${API}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: texte,
        // Pas de parse_mode : un nom d'acheteur contenant un caractère de
        // balisage ferait rejeter le message entier par Telegram. Le texte brut
        // ne peut pas échouer, et les emojis suffisent à le rendre voyant.
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error(`[telegram] ${res.status}: ${(await res.text()).slice(0, 200)}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[telegram] envoi impossible:", err instanceof Error ? err.message : err);
    return false;
  }
}

const NOM_DU_PASS: Record<string, string> = {
  starter: "PASS STARTER",
  mastery: "PASS MASTERY",
  elite: "PASS ACCOMPAGNEMENT",
};

/** Montant en euros, sans décimales quand il n'y en a pas. */
function euros(centimes: number): string {
  const v = centimes / 100;
  return Number.isInteger(v)
    ? `${v.toLocaleString("fr-FR")} €`
    : `${v.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €`;
}

export async function notifierVente(params: {
  planCode: string | null;
  tier: string;
  amountTotal: number;
  prenom?: string | null;
}): Promise<boolean> {
  const pass = NOM_DU_PASS[params.planCode ?? params.tier] ?? "PASS";
  const montant = euros(params.amountTotal);
  const qui = params.prenom?.trim() ? ` — ${params.prenom.trim()}` : "";

  const texte = [
    `💚 VENTE ${pass} ${montant}${qui}`,
    "",
    "🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢",
    "",
    "VOUS VENEZ DE RÉALISER",
    `UNE VENTE DE ${pass}`,
    `À ${montant}`,
    "",
    "🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢",
  ].join("\n");

  return envoyer(texte);
}
