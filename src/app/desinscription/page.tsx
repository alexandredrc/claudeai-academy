import type { Metadata } from "next";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import { Button } from "@/components/site/button";
import { jetonValide } from "@/lib/email/desinscription";
import { confirmerDesinscriptionAction } from "./actions";

export const metadata: Metadata = {
  title: "Se désinscrire des emails",
  description: "Arrêter de recevoir les emails de ClaudeAI Academy.",
  robots: { index: false, follow: false },
};

type Etat = "confirmer" | "fait" | "erreur" | "invalide";

const TEXTES: Record<Etat, { eyebrow: string; titre: string; corps: string }> = {
  confirmer: {
    eyebrow: "Désinscription",
    titre: "Ne plus recevoir nos emails ?",
    corps:
      "Un clic sur le bouton et tu ne reçois plus rien de notre part. Ton accès au kit reste ouvert.",
  },
  fait: {
    eyebrow: "C'est fait",
    titre: "Tu ne recevras plus nos emails.",
    corps:
      "Ta désinscription est enregistrée. Ton accès au kit reste ouvert. Si tu changes d'avis, écris à contact@claudeai-academy.com.",
  },
  erreur: {
    eyebrow: "Petit souci",
    titre: "La désinscription n'a pas pu être enregistrée.",
    corps:
      "Réessaie dans un instant, ou réponds simplement « STOP » à l'un de nos emails : on s'en occupe à la main.",
  },
  invalide: {
    eyebrow: "Lien incomplet",
    titre: "Ce lien de désinscription n'est pas valide.",
    corps:
      "Il a peut-être été coupé en deux par ta messagerie. Réponds « STOP » à l'un de nos emails ou écris à contact@claudeai-academy.com : on te retire de la liste.",
  },
};

export default async function DesinscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ l?: string; t?: string; etat?: string }>;
}) {
  const sp = await searchParams;
  const valide = jetonValide(sp.l, sp.t);
  const etat: Etat =
    sp.etat === "fait" || sp.etat === "erreur" || sp.etat === "invalide"
      ? sp.etat
      : valide
        ? "confirmer"
        : "invalide";
  const texte = TEXTES[etat];

  return (
    <section className="pt-20 pb-28 md:pt-28 md:pb-36">
      <Container size="narrow">
        <div className="text-center">
          <Eyebrow>{texte.eyebrow}</Eyebrow>
          <h1 className="mt-5 font-serif text-[clamp(1.875rem,4vw,2.75rem)] font-medium leading-[1.1] tracking-tight text-ink">
            {texte.titre}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted max-w-[520px] mx-auto">{texte.corps}</p>

          {etat === "confirmer" && (
            <form action={confirmerDesinscriptionAction} className="mt-9">
              <input type="hidden" name="l" value={sp.l} />
              <input type="hidden" name="t" value={sp.t} />
              <Button type="submit" variant="primary" size="lg">
                Me désinscrire
              </Button>
            </form>
          )}
        </div>
      </Container>
    </section>
  );
}
