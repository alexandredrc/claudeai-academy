import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import { Button } from "@/components/site/button";

export function PricingTeaser() {
  return (
    <section id="tarifs" className="bg-cream py-24 md:py-32">
      <Container>
        <div className="text-center mb-16">
          <Eyebrow align="center">Tarifs</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl md:text-5xl font-medium leading-[1.15] tracking-tight text-ink">
            Choisissez votre <span className="accent-serif">accès</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted max-w-[640px] mx-auto">
            Deux options claires. Le Pass Mastery est l&apos;offre cœur du
            programme. Le Starter est conçu pour goûter avant de s&apos;engager.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[920px] mx-auto">
          <StarterCard />
          <MasteryCard />
        </div>

        <PaymentMethods />
      </Container>
    </section>
  );
}

function StarterCard() {
  const features = [
    "Parcours Prompt Engineering complet (5 leçons)",
    "Bibliothèque de 30 prompts essentiels",
    "Accès permanent et mises à jour",
    "Mentor IA Claude inclus",
    "Garantie 14 jours satisfait ou remboursé",
  ];

  return (
    <article
      id="starter"
      className="bg-white border border-line rounded-[22px] p-9 md:p-10 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_8px_rgba(31,31,30,0.05),0_24px_48px_rgba(31,31,30,0.10)]"
    >
      <h3 className="font-serif text-2xl font-semibold text-ink">Pass Starter</h3>
      <p className="mt-1.5 text-muted text-[14px]">Pour découvrir la méthode</p>

      <div className="mt-7 flex items-baseline gap-2">
        <span className="font-serif text-5xl font-semibold text-ink leading-none">47</span>
        <span className="text-base text-muted">€ une fois</span>
      </div>
      <p className="mt-2 text-[13px] text-muted">
        Accès permanent, mises à jour incluses
      </p>

      <Button href="/checkout/starter" variant="ghost" size="md" className="mt-7 w-full">
        Choisir Starter
      </Button>

      <ul className="mt-7 pt-7 border-t border-line space-y-3 flex-1">
        {features.map((f) => (
          <li key={f} className="relative pl-7 text-[14px] leading-[1.55] text-ink-soft">
            <span className="absolute left-0 top-0 text-coral font-bold text-base">✓</span>
            {f}
          </li>
        ))}
      </ul>
    </article>
  );
}

function MasteryCard() {
  const features = [
    "Les 5 parcours complets (27 leçons)",
    "Bibliothèque complète de 120+ prompts",
    "Templates et cheat sheets téléchargeables",
    "Mentor IA Claude 24/7",
    "Accès à vie et mises à jour permanentes",
    "Communauté privée des membres",
    "Garantie 14 jours satisfait ou remboursé",
  ];

  return (
    <article
      id="mastery"
      className="relative bg-gradient-to-br from-ink to-[#2D2A26] text-cream border border-ink rounded-[22px] p-9 md:p-10 flex flex-col"
    >
      <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 bg-coral text-cream text-[12px] font-bold tracking-wider px-3.5 py-1.5 rounded-full">
        ★ PLUS POPULAIRE
      </span>

      <h3 className="font-serif text-2xl font-semibold">Pass Mastery</h3>
      <p className="mt-1.5 text-cream/65 text-[14px]">L&apos;intégralité du programme</p>

      <div className="mt-7 flex items-baseline gap-2">
        <span className="font-serif text-5xl font-semibold leading-none">497</span>
        <span className="text-base text-cream/65">€ une fois</span>
      </div>

      <span className="mt-3 self-start inline-block bg-green-soft text-green text-[12px] font-bold px-3 py-1 rounded-full">
        Ou 3 × 179 € sans frais
      </span>

      <Button href="/checkout/mastery" variant="primary" size="md" className="mt-7 w-full">
        Rejoindre Mastery
      </Button>

      <ul className="mt-7 pt-7 border-t border-cream/15 space-y-3 flex-1">
        {features.map((f) => (
          <li key={f} className="relative pl-7 text-[14px] leading-[1.55] text-cream/85">
            <span className="absolute left-0 top-0 text-coral-soft font-bold text-base">✓</span>
            {f}
          </li>
        ))}
      </ul>
    </article>
  );
}

function PaymentMethods() {
  const pills = [
    { ico: "💳", label: "Carte bancaire" },
    { ico: "", label: "Apple Pay" },
    { ico: "G", label: "Google Pay" },
    { ico: "⚡", label: "Klarna · 3× ou 4× sans frais", highlight: true },
    { ico: "🏦", label: "Virement SEPA" },
  ];
  return (
    <div className="mt-12 max-w-[760px] mx-auto bg-white border border-line rounded-[22px] p-7 md:p-8 flex flex-col items-center gap-4 text-center">
      <span className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">
        🔒 Paiement 100 % sécurisé
      </span>
      <div className="flex flex-wrap gap-2.5 justify-center">
        {pills.map((p) => (
          <span
            key={p.label}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-semibold border transition-all duration-200 ${
              p.highlight
                ? "bg-coral-soft border-coral text-coral-dark"
                : "bg-cream-soft border-line text-ink-soft hover:bg-white hover:-translate-y-px"
            }`}
          >
            {p.ico && <span aria-hidden="true">{p.ico}</span>}
            {p.label}
          </span>
        ))}
      </div>
      <p className="text-[13px] text-muted max-w-[540px] leading-relaxed">
        Paiements traités par <strong className="text-ink">Stripe</strong>, leader
        mondial certifié PCI-DSS niveau 1. Facture professionnelle générée
        automatiquement. TVA selon votre statut (autoliquidation
        intracommunautaire avec numéro valide).
      </p>
    </div>
  );
}
