import Link from "next/link";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import { FAQItem, type FaqEntry } from "@/components/landing/faq-item";
import { CONTENU_A_JOUR_AU, NOTES_DE_MISE_A_JOUR } from "@/lib/content/fraicheur";
import { maintenant, mensualiteKlarna3x, prixMastery } from "@/lib/offre/prix";

/**
 * Les 15 questions rédigées par le fondateur le 16/10/2026, corrigées sur les
 * faits vérifiés dans le code et en base le même jour :
 *  - « 20 minutes par semaine » : 22 h de pratique en 6 mois font ~50 min ;
 *  - « zéro ligne de code » : faux pour Claude Code (Starter), Data, Trading,
 *    GitHub ; la réponse dit que ces parcours sont facultatifs ;
 *  - certificat : Starter ET Mastery (lib/certification/core.ts), délivré par
 *    ClaudeAI Academy, jamais « par Anthropic » ;
 *  - Klarna : affiché sur Mastery et Accompagnement seulement ; non vérifié
 *    sur le Starter à 47 €, donc pas promis ; absent en Suisse ;
 *  - « pas de délai » au remboursement : la banque met quelques jours.
 * Prix et date lus à l'instant du rendu, côté serveur (prix.ts, fraicheur.ts) :
 * jamais l'horloge du navigateur, jamais une constante écrite à la main.
 */
function questions(): FaqEntry[] {
  const at = maintenant();
  const prix = prixMastery(at);
  return [
    {
      q: "Je n'ai jamais utilisé Claude. C'est pour moi ?",
      a: "Oui. La première leçon part de zéro : créer un compte, installer l'application, comprendre l'interface. Aucun prérequis technique. Les parcours métier sont écrits pour des gens qui n'ont jamais codé.",
    },
    {
      q: "Combien de temps ça me prend ?",
      a: "Une heure pour les 3 premières leçons : personnaliser Claude, être clair et direct, Claude dans Word, Excel et Outlook. Ensuite, à votre rythme : les 58 leçons demandent environ 22 heures avec la pratique. Accès à vie, vous pouvez étaler sur 6 mois si vous préférez.",
    },
    {
      q: "Est-ce que ça marche pour mon métier ?",
      a: "La méthode est la même dans tous les métiers : Claude écrit le premier jet, vous relisez, vous décidez. Quatre profils sont détaillés : artisans, commerces, consultants, dirigeants. Avec le Pass Mastery, le Mentor IA répond sur votre cas précis. Votre métier n'est pas dans la liste ? Écrivez-moi à contact@claudeai-academy.com, je réponds sous 24 h ouvrées.",
    },
    {
      q: `Pourquoi ${prix} € et pas gratuit sur YouTube ?`,
      a: `YouTube est gratuit, mais désorganisé, rarement daté et souvent en anglais. Ici, tout est structuré, en français, à jour au ${CONTENU_A_JOUR_AU}, avec 170 prompts prêts à copier. Vous arrêtez de chercher pendant des heures : tout est au même endroit.`,
    },
    {
      q: "Et si Claude change dans 6 mois ?",
      a: `Les mises à jour sont incluses à vie. Le contenu est vérifié et daté : ${NOTES_DE_MISE_A_JOUR} notes de mise à jour à ce jour. Chaque parcours porte sa propre date et change quand son sujet change.`,
      lien: { href: "/changelog", label: "Voir ce qui a changé" },
    },
    {
      q: "Puis-je payer en plusieurs fois ?",
      a: `Oui, en 3 fois sans frais avec Klarna : 3 × ${mensualiteKlarna3x(prix)} € pour le Pass Mastery, 3 × 499 € pour le Pass Accompagnement. Klarna donne son accord au moment du paiement. Le paiement en 3 fois n'est pas proposé dans tous les pays, dont la Suisse.`,
    },
    {
      q: "Y a-t-il un certificat ?",
      a: "Oui, avec chaque pass. Une fois les leçons de votre pass terminées, vous passez un examen de 20 questions. Réussi, il vous donne un certificat en PDF et une page de vérification en ligne. Il est délivré par ClaudeAI Academy, pas par Anthropic. Vous pouvez le montrer à un client ou à un employeur.",
    },
    {
      q: "Combien de temps ai-je accès ?",
      a: "À vie. Une fois payé, c'est à vous, mises à jour incluses. Pas d'abonnement, pas de renouvellement.",
    },
    {
      q: "Est-ce que je peux être remboursé ?",
      a: "Oui, 14 jours satisfait ou remboursé, sans justification. Vous m'écrivez à contact@claudeai-academy.com, je vous rembourse intégralement. Pas de formulaire, pas de question. Votre banque met ensuite quelques jours à créditer votre compte.",
    },
    {
      q: "Ça marche sur Mac, PC, mobile ?",
      a: "Oui. Claude fonctionne dans le navigateur, sur ordinateur et sur mobile. La formation aussi. Vous pouvez suivre une leçon sur votre téléphone entre deux rendez-vous.",
    },
    {
      q: "Je suis nul en informatique. C'est un problème ?",
      a: "Non. Si vous savez utiliser Word et envoyer un email, vous savez utiliser Claude. Le but est justement de rendre ça simple, sans jargon. Quatre parcours vont plus loin (Claude Code, données, trading, GitHub) : ils sont facultatifs.",
    },
    {
      q: "Est-ce que vous facturez la TVA ?",
      a: "Non, TVA non applicable, article 293 B du CGI : le prix affiché est le prix payé. Vous indiquez vos coordonnées de facturation au paiement et recevez une facture professionnelle par email.",
    },
    {
      q: "Puis-je offrir la formation ?",
      a: "Oui. Écrivez-moi à contact@claudeai-academy.com et je vous prépare un accès cadeau au nom de la personne. Pour un collaborateur, un associé ou un proche qui lance son activité.",
    },
    {
      q: "Que se passe-t-il après l'achat ?",
      a: "Vous recevez tout de suite un email avec votre lien de connexion. Vous pouvez commencer dans les 5 minutes. Pas de dossier CPF, pas de devis à attendre, pas de validation à obtenir.",
    },
    {
      q: "Qui est derrière ClaudeAI Academy ?",
      a: "Alexandre Dos Reis Caetano, Restaurant Manager en Suisse. Il utilise Claude tous les jours dans un métier de terrain, où une heure gagnée se voit tout de suite. Il a développé plusieurs applications, dont un outil de pilotage pour les hôtels et restaurants.",
      lien: { href: "/a-propos", label: "Voir sa bio complète" },
    },
  ];
}

export function FAQ() {
  const items = questions();
  return (
    <section className="bg-cream py-24 md:py-32">
      <Container size="narrow">
        <div className="text-center mb-14">
          <Eyebrow align="center">Questions fréquentes</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl md:text-5xl font-medium leading-[1.15] tracking-tight text-ink">
            Les <span className="accent-serif">objections</span>{" "}
            qu&apos;on nous remonte le plus
          </h2>
        </div>

        <ul className="space-y-3">
          {items.map((item, i) => (
            <FAQItem key={item.q} item={item} defaultOpen={i === 0} />
          ))}
        </ul>

        <div className="mt-10 text-center">
          <Link
            href="/faq"
            className="inline-flex items-center gap-1.5 text-coral font-semibold hover:text-coral-dark transition-colors"
          >
            Voir toutes les questions
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
