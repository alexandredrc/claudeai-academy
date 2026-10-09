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
type Lang = "fr" | "en";
type Texte = { eyebrow: string; titre: string; corps: string; bouton: string };

const TEXTES: Record<Lang, Record<Etat, Texte>> = {
  fr: {
    confirmer: {
      eyebrow: "Désinscription",
      titre: "Ne plus recevoir nos emails ?",
      corps:
        "Un clic sur le bouton et tu ne reçois plus rien de notre part. Ton accès au kit reste ouvert.",
      bouton: "Me désinscrire",
    },
    fait: {
      eyebrow: "C'est fait",
      titre: "Tu ne recevras plus nos emails.",
      corps:
        "Ta désinscription est enregistrée. Ton accès au kit reste ouvert. Si tu changes d'avis, écris à contact@claudeai-academy.com.",
      bouton: "",
    },
    erreur: {
      eyebrow: "Petit souci",
      titre: "La désinscription n'a pas pu être enregistrée.",
      corps:
        "Réessaie dans un instant, ou réponds simplement « STOP » à l'un de nos emails : on s'en occupe à la main.",
      bouton: "",
    },
    invalide: {
      eyebrow: "Lien incomplet",
      titre: "Ce lien de désinscription n'est pas valide.",
      corps:
        "Il a peut-être été coupé en deux par ta messagerie. Réponds « STOP » à l'un de nos emails ou écris à contact@claudeai-academy.com : on te retire de la liste.",
      bouton: "",
    },
  },
  // Leads du test anglophone (octobre 2026) : même mécanisme, textes anglais.
  en: {
    confirmer: {
      eyebrow: "Unsubscribe",
      titre: "Stop receiving our emails?",
      corps: "One click on the button and you will not hear from us again. Your access to the kit stays open.",
      bouton: "Unsubscribe me",
    },
    fait: {
      eyebrow: "Done",
      titre: "You will not receive our emails anymore.",
      corps:
        "Your unsubscription is recorded. Your access to the kit stays open. If you change your mind, write to contact@claudeai-academy.com.",
      bouton: "",
    },
    erreur: {
      eyebrow: "Small problem",
      titre: "We could not record your unsubscription.",
      corps: "Try again in a moment, or simply reply STOP to one of our emails: we will handle it by hand.",
      bouton: "",
    },
    invalide: {
      eyebrow: "Incomplete link",
      titre: "This unsubscribe link is not valid.",
      corps:
        "Your email client may have split it in two. Reply STOP to one of our emails or write to contact@claudeai-academy.com: we will remove you from the list.",
      bouton: "",
    },
  },
};

export default async function DesinscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ l?: string; t?: string; etat?: string; lang?: string }>;
}) {
  const sp = await searchParams;
  const valide = jetonValide(sp.l, sp.t);
  const etat: Etat =
    sp.etat === "fait" || sp.etat === "erreur" || sp.etat === "invalide"
      ? sp.etat
      : valide
        ? "confirmer"
        : "invalide";
  const lang: Lang = sp.lang === "en" ? "en" : "fr";
  const texte = TEXTES[lang][etat];

  return (
    <section lang={lang} className="pt-20 pb-28 md:pt-28 md:pb-36">
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
              <input type="hidden" name="lang" value={lang} />
              <Button type="submit" variant="primary" size="lg">
                {texte.bouton}
              </Button>
            </form>
          )}
        </div>
      </Container>
    </section>
  );
}
