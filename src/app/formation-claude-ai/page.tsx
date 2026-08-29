import type { Metadata } from "next";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import { Button } from "@/components/site/button";
import { CheckoutButton } from "@/components/site/checkout-button";
import { Testimonials } from "@/components/landing/testimonials";
import { PricingTeaser } from "@/components/landing/pricing-teaser";
import { ValueStack } from "@/components/landing/value-stack";
import { Guarantee } from "@/components/landing/guarantee";
import { LeadCaptureForm } from "@/components/landing/lead-capture-form";
import { getCatalogStats } from "@/lib/courses/stats";
import { PROMPT_COUNT } from "@/lib/prompts/library";

// Landing dédiée au trafic Google Ads (requêtes « formation claude ai » et
// proches). Volontairement hors nav, hors sitemap et noindex : elle ne doit
// ni concurrencer la home en SEO ni recevoir de trafic organique — c'est le
// laboratoire de mesure de la pub. AdsBot ignore le noindex (il suit
// robots.txt), donc le Quality Score n'est pas affecté.
export const metadata: Metadata = {
  title: "Formation Claude AI en ligne, en français | ClaudeAI Academy",
  description:
    "La formation Claude AI en français : 8 parcours, 48 leçons, 170 prompts prêts à l'emploi. À votre rythme, accès à vie, garantie 14 jours. Dès 47 €.",
  robots: { index: false, follow: true },
};

export default function FormationClaudeAI() {
  return (
    <>
      <LandingHero />
      <PainBridge />
      <WhatYouGet />
      <Testimonials pricingHref="#tarifs" />
      <PricingTeaser />
      <ValueStack />
      <Guarantee />
      <LandingFAQ />
      <NotTodayCapture />
      <LastCall />
    </>
  );
}

// =========================================
// Hero — miroir de la requête « formation claude ai »
// =========================================
async function LandingHero() {
  const stats = await getCatalogStats();
  return (
    <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
      <div
        aria-hidden="true"
        className="absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(242,213,199,0.9), transparent 70%)",
        }}
      />
      <Container>
        <div className="max-w-[780px] relative">
          <Eyebrow>
            Formation 100 % en ligne · En français · À votre rythme
          </Eyebrow>

          <h1 className="mt-5 font-serif text-[clamp(2.5rem,5.5vw,4rem)] font-medium leading-[1.05] tracking-[-0.025em] text-ink">
            La formation <span className="accent-serif">Claude AI</span> qui
            vous rend opérationnel — pas juste curieux.
          </h1>

          <p className="mt-7 text-lg leading-relaxed text-muted max-w-[620px]">
            Vous cherchez une formation Claude AI sérieuse, en français ? La
            voici : {stats.courseCount} parcours structurés,{" "}
            {stats.lessonCount} leçons concrètes et {PROMPT_COUNT}{" "}
            prompts prêts à l&apos;emploi pour appliquer l&apos;IA à votre métier dès
            la première semaine. Paiement unique, accès à vie.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <CheckoutButton tier="mastery" variant="primary" size="lg">
              Rejoindre Mastery · 497 €
            </CheckoutButton>
            <Button href="#tarifs" variant="ghost" size="lg">
              Ou commencer à 47 €
            </Button>
          </div>
          <p className="mt-4 text-[13px] text-muted">
            ou 3 × 165,67 € sans frais avec Klarna · 🛡️ Garantie 14 jours
            satisfait ou remboursé · Accès immédiat
          </p>

          <dl className="mt-12 pt-8 border-t border-line flex flex-wrap gap-x-12 gap-y-5">
            <HeroStat value={String(stats.courseCount)} label="Parcours métiers" />
            <HeroStat value={String(stats.lessonCount)} label="Leçons structurées" />
            <HeroStat value={String(PROMPT_COUNT)} label="Prompts opérationnels" />
            <HeroStat value="14 j" label="Satisfait ou remboursé" />
          </dl>
        </div>
      </Container>
    </section>
  );
}

function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col">
      <dt className="font-serif text-3xl font-semibold text-ink leading-none">
        {value}
      </dt>
      <dd className="mt-1.5 text-[13px] text-muted">{label}</dd>
    </div>
  );
}

