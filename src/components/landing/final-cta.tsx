import { Container } from "@/components/site/container";
import { CheckoutButton } from "@/components/site/checkout-button";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-ink to-[#2D2A26] text-cream py-20 md:py-24">
      <div
        aria-hidden="true"
        className="absolute -top-24 -right-24 w-[400px] h-[400px] rounded-full opacity-25 blur-3xl"
        style={{
          background: "radial-gradient(circle, var(--color-coral), transparent 70%)",
        }}
      />
      <Container>
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="max-w-[560px]">
            <h2 className="font-serif text-3xl md:text-[2.5rem] font-medium leading-[1.2] tracking-tight">
              Prêt à devenir <span className="accent-serif">opérationnel sur Claude</span> ?
            </h2>
            <p className="mt-3 text-cream/70 text-[17px] leading-relaxed">
              5 parcours, 27 leçons, accès à vie. Garantie 14 jours satisfait ou remboursé.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <CheckoutButton tier="mastery" variant="primary" size="lg">
              Rejoindre Mastery, 497 €
            </CheckoutButton>
            <CheckoutButton tier="starter" variant="ghost-light" size="lg">
              Commencer avec Starter, 47 €
            </CheckoutButton>
          </div>
        </div>
      </Container>
    </section>
  );
}
