import type { Metadata } from "next";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import { Button } from "@/components/site/button";
import { FaqItem, type Item } from "./FaqItem";

export const metadata: Metadata = {
  title: "Claude AI : gratuit ou payant, Claude vs ChatGPT, formation — la FAQ",
  description:
    "Claude AI est-il gratuit ? Claude ou ChatGPT ? Quel modèle choisir en 2026 ? Existe-t-il une formation Claude en français ? Plus garantie 14 jours, accès à vie, Pass Starter vs Mastery : toutes les réponses.",
  alternates: { canonical: "/faq" },
};

type Group = { title: string; items: Item[] };

const groups: Group[] = [
  {
    title: "Claude AI en pratique",
    items: [
      {
        q: "Claude AI, c'est quoi ?",
        a: "Claude est un assistant d'intelligence artificielle développé par Anthropic. Il comprend et rédige parfaitement le français, analyse des documents (PDF, images, tableurs), écrit du code et automatise des tâches. Il est disponible sur le web (claude.ai), en application de bureau et sur mobile. Notre formation couvre toute la gamme d'usages, de la prise en main aux workflows avancés.",
      },
      {
        q: "Claude AI est-il gratuit ou payant ?",
        a: "Les deux. Le plan gratuit permet d'utiliser Claude avec des limites d'usage (enveloppes de 5 heures). Le plan Pro (17 $/mois en facturation annuelle, sinon 20 $/mois) multiplie l'usage et donne accès aux modèles les plus capables, à Claude Code et à Cowork. Le plan Max (dès 100 $/mois) s'adresse aux usages intensifs. La formation vous apprend à tirer le maximum de chaque plan — y compris du gratuit.",
      },
      {
        q: "Claude ou ChatGPT : lequel choisir en 2026 ?",
        a: "Cela dépend de vos usages. Claude excelle sur les documents longs (jusqu'à 1 million de tokens de contexte sur les modèles récents), la rédaction nuancée en français, le code (Claude Code est devenu une référence pour le développement assisté) et les workflows agentiques. ChatGPT dispose d'un écosystème plus large côté génération d'images et de vidéos. Beaucoup de professionnels utilisent les deux ; notre formation est dédiée à Claude.",
      },
      {
        q: "Quel est le meilleur modèle Claude en 2026 ?",
        a: "Il n'y a pas un meilleur modèle, mais un bon modèle par usage : Haiku 4.5 pour la vitesse et les questions simples, Sonnet 5 (sorti en juin 2026, le défaut) pour le travail quotidien, Opus 4.8 pour le code et le raisonnement exigeant, et Fable 5 pour les tâches les plus complexes. Le parcours « Bien démarrer avec Claude » consacre une leçon entière au choix du modèle et aux réglages d'effort et de réflexion.",
      },
      {
        q: "Comment bien prompter Claude ?",
        a: "Trois règles font 80 % du résultat : donner le contexte et le pourquoi (pas seulement la consigne), montrer un exemple du résultat attendu, et préciser le format de sortie. Notre bibliothèque de 170 prompts prêts à l'emploi applique ces règles, et le parcours Prompt Engineering les enseigne en profondeur avec les techniques officielles d'Anthropic.",
      },
      {
        q: "Existe-t-il une formation Claude AI en français ?",
        a: "Oui : ClaudeAI Academy est une formation Claude AI 100 % en français et en ligne, accessible dès 47 €. 8 parcours et 48 leçons couvrent la prise en main, le prompt engineering, Claude Code, la data, le marketing, la stratégie IA en entreprise et la sécurité. Vous avancez à votre rythme, avec un accès à vie et la première leçon de chaque parcours en accès libre.",
      },
      {
        q: "Claude Code, faut-il savoir coder pour s'y mettre ?",
        a: "Pas besoin d'être développeur professionnel : Claude Code écrit le code pour vous et le parcours vous apprend à le piloter (contexte, plans, garde-fous). Des bases de programmation aident cependant à relire et vérifier ce qu'il produit — c'est pourquoi le parcours enseigne aussi la méthode de vérification, pas seulement les commandes.",
      },
    ],
  },
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
        a: "Oui. Le parcours Bien démarrer avec Claude part de zéro : créer son compte, installer les applications, choisir son plan et son modèle, paramétrer et personnaliser Claude. Puis Prompt Engineering pose tous les fondamentaux. Aucun prérequis technique pour ces parcours ni pour Marketing et Stratégie. Pour Claude Code et Data & SQL, des bases de programmation sont recommandées.",
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
      {
        q: "La formation est-elle éligible au CPF ?",
        a: "Non, et c'est un choix : les formations Claude éligibles au CPF coûtent généralement 1 500 € et plus, avec dossier, délais et sessions imposées. Ici, c'est 47 € (ou 497 € pour tout le programme), un paiement en ligne, un accès immédiat et à vie — sans paperasse. La garantie 14 jours remplace le filet de sécurité administratif.",
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
            Vos questions sur Claude AI{" "}
            <span className="accent-serif">— et sur la formation</span>
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