// =========================================
// Problème → pont (PAS condensé)
// =========================================
function PainBridge() {
  const pains = [
    {
      title: "Vous testez, mais rien ne tient",
      body: "Des prompts improvisés, des résultats aléatoires, et chaque tâche qui repart de zéro. L'IA reste un gadget au lieu de devenir un levier.",
    },
    {
      title: "Les tutos YouTube ne suffisent plus",
      body: "Des astuces en vrac, souvent en anglais, jamais reliées à votre métier. Ce qu'il vous manque, c'est une méthode progressive — pas plus de vidéos.",
    },
    {
      title: "Pendant ce temps, d'autres prennent l'avance",
      body: "Dans votre secteur, certains livrent déjà en 2 heures ce qui leur prenait 2 jours. La différence n'est pas le talent : c'est la méthode.",
    },
  ];
  return (
    <section className="bg-cream-soft py-20 md:py-28">
      <Container>
        <div className="text-center mb-14">
          <Eyebrow align="center">Le vrai problème</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl md:text-5xl font-medium leading-[1.15] tracking-tight text-ink">
            Utiliser Claude ne s&apos;improvise{" "}
            <span className="accent-serif">pas</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1040px] mx-auto">
          {pains.map((p) => (
            <article
              key={p.title}
              className="bg-white border border-line rounded-[22px] p-8"
            >
              <h3 className="font-serif text-xl font-semibold text-ink">
                {p.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">
                {p.body}
              </p>
            </article>
          ))}
        </div>
        <p className="mt-12 text-center text-lg leading-relaxed text-ink-soft max-w-[680px] mx-auto">
          ClaudeAI Academy est le pont entre les deux : une méthode structurée,
          leçon par leçon, du premier réglage jusqu&apos;aux workflows
          d&apos;expert — avec un QCM et des prompts à appliquer à chaque
          étape.
        </p>
      </Container>
    </section>
  );
}

