import { SITE_URL, sendEmail } from "@/lib/email/send";
import { programmeLabel, type PublicCertificate } from "@/lib/certification/core";

/**
 * L'email qui accompagne le certificat.
 *
 * Ce message a une particularité : il arrive au meilleur moment de la relation
 * client — quelqu'un vient de finir un programme entier et de réussir un
 * examen. C'est le seul instant où demander un avis ou un partage ne coûte
 * rien. On le fait donc, une fois, sans insister.
 *
 * Ce qu'il ne fait PAS : laisser croire à une reconnaissance officielle. La
 * mention d'indépendance figure dans l'email comme sur le PDF.
 */

function shell(inner: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
  <body style="margin:0;padding:32px 16px;background:#F5F1EB;font-family:Georgia,'Times New Roman',serif;color:#1F1F1E;">
    <div style="max-width:580px;margin:0 auto;background:#FDFBF7;border:1px solid #E5DCCF;border-radius:8px;padding:40px 36px;">
      <p style="font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#D97757;margin:0 0 28px;font-family:Helvetica,Arial,sans-serif;">ClaudeAI Academy</p>
      ${inner}
    </div>
    <p style="max-width:580px;margin:18px auto 0;font-size:11px;line-height:1.6;color:#8A857C;font-family:Helvetica,Arial,sans-serif;text-align:center;">
      ClaudeAI Academy est un organisme de formation privé et indépendant. Ce certificat atteste de la réussite de son programme ;
      il ne constitue pas un titre reconnu par l'État. ClaudeAI Academy n'est ni affiliée à Anthropic, éditeur de Claude, ni approuvée par elle.
    </p>
  </body>
</html>`;
}

export function renderCertificationEmail(cert: PublicCertificate): {
  subject: string;
  html: string;
  text: string;
} {
  const firstName = cert.holderName.split(/\s+/)[0];
  const pct = Math.round((cert.score / cert.total) * 100);
  const verifUrl = `${SITE_URL}/certification/${cert.code}`;
  const pdfUrl = `${verifUrl}/certificat.pdf`;

  const subject = `Votre certificat de réussite — ${programmeLabel(cert.tier)}`;

  const inner = `
    <h1 style="font-size:27px;line-height:1.2;margin:0 0 22px;font-weight:500;">C'est fait, ${firstName}.</h1>

    <p style="font-size:16px;line-height:1.75;margin:0 0 18px;">
      Vous avez terminé les <strong>${cert.lessonsCompleted} leçons</strong> du programme et réussi l'examen final
      avec <strong>${cert.score} bonnes réponses sur ${cert.total}</strong>, soit ${pct}&nbsp;%.
      Votre certificat est joint à cet email.
    </p>

    <p style="font-size:16px;line-height:1.75;margin:0 0 28px;">
      Il porte un code de vérification. Toute personne à qui vous le montrez — un recruteur, un client, votre
      direction — peut le contrôler en ligne&nbsp;: la page affiche le programme suivi, la date et le résultat.
      C'est ce qui le distingue d'une attestation qu'on imprime soi-même.
    </p>

    <table role="presentation" style="border-collapse:collapse;margin:0 0 30px;">
      <tr>
        <td style="background:#D97757;border-radius:6px;">
          <a href="${pdfUrl}" style="display:inline-block;color:#FFFFFF;text-decoration:none;padding:14px 28px;font-size:16px;font-family:Helvetica,Arial,sans-serif;">Télécharger mon certificat</a>
        </td>
      </tr>
    </table>

    <table role="presentation" style="width:100%;border-collapse:collapse;background:#F7F4EE;border-radius:6px;margin:0 0 30px;">
      <tr>
        <td style="padding:18px 20px;font-family:Helvetica,Arial,sans-serif;">
          <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#8A857C;">Code de vérification</p>
          <p style="margin:0 0 4px;font-size:20px;letter-spacing:0.04em;color:#1F1F1E;font-family:Georgia,serif;"><strong>${cert.code}</strong></p>
          <p style="margin:0;font-size:12px;"><a href="${verifUrl}" style="color:#5A5750;">${verifUrl.replace(/^https?:\/\//, "")}</a></p>
        </td>
      </tr>
    </table>

    <h2 style="font-size:17px;margin:0 0 12px;font-weight:600;">Ce qui vaut le coup, maintenant</h2>
    <p style="font-size:15px;line-height:1.7;margin:0 0 18px;color:#3A3833;">
      Un certificat ouvre une conversation, il ne la gagne pas. Ce qui emporte la décision, c'est ce que
      vous savez produire. Prenez vingt minutes pour écrire <strong>trois avant/après</strong> tirés de votre
      travail réel&nbsp;: la tâche, le temps qu'elle prenait, la consigne que vous avez écrite, le résultat.
      Une page. Posée à côté du certificat, elle fait la différence.
    </p>

    <p style="font-size:15px;line-height:1.7;margin:0 0 22px;color:#3A3833;">
      Et si le programme vous a été utile, répondez-moi en une ligne pour me dire ce qui a changé concrètement.
      Je lis tout, et c'est ce qui me sert à l'améliorer.
    </p>

    <p style="font-size:15px;line-height:1.7;margin:0;color:#3A3833;">
      Bravo, sincèrement.<br />
      — Alexandre
    </p>
  `;

  const text = [
    `C'est fait, ${firstName}.`,
    "",
    `Vous avez terminé les ${cert.lessonsCompleted} leçons du programme et réussi l'examen final avec ${cert.score} bonnes réponses sur ${cert.total}, soit ${pct} %. Votre certificat est joint à cet email.`,
    "",
    "Il porte un code de vérification. Toute personne à qui vous le montrez peut le contrôler en ligne : la page affiche le programme suivi, la date et le résultat. C'est ce qui le distingue d'une attestation qu'on imprime soi-même.",
    "",
    `Télécharger : ${pdfUrl}`,
    `Code de vérification : ${cert.code}`,
    `Page de vérification : ${verifUrl}`,
    "",
    "Ce qui vaut le coup maintenant : un certificat ouvre une conversation, il ne la gagne pas. Prenez vingt minutes pour écrire trois avant/après tirés de votre travail réel — la tâche, le temps qu'elle prenait, la consigne que vous avez écrite, le résultat. Une page. Posée à côté du certificat, elle fait la différence.",
    "",
    "Et si le programme vous a été utile, répondez-moi en une ligne pour me dire ce qui a changé. Je lis tout.",
    "",
    "Bravo, sincèrement.",
    "— Alexandre",
    "",
    "— ClaudeAI Academy est un organisme de formation privé et indépendant. Ce certificat atteste de la réussite de son programme ; il ne constitue pas un titre reconnu par l'État. ClaudeAI Academy n'est ni affiliée à Anthropic, éditeur de Claude, ni approuvée par elle.",
  ].join("\n");

  return { subject, html: shell(inner), text };
}

export async function sendCertificationEmail(params: {
  to: string;
  cert: PublicCertificate;
  pdf: Uint8Array;
}): Promise<boolean> {
  const r = renderCertificationEmail(params.cert);
  return sendEmail({
    to: params.to,
    subject: r.subject,
    html: r.html,
    text: r.text,
    kind: "certification",
    attachments: [
      {
        filename: `certificat-claudeai-academy-${params.cert.code}.pdf`,
        content: Buffer.from(params.pdf).toString("base64"),
      },
    ],
  });
}
