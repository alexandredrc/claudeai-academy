import { NextResponse } from "next/server";
import { certificateByCode } from "@/lib/certification/core";
import { renderCertificatePdf } from "@/lib/certification/pdf";
import { SITE_URL } from "@/lib/email/send";

export const dynamic = "force-dynamic";

/**
 * Téléchargement du certificat.
 *
 * Le PDF est régénéré à chaque appel plutôt que stocké : il ne dépend que de
 * la ligne en base, il pèse quelques dizaines de kilo-octets, et un fichier
 * stocké finirait par diverger de la source de vérité le jour où un certificat
 * est révoqué.
 *
 * Accessible sans authentification, à dessein : c'est un document que le
 * titulaire doit pouvoir transmettre. Le code fait office de clé — il n'est ni
 * devinable ni énumérable.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  const cert = await certificateByCode(code);

  if (!cert) {
    return new NextResponse("Certificat introuvable.", { status: 404 });
  }
  // Un certificat révoqué ne se télécharge plus : sinon le PDF continuerait de
  // circuler en affirmant quelque chose que la page de vérification dément.
  if (cert.revoked) {
    return new NextResponse("Ce certificat a été révoqué.", { status: 410 });
  }

  const pdf = await renderCertificatePdf(cert, SITE_URL);

  return new NextResponse(Buffer.from(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="certificat-claudeai-academy-${cert.code}.pdf"`,
      "Cache-Control": "private, max-age=0, must-revalidate",
    },
  });
}
