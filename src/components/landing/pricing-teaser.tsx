import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import { CheckoutButton } from "@/components/site/checkout-button";
import { getCatalogStats, type CatalogStats } from "@/lib/courses/stats";
import { ELITE_ENABLED, ELITE_SEATS_PER_MONTH } from "@/lib/stripe/plans";
import { PROMPT_COUNT } from "@/lib/prompts/library";

// Les 3 parcours fondateurs du Pass Starter. Sert à afficher l'écart réel
// entre les deux pass — un badge qui chiffre la différence aide à choisir,
// là où « le plus complet » sur le pass le plus complet n'apprend rien.
const STARTER_LESSON_COUNT = 22;

export async function PricingTeaser() {
  const stats = await getCatalogStats();
  return (
    <section id="tarifs" className="scroll-mt-24 bg-cream py-24 md:py-32">
      <Container>
        <div className="text-center mb-16">
          <Eyebrow align="center">Tarifs</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl md:text-5xl font-medium leading-[1.15] tracking-tight text-ink">
            Choisissez votre <span className="accent-serif">accès</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted max-w-[640px] mx-auto">
            Le Pass Mastery est celui que nous recommandons : c&apos;est le
            programme entier, et ce que vous avez déjà payé s&apos;en déduit si
            vous commencez petit. Quel que soit le pass, 14 jours pour changer
            d&apos;avis.
          </p>
        </div>

        <div
          className={`grid grid-cols-1 gap-6 mx-auto ${
            ELITE_ENABLED
              ? "md:grid-cols-2 lg:grid-cols-3 max-w-[1140px]"
              : "md:grid-cols-2 max-w-[920px]"
          }`}
        >
          <StarterCard />
          <MasteryCard stats={stats} />
          {ELITE_ENABLED && <EliteCard />}
        </div>

        <PaymentMethods />
      </Container>
    </section>
  );
}

