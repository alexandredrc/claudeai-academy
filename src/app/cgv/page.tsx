import type { Metadata } from "next";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import { LegalNotice } from "@/components/site/legal-notice";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente — ClaudeAI Academy",
  description:
    "Conditions générales de vente des formations ClaudeAI Academy : prix, paiement, accès à vie, garantie 14 jours, rétractation.",
};

export default function CgvPage() {
  return (
    <section className="pt-16 pb-24 md:pt-20 md:pb-32">
      <Container size="narrow">
        <Eyebrow>Conditions de vente</Eyebrow>
        <h1 className="mt-4 font-serif text-[clamp(2rem,4.5vw,3rem)] font-medium leading-[1.1] tracking-tight text-ink">
          Conditions Générales de Vente
        </h1>

        <LegalNotice />

        <div className="prose-lesson mt-10">
          <p>
            Dernière mise à jour&nbsp;: [À COMPLÉTER : date]. Les présentes
            conditions régissent la vente des formations en ligne proposées sur
            claudeai-academy.com par <strong>ADRC Group</strong> (ci-après «&nbsp;le
            Vendeur&nbsp;»).
          </p>

          <h2>1. Objet</h2>
          <p>
            Les présentes CGV définissent les droits et obligations des parties
            dans le cadre de la vente de formations numériques (parcours, leçons,
            prompts, templates et accès au Mentor IA) accessibles en ligne.
          </p>

          <h2>2. Prix</h2>
          <p>
            Les prix sont indiqués en euros, toutes taxes comprises&nbsp;:
          </p>
          <ul>
            <li>
              <strong>Pass Starter</strong> — 47&nbsp;€, paiement unique.
            </li>
            <li>
              <strong>Pass Mastery</strong> — 497&nbsp;€ en une fois, ou 3
              versements de 179&nbsp;€.
            </li>
          </ul>
          <p>
            Le Vendeur se réserve le droit de modifier ses prix à tout moment&nbsp;;
            les formations sont facturées sur la base du tarif en vigueur au
            moment de la commande.
          </p>

          <h2>3. Commande et paiement</h2>
          <p>
            Le paiement s’effectue en ligne, de manière sécurisée, via notre
            prestataire <strong>Stripe</strong>. Aucune donnée bancaire n’est
            stockée par le Vendeur. La commande est validée après confirmation du
            paiement, et une facture est délivrée automatiquement.
          </p>

          <h2>4. Accès à la formation</h2>
          <p>
            L’accès aux contenus achetés est ouvert immédiatement après
            validation du paiement, via un compte personnel. L’accès est{" "}
            <strong>accordé à vie</strong>, sans abonnement. Le Pass Mastery
            inclut les mises à jour ultérieures du contenu concerné.
          </p>

          <h2>5. Droit de rétractation et garantie</h2>
          <p>
            Conformément à l’article L221-28 du Code de la consommation, le droit
            de rétractation ne s’applique pas aux contenus numériques fournis
            immédiatement avec l’accord exprès du client. Indépendamment de ce
            cadre, le Vendeur offre une{" "}
            <strong>garantie «&nbsp;satisfait ou remboursé&nbsp;» de 14 jours</strong>
            &nbsp;: toute demande adressée à{" "}
            <a href="mailto:contact@claudeai-academy.com">
              contact@claudeai-academy.com
            </a>{" "}
            dans ce délai donne lieu à un remboursement intégral, sans
            justification.
          </p>

          <h2>6. Propriété intellectuelle</h2>
          <p>
            Les contenus sont réservés à un usage personnel et non transférable.
            Toute reproduction, partage de compte, diffusion ou revente est
            interdit et peut entraîner la suspension de l’accès sans
            remboursement.
          </p>

          <h2>7. Responsabilité</h2>
          <p>
            Les formations ont une vocation pédagogique. Le Vendeur ne saurait
            être tenu responsable des résultats obtenus, qui dépendent de la mise
            en œuvre par le client. Le Mentor IA fournit des réponses générées
            automatiquement, à vérifier avant tout usage critique.
          </p>

          <h2>8. Données personnelles</h2>
          <p>
            Le traitement des données est détaillé dans la{" "}
            <a href="/confidentialite">politique de confidentialité</a>.
          </p>

          <h2>9. Médiation et droit applicable</h2>
          <p>
            Les présentes CGV sont soumises au droit français. En cas de litige,
            le client peut recourir gratuitement à un médiateur de la
            consommation&nbsp;: [À COMPLÉTER : nom et coordonnées du médiateur]. À
            défaut d’accord amiable, les tribunaux compétents seront ceux du
            ressort applicable selon la loi.
          </p>

          <h2>10. Contact</h2>
          <p>
            <a href="mailto:contact@claudeai-academy.com">
              contact@claudeai-academy.com
            </a>
          </p>
        </div>
      </Container>
    </section>
  );
}