// =========================================
// Ce que vous obtenez — programme condensé
// =========================================
async function WhatYouGet() {
  const stats = await getCatalogStats();
  const tracks = [
    { emoji: "🚦", label: "Bien démarrer avec Claude (zéro prérequis)" },
    { emoji: "💬", label: "Prompt engineering pro — le socle" },
    { emoji: "⌨️", label: "Claude Code & IA agentic pour les devs" },
    { emoji: "📊", label: "Data & SQL assistés par l'IA" },
    { emoji: "🚀", label: "Contenu & marketing" },
    { emoji: "🧭", label: "Stratégie & conduite de l'IA en entreprise" },
    { emoji: "📈", label: "Trading assisté par Claude Code" },
    { emoji: "🔐", label: "Prompts avancés, GitHub & sécurité" },
  ];
  return (
    <section className="py-20 md:py-28">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 items-center">
          <div>
            <Eyebrow>Le programme</Eyebrow>
            <h2 className="mt-4 font-serif text-3xl md:text-[2.75rem] font-medium leading-[1.15] tracking-tight text-ink">
              {stats.courseCount} parcours,{" "}
              <span className="accent-serif">un seul objectif</span> : que ça
              serve votre métier
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              Chaque parcours va du concret au concret : une notion, un prompt
              d&apos;exemple à appliquer immédiatement, un QCM pour ancrer.
              {" "}{stats.lessonCount} leçons au total, mises à jour en continu
              (dernière mise à jour : juillet 2026).
            </p>
            <div className="mt-8">
              <CheckoutButton tier="mastery" variant="primary" size="lg">
                Accéder aux {stats.courseCount} parcours · 497 €
              </CheckoutButton>
              <p className="mt-3 text-[13px] text-muted">
                ou 3 × 165,67 € sans frais avec Klarna · Garantie 14 jours
              </p>
            </div>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {tracks.map((t) => (
              <li
                key={t.label}
                className="flex items-start gap-3 bg-white border border-line rounded-[14px] px-5 py-4 text-[14px] leading-snug text-ink-soft"
              >
                <span aria-hidden="true" className="text-xl leading-none">
                  {t.emoji}
                </span>
                {t.label}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

// =========================================
// FAQ — objections spécifiques au trafic Ads
// =========================================
function LandingFAQ() {
  const items = [
    {
      q: "« Je peux apprendre tout ça gratuitement sur YouTube. »",
      a: "Oui — comme on peut apprendre le piano sur YouTube. Ce que vous achetez ici, ce n'est pas de l'information : c'est l'ordre dans lequel l'apprendre, les erreurs à éviter, et des prompts déjà testés sur des cas réels. Vous échangez des semaines de tri contre quelques heures de méthode.",
    },
    {
      q: "« Je n'ai pas le temps pour une formation. »",
      a: "Les leçons durent 8 à 15 minutes et chaque parcours est indépendant. L'accès est à vie : il n'y a ni cohorte, ni deadline, ni rythme imposé. Une leçon par jour suffit — et dès la première semaine, la formation vous fait gagner plus de temps qu'elle n'en prend.",
    },
    {
      q: "« Comment je sais que ça marchera pour moi ? »",
      a: "C'est exactement le rôle de la garantie : vous testez le programme complet pendant 14 jours. Si le contenu n'est pas à la hauteur, un email suffit et nous vous remboursons intégralement, sans justification à fournir.",
    },
    {
      q: "« Pourquoi Claude plutôt que ChatGPT ? »",
      a: "La méthode (structurer une demande, donner du contexte, itérer) se transfère à tous les outils d'IA. Mais Claude est aujourd'hui la référence pour le travail sérieux — texte long, code, analyse — et c'est le seul outil couvert ici en profondeur, en français.",
    },
    {
      q: "« Est-ce finançable par le CPF ? »",
      a: "Non, et c'est un choix : pas de dossier, pas de délai, pas d'organisme intermédiaire. Vous payez 47 € ou 497 € en direct (ou en 3× sans frais avec Klarna), vous accédez au contenu dans la minute, et la garantie 14 jours remplace la paperasse.",
    },
  ];
  return (
    <section className="py-20 md:py-28">
      <Container size="narrow">
        <div className="text-center mb-12">
          <Eyebrow align="center">Vos questions</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl md:text-[2.75rem] font-medium leading-[1.15] tracking-tight text-ink">
            Ce que vous vous demandez{" "}
            <span className="accent-serif">sûrement</span>
          </h2>
        </div>
        <div className="space-y-4">
          {items.map((it) => (
            <details
              key={it.q}
              className="group bg-white border border-line rounded-[16px] px-6 py-5"
            >
              <summary className="cursor-pointer list-none font-medium text-ink text-[16px] flex items-start justify-between gap-4">
                {it.q}
                <span
                  aria-hidden="true"
                  className="text-coral text-xl leading-none transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">
                {it.a}
              </p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}

// =========================================
// Filet de récupération — le visiteur payé qui n'achète pas aujourd'hui
// =========================================
// Un clic publicitaire coûte ~1,09 €. Sans ce bloc, les 98 à 99 % de
// visiteurs qui n'achètent pas immédiatement étaient perdus définitivement :
// la page ne captait aucune adresse, et aucun des prospects en base ne
// provenait de la publicité. Le kit gratuit existait déjà — il n'était
// simplement jamais proposé ici.
function NotTodayCapture() {
  return (
    <section className="bg-white border-t border-line py-20 md:py-24">
      <Container>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.05fr_1fr] md:items-center md:gap-16">
          <div>
            <Eyebrow>Pas aujourd&apos;hui ?</Eyebrow>
            <h2 className="mt-4 font-serif text-3xl md:text-[2.5rem] font-medium leading-[1.15] tracking-tight text-ink">
              Repartez au moins avec{" "}
              <span className="accent-serif">15 prompts</span>.
            </h2>
            <p className="mt-5 text-[17px] leading-relaxed text-muted max-w-[480px]">
              Le kit de démarrage est gratuit : 15 prompts prêts à copier,
              classés par métier, et la règle en trois points qui sépare
              l&apos;amateur du pro. Vous jugerez la méthode sur pièces avant de
              décider quoi que ce soit.
            </p>
          </div>
          <div className="md:justify-self-end">
            <LeadCaptureForm source="ads-formation-claude" />
          </div>
        </div>
      </Container>
    </section>
  );
}

// =========================================
// Dernier push
// =========================================
function LastCall() {
  return (
    <section className="bg-cream py-20 md:py-24">
      <Container size="narrow">
        <div className="text-center">
          <h2 className="font-serif text-3xl md:text-[2.5rem] font-medium leading-[1.2] tracking-tight text-ink">
            Dans 30 jours, vous aurez soit une méthode,{" "}
            <span className="accent-serif">soit les mêmes tâtonnements</span>.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted max-w-[560px] mx-auto">
            L&apos;accès complet coûte 497 € — ou 3 × 165,67 € sans frais. Il
            est immédiat, définitif, et la garantie 14 jours porte tout le
            risque à notre place. Le Pass Starter à 47 € reste là si vous
            préférez commencer petit.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <CheckoutButton tier="mastery" variant="primary" size="lg">
              Rejoindre Mastery · 497 € · Garantie 14 j
            </CheckoutButton>
            <Button href="#tarifs" variant="ghost" size="lg">
              Ou commencer à 47 €
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