function StarterCard() {
  const features = [
    "Les 3 parcours fondateurs : Bien démarrer + Prompt Engineering pro + Claude Code (22 leçons)",
    "Bibliothèque de prompts essentiels",
    "Accès permanent et mises à jour",
    "Mentor IA Claude inclus",
    "Garantie 14 jours satisfait ou remboursé",
  ];

  return (
    <article
      id="starter"
      className="scroll-mt-24 bg-white border border-line rounded-[22px] p-9 md:p-10 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_8px_rgba(31,31,30,0.05),0_24px_48px_rgba(31,31,30,0.10)]"
    >
      <h3 className="font-serif text-2xl font-semibold text-ink">Pass Starter</h3>
      <p className="mt-1.5 text-muted text-[14px]">Pour tester la méthode sans s&apos;engager</p>

      <div className="mt-7 flex items-baseline gap-2">
        <span className="font-serif text-5xl font-semibold text-ink leading-none">47</span>
        <span className="text-base text-muted">€ une fois</span>
      </div>
      <p className="mt-2 text-[13px] text-muted">
        Accès permanent, mises à jour incluses
      </p>

      <CheckoutButton tier="starter" variant="ghost" size="md" className="mt-7 w-full">
        Commencer — 47 €
      </CheckoutButton>

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

function MasteryCard({ stats }: { stats: CatalogStats }) {
  const features = [
    `Les ${stats.courseCount} parcours complets (${stats.lessonCount} leçons)`,
    `Bibliothèque complète de ${PROMPT_COUNT} prompts`,
    "Templates et cheat sheets téléchargeables",
    "Mentor IA Claude 24/7",
    "Accès à vie et mises à jour permanentes",
    "Communauté privée des membres",
    "Garantie 14 jours satisfait ou remboursé",
  ];

  return (
    <article
      id="mastery"
      className="scroll-mt-24 relative bg-gradient-to-br from-ink to-[#2D2A26] text-cream border border-ink rounded-[22px] p-9 md:p-10 flex flex-col"
    >
      <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 bg-coral text-cream text-[12px] font-bold tracking-wider px-3.5 py-1.5 rounded-full">
        ★ {stats.lessonCount - STARTER_LESSON_COUNT} LEÇONS DE PLUS
      </span>

      <h3 className="font-serif text-2xl font-semibold">Pass Mastery</h3>
      <p className="mt-1.5 text-cream/65 text-[14px]">L&apos;intégralité du programme</p>

      <div className="mt-7 flex items-baseline gap-2">
        <span className="font-serif text-5xl font-semibold leading-none">497</span>
        <span className="text-base text-cream/65">€ une fois</span>
      </div>

      <span className="mt-3 self-start inline-block bg-green-soft text-green text-[12px] font-bold px-3 py-1 rounded-full">
        Ou 3 × 165,67 € sans frais avec Klarna
      </span>

      {/* Le crédit d'ascension existe depuis toujours côté checkout, mais
          n'était annoncé nulle part : un acheteur Starter ne pouvait pas
          savoir qu'il ne repaierait pas deux fois. */}
      <p className="mt-3 text-[13px] text-cream/70 leading-relaxed">
        Déjà membre Starter&nbsp;? Vos 47&nbsp;€ sont déduits automatiquement —
        connectez-vous avant de payer.
      </p>

      <CheckoutButton tier="mastery" variant="primary" size="md" className="mt-7 w-full">
        Rejoindre Mastery — 497 €
      </CheckoutButton>

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

// Le palier qui vend du temps humain, pas du contenu : il donne exactement le
// même accès que le Mastery. Il n'apparaît que si NEXT_PUBLIC_ELITE_ENABLED=1,
// parce qu'il engage des créneaux réels — une offre d'accompagnement affichée
// alors qu'on ne peut pas l'honorer coûte plus cher qu'elle ne rapporte.
function EliteCard() {
  const features = [
    "Tout le Pass Mastery, sans exception",
    "3 séances individuelles d'une heure, en visio",
    "Audit de vos consignes : vous envoyez les vôtres, je les réécris avec vous",
    "Accès direct par email pendant 90 jours, réponse sous 24 h ouvrées",
    "Ce que vous avez déjà payé est déduit automatiquement",
    "Garantie 14 jours satisfait ou remboursé",
  ];

  return (
    <article
      id="accompagnement"
      className="scroll-mt-24 relative bg-white border-2 border-coral rounded-[22px] p-9 md:p-10 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_8px_rgba(31,31,30,0.05),0_24px_48px_rgba(31,31,30,0.10)]"
    >
      <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 bg-ink text-cream text-[12px] font-bold tracking-wider px-3.5 py-1.5 rounded-full whitespace-nowrap">
        {ELITE_SEATS_PER_MONTH} PLACES PAR MOIS
      </span>

      <h3 className="font-serif text-2xl font-semibold text-ink">
        Pass Accompagnement
      </h3>
      <p className="mt-1.5 text-muted text-[14px]">
        Le programme, et quelqu&apos;un en face
      </p>

      <div className="mt-7 flex items-baseline gap-2">
        <span className="font-serif text-5xl font-semibold text-ink leading-none">
          1&nbsp;497
        </span>
        <span className="text-base text-muted">€ une fois</span>
      </div>

      <p className="mt-3 text-[13px] text-muted leading-relaxed">
        La limite de places n&apos;est pas un artifice : au-delà, les séances ne
        seraient plus tenables.
      </p>

      <CheckoutButton tier="elite" variant="primary" size="md" className="mt-7 w-full">
        Réserver ma place — 1 497 €
      </CheckoutButton>

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

function PaymentMethods() {
  const pills = [
    { ico: "💳", label: "Carte bancaire" },
    { ico: "", label: "Apple Pay" },
    { ico: "G", label: "Google Pay" },
    { ico: "⚡", label: "Klarna · 3× sans frais", highlight: true },
    { ico: "🔗", label: "Link (paiement en 1 clic)" },
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
