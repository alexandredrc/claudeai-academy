import type { Metadata } from "next";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import { Button } from "@/components/site/button";
import { FaqItem, type Item } from "./FaqItem";

export const metadata: Metadata = {
  title: "FAQ formation Claude AI — ClaudeAI Academy",
  description:
    "Garantie 14 jours, accès à vie, différence Pass Starter / Pass Mastery, niveau requis, Mentor IA, paiement Stripe et facturation pro : toutes les réponses avant de vous lancer.",
  alternates: { canonical: "/faq" },
};

type Group = { title: string; items: Item[] };

const groups: Group[] = [
  {
    title: "Accès & garantie",
    items: [
      {
        q: "Et si je ne suis pas convaincu après l’achat ?",
        a: "Garantie 14 jours satisfait ou remboursé. Vous testez, vous formez votre opinion, et si ça ne vous convient pas, vous nous écrivez à contact@claudeai-academy.com et nous procédons au remboursement intégral. Pas de question, pas de justification à fournir.",
      },
      {
        q: "L’accès est-il vraiment à vie ?",
        a: "Oui. Vous payez une fois, vous gardez l’accès à vie — sans abonnement ni frais récurrents. Le Pass Mastery inclut en plus les mises à jour futures du contenu, à vie.",
      },
      {
        q: "Quelle est la différence entre Pass Starter et Pass Mastery ?",
        a: "Le Pass Starter (47 €) vous fait découvrir et couvre les fondamentaux. Le Pass Mastery (497 €, ou 3×179 €) débloque tous les parcours complets, le Mentor IA et les mises à jour à vie. C’est l’offre cœur du programme.",
      },
    ],
  },
  {
    title: "Contenu & niveau",
    items: [
      {
        q: "Je n’ai jamais rien fait en IA, c’est pour moi ?",
        a: "Oui. La leçon 1 du parcours Prompt Engineering pose tous les fondamentaux. Aucun prérequis technique pour les parcours Business, Marketing ou Prompt Engineering. Pour Claude Code et Data & IA, des bases de programmation sont recommandées.",
      },
      {
        q: "Combien de temps faut-il pour terminer le programme ?",
        a: "Comptez plusieurs heures de contenu structuré par parcours. La majorité des membres avancent en 3 à 6 semaines à raison de 2 sessions par semaine. Vous gardez l’accès à vie, donc rien ne vous oblige à courir.",
      },
      {
        q: "Le contenu sera-t-il dépassé dans 6 mois ?",
        a: "Les fondamentaux (prompt engineering, architecture d’agents, gouvernance) restent stables. Pour les évolutions plus rapides (Claude Code, MCP, nouvelles fonctionnalités), nous publions des mises à jour régulières — incluses à vie dans le Pass Mastery.",
      },
      {
        q: "En quoi c’est différent des cours gratuits sur YouTube ?",
        a: "La structure (un programme cohérent, pas des tutos isolés), la densité (on va à l’essentiel, sans remplissage) et l’écosystème (bibliothèque de prompts, templates, Mentor IA, mises à jour). Le tout dans un cadre francophone qui n’existe pas ailleurs.",
      },
      {
        q: "Qu’est-ce que le Mentor IA ?",
        a: "Un assistant propulsé par Claude, ancré sur le contenu de la formation, qui répond à vos questions et vous aide à progresser entre les sessions. Il est inclus dans le Pass Mastery.",
      },
    ],
  },
  {
    title: "Paiement & facturation",
    items: [
      {
        q: "Comment se passe le paiement ?",
        a: "Le paiement est sécurisé via Stripe (carte bancaire). Vos coordonnées bancaires ne transitent jamais par nos serveurs. L’accès est débloqué automatiquement après le paiement.",
      },
      {
        q: "J’ai une facture pro, c’est possible ?",
        a: "Oui. Vous indiquez vos coordonnées de facturation lors du paiement Stripe et recevez automatiquement une facture. Pour la TVA intracommunautaire, l’exonération s’applique automatiquement avec un numéro valide.",
      },
    ],
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: groups.flatMap((g) =>
    g.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  ),
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <section className="relative overflow-hidden pt-16 pb-10 md:pt-24 md:pb-12">
        <Container size="narrow">
          <nav className="text-[13px] text-muted mb-5" aria-label="Fil d’Ariane">
            <a href="/" className="hover:text-coral transition-colors">
              Accueil
            </a>
            <span aria-hidden="true" className="mx-2 opacity-50">
              /
            </span>
            <span className="text-ink-soft">FAQ</span>
          </nav>
          <Eyebrow>Questions fréquentes</Eyebrow>
          <h1 className="mt-4 font-serif text-[clamp(2.25rem,5vw,3.5rem)] font-medium leading-[1.05] tracking-tight text-ink">
            Tout ce que vous vous demandez <span className="accent-serif">avant de vous lancer</span>
          </h1>
        </Container>
      </section>

      <section className="bg-cream pb-24 md:pb-32">
        <Container size="narrow">
          <div className="space-y-12">
            {groups.map((group) => (
              <div key={group.title}>
                <h2 className="mb-5 text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">
                  {group.title}
                </h2>
                <ul className="space-y-3">
                  {group.items.map((item, i) => (
                    <FaqItem key={i} item={item} />
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-14 rounded-[22px] border border-line bg-white p-8 text-center shadow-card">
            <p className="font-serif text-xl text-ink">Une autre question ?</p>
            <p className="mt-2 text-[15px] text-muted">
              On répond sous 48 h ouvrées.
            </p>
            <div className="mt-5 flex justify-center">
              <Button href="/contact" variant="primary">
                Nous contacter
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
