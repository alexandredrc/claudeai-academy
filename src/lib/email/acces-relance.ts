import { SITE_URL, sendEmail } from "@/lib/email/send";

/**
 * Relance d'accès : l'email qu'on envoie à quelqu'un qui a payé et dont le
 * compte n'a jamais servi.
 *
 * Ce n'est pas une relance d'activation. La séquence d'activation parle à
 * quelqu'un qui a un accès et tarde à s'en servir ; elle renvoie vers
 * /login, c'est-à-dire vers un formulaire à remplir. Or un acheteur venu du
 * tunnel pay-first n'a jamais choisi de mot de passe : lui demander de « se
 * connecter » lui demande en réalité de deviner comment. Nicolas Lapeyre a
 * reçu trois emails d'activation en six semaines et n'est jamais entré.
 *
 * D'où la règle de ce fichier : chaque message porte un lien d'accès en UN
 * clic, régénéré à l'envoi. Le texte le dit, et ne propose /acces qu'en
 * secours.
 */

export type RelanceKind = "acces_relance_1" | "acces_relance_2" | "acces_relance_3";

type Contenu = {
  subject: string;
  paragraphes: string[];
  cta: string;
  /** Ajouté en gris sous le bouton. */
  apres: string[];
};

const PASS = (tier: string) => (tier === "mastery" ? "Pass Mastery" : "Pass Starter");

function contenu(
  kind: RelanceKind,
  tier: string,
  jours: number,
  /**
   * Faux pour un siège offert (code fondateur à −100 %). Sans cette
   * distinction, la séquence écrivait « ton paiement est bien enregistré »
   * puis finissait par proposer un remboursement — à quelqu'un qui n'a jamais
   * rien payé. Embarrassant, et ça décrédibilise tout le reste du message.
   */
  paye: boolean,
): Contenu {
  const pass = PASS(tier);

  if (kind === "acces_relance_1") {
    return {
      subject: `Ton ${pass} t'attend — voici ton accès en un clic`,
      paragraphes: [
        paye
          ? `Ton paiement est bien enregistré et ton ${pass} est actif depuis ${jours} jour${jours > 1 ? "s" : ""}. Mais ton compte n'a encore jamais été ouvert — il se peut que l'email d'accès se soit perdu en route.`
          : `Ton ${pass} est actif depuis ${jours} jour${jours > 1 ? "s" : ""}. Mais ton compte n'a encore jamais été ouvert — il se peut que l'email d'accès se soit perdu en route.`,
        "Le bouton ci-dessous te connecte directement, sans mot de passe.",
      ],
      cta: "Ouvrir ma formation",
      apres: [
        "Ce lien est à usage unique et valable 1 heure. S'il a expiré, redemandes-en un en 10 secondes.",
      ],
    };
  }

  if (kind === "acces_relance_2") {
    return {
      subject: `Tu n'arrives pas à accéder à ton ${pass} ?`,
      paragraphes: [
        `Ton ${pass} est ${paye ? "payé" : "ouvert"} depuis ${jours} jours et n'a toujours pas été utilisé. Si quelque chose bloque, ce n'est pas normal et c'est à nous de le régler.`,
        "Voici un nouveau lien d'accès direct :",
      ],
      cta: "Accéder à ma formation",
      apres: [
        "Si ça ne marche toujours pas, réponds simplement à cet email en décrivant ce que tu vois : on te débloque à la main.",
        "Vérifie aussi tes indésirables — nos emails s'y glissent parfois.",
      ],
    };
  }

  if (!paye) {
    // Siège offert : pas d'argent en jeu, donc ni remboursement à proposer ni
    // insistance à avoir. Un dernier message, honnête, et on s'arrête.
    return {
      subject: `Ton ${pass} est toujours là si tu le veux`,
      paragraphes: [
        `Ton ${pass} t'a été ouvert il y a ${jours} jours et tu ne t'en es jamais servi. Aucun souci — ce message est le dernier, on ne va pas te relancer indéfiniment.`,
        "Si tu veux y jeter un œil un jour, le lien ci-dessous te connecte en un clic, et ton accès reste valable sans limite de temps.",
      ],
      cta: "Ouvrir ma formation",
      apres: [
        "Et si quelque chose t'avait empêché d'entrer, dis-le-nous en répondant : c'est utile à savoir.",
      ],
    };
  }

  return {
    subject: `Ton ${pass} — on te débloque, ou on te rembourse`,
    paragraphes: [
      `Ton ${pass} est payé depuis ${jours} jours et ton compte n'a jamais été ouvert. Deux possibilités, et les deux nous vont.`,
      "Soit tu entres — le lien ci-dessous te connecte en un clic. Soit tu préfères annuler : réponds « remboursement » à cet email et on te rembourse intégralement, sans justification à donner.",
    ],
    cta: "Entrer dans ma formation",
    apres: [
      "Ce qu'on ne veut pas, c'est garder l'argent de quelqu'un qui n'a jamais eu ce qu'il a acheté.",
    ],
  };
}

function renderHtml(c: Contenu, lien: string, prenom: string | null): string {
  const bonjour = prenom ? `Bonjour ${prenom},` : "Bonjour,";
  const corps = c.paragraphes
    .map((p) => `<p style="font-size:16px;line-height:1.7;margin:0 0 16px;">${p}</p>`)
    .join("");
  const apres = c.apres
    .map((p) => `<p style="font-size:14px;line-height:1.7;color:#5A5750;margin:0 0 8px;">${p}</p>`)
    .join("");

  return `<!DOCTYPE html>
<html lang="fr">
  <body style="margin:0;padding:32px 16px;background:#F5F1EB;font-family:Georgia,'Times New Roman',serif;color:#1F1F1E;">
    <div style="max-width:560px;margin:0 auto;">
      <p style="font-size:14px;letter-spacing:0.08em;text-transform:uppercase;color:#D97757;margin:0 0 24px;">ClaudeAI Academy</p>
      <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">${bonjour}</p>
      ${corps}
      <p style="margin:8px 0 24px;">
        <a href="${lien}" style="display:inline-block;background:#D97757;color:#FFFFFF;text-decoration:none;padding:12px 24px;border-radius:6px;font-size:16px;">${c.cta}</a>
      </p>
      ${apres}
      <p style="font-size:14px;line-height:1.7;color:#5A5750;margin:8px 0 0;">Secours : <a href="${SITE_URL}/acces" style="color:#5A5750;">claudeai-academy.com/acces</a> — une question : <a href="mailto:contact@claudeai-academy.com" style="color:#5A5750;">contact@claudeai-academy.com</a></p>
    </div>
  </body>
</html>`;
}

function renderText(c: Contenu, lien: string, prenom: string | null): string {
  return [
    prenom ? `Bonjour ${prenom},` : "Bonjour,",
    "",
    ...c.paragraphes.flatMap((p) => [p, ""]),
    `${c.cta} : ${lien}`,
    "",
    ...c.apres,
    "",
    `Secours : ${SITE_URL}/acces — une question : contact@claudeai-academy.com`,
  ].join("\n");
}

export async function sendAccesRelanceEmail(params: {
  kind: RelanceKind;
  to: string;
  tier: string;
  jours: number;
  firstName: string | null;
  accessLink: string;
  /** Faux pour un siège offert : change le discours et retire le remboursement. */
  paye: boolean;
}): Promise<boolean> {
  const c = contenu(params.kind, params.tier, params.jours, params.paye);
  return sendEmail({
    to: params.to,
    subject: c.subject,
    html: renderHtml(c, params.accessLink, params.firstName),
    text: renderText(c, params.accessLink, params.firstName),
    kind: params.kind,
  });
}
