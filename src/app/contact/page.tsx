import type { Metadata } from "next";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import { Button } from "@/components/site/button";

export const metadata: Metadata = {
  title: "Contact — ClaudeAI Academy",
  description:
    "Une question sur les parcours, un problème d’accès, une demande de facture ou de remboursement ? Écrivez-nous, réponse sous 48 h ouvrées.",
};

const CONTACT_EMAIL = "contact@claudeai-academy.com";

export default function ContactPage() {
  return (
    <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
      <Container size="narrow">
        <nav className="text-[13px] text-muted mb-5" aria-label="Fil d’Ariane">
          <a href="/" className="hover:text-coral transition-colors">
            Accueil
          </a>
          <span aria-hidden="true" className="mx-2 opacity-50">
            /
          </span>
          <span className="text-ink-soft">Contact</span>
        </nav>

        <Eyebrow>On vous répond</Eyebrow>
        <h1 className="mt-4 font-serif text-[clamp(2.25rem,5vw,3.5rem)] font-medium leading-[1.05] tracking-tight text-ink">
          Une question ? <span className="accent-serif">Parlons-en</span>
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted max-w-[620px]">
          Avant d’écrire, jetez un œil à la{" "}
          <a href="/faq" className="text-coral font-medium hover:text-coral-dark transition-colors">
            FAQ
          </a>{" "}
          : la plupart des réponses (accès, garantie, facturation, niveau requis)
          y sont déjà. Sinon, on vous lit directement.
        </p>

        <div className="mt-10 rounded-[22px] border border-line bg-white p-8 shadow-card">
          <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">
            Email
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mt-2 block font-serif text-2xl text-ink hover:text-coral transition-colors"
          >
            {CONTACT_EMAIL}
          </a>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">
            Réponse sous <strong className="text-ink">48 h ouvrées</strong>. Pour
            une demande de remboursement (garantie 14 jours), précisez l’email
            utilisé lors de l’achat — aucune justification ne vous sera demandée.
          </p>
          <div className="mt-6">
            <Button href={`mailto:${CONTACT_EMAIL}`} external variant="primary">
              Écrire un email
            </Button>
          </div>
        </div>

        <p className="mt-8 text-[14px] text-muted">
          ClaudeAI Academy est éditée par ADRC Group. Voir les{" "}
          <a href="/mentions-legales" className="text-coral hover:text-coral-dark transition-colors">
            mentions légales
          </a>
          .
        </p>
      </Container>
    </section>
  );
}
