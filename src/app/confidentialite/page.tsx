import type { Metadata } from "next";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import { LegalNotice } from "@/components/site/legal-notice";

export const metadata: Metadata = {
  title: "Politique de confidentialité — ClaudeAI Academy",
  description:
    "Comment ClaudeAI Academy collecte, utilise et protège vos données personnelles, conformément au RGPD.",
};

export default function ConfidentialitePage() {
  return (
    <section className="pt-16 pb-24 md:pt-20 md:pb-32">
      <Container size="narrow">
        <Eyebrow>Vos données</Eyebrow>
        <h1 className="mt-4 font-serif text-[clamp(2rem,4.5vw,3rem)] font-medium leading-[1.1] tracking-tight text-ink">
          Politique de confidentialité
        </h1>

        <LegalNotice />

        <div className="prose-lesson mt-10">
          <p>
            Dernière mise à jour&nbsp;: [À COMPLÉTER : date]. La présente politique
            explique comment <strong>ADRC Group</strong> (éditeur de
            claudeai-academy.com) traite vos données personnelles, conformément
            au Règlement Général sur la Protection des Données (RGPD).
          </p>

          <h2>1. Responsable du traitement</h2>
          <p>
            ADRC Group — RCS Nanterre 892&nbsp;303&nbsp;082. Contact&nbsp;:{" "}
            <a href="mailto:contact@claudeai-academy.com">
              contact@claudeai-academy.com
            </a>
            . Délégué à la protection des données (le cas échéant)&nbsp;: [À
            COMPLÉTER].
          </p>

          <h2>2. Données collectées</h2>
          <ul>
            <li>
              <strong>Compte</strong>&nbsp;: adresse email, mot de passe (chiffré).
            </li>
            <li>
              <strong>Achat</strong>&nbsp;: données de facturation et historique de
              commande (le paiement est traité par Stripe&nbsp;; nous ne stockons
              aucune donnée bancaire).
            </li>
            <li>
              <strong>Progression</strong>&nbsp;: leçons consultées, avancement.
            </li>
            <li>
              <strong>Mentor IA</strong>&nbsp;: contenu des messages que vous
              envoyez au Mentor, pour fournir et limiter le service.
            </li>
            <li>
              <strong>Données techniques</strong>&nbsp;: logs, statistiques d’usage
              agrégées.
            </li>
          </ul>

          <h2>3. Finalités et bases légales</h2>
          <ul>
            <li>
              Fournir l’accès aux formations et gérer votre compte —{" "}
              <em>exécution du contrat</em>.
            </li>
            <li>
              Traiter les paiements et la facturation —{" "}
              <em>obligation légale et contractuelle</em>.
            </li>
            <li>
              Améliorer le service et le contenu — <em>intérêt légitime</em>.
            </li>
            <li>
              Communications liées à votre compte — <em>exécution du contrat</em>.
            </li>
          </ul>

          <h2>4. Sous-traitants et destinataires</h2>
          <p>
            Vos données sont partagées uniquement avec les prestataires
            nécessaires au service&nbsp;:
          </p>
          <ul>
            <li>
              <strong>Supabase</strong> — authentification et base de données.
            </li>
            <li>
              <strong>Stripe</strong> — traitement des paiements.
            </li>
            <li>
              <strong>Anthropic</strong> — fourniture du Mentor IA (modèle Claude).
            </li>
            <li>
              <strong>Resend</strong> — envoi des emails transactionnels.
            </li>
            <li>
              <strong>Vercel</strong> — hébergement du site.
            </li>
          </ul>
          <p>
            Certains prestataires peuvent être situés hors de l’Union européenne&nbsp;;
            les transferts sont alors encadrés par les garanties appropriées
            (clauses contractuelles types).
          </p>

          <h2>5. Durée de conservation</h2>
          <p>
            Les données de compte sont conservées tant que le compte est actif.
            Les données de facturation sont conservées conformément aux
            obligations légales (généralement 10 ans). Les messages au Mentor IA
            sont conservés [À COMPLÉTER : durée].
          </p>

          <h2>6. Vos droits</h2>
          <p>
            Conformément au RGPD, vous disposez d’un droit d’accès, de
            rectification, d’effacement, de limitation, de portabilité et
            d’opposition. Pour les exercer&nbsp;:{" "}
            <a href="mailto:contact@claudeai-academy.com">
              contact@claudeai-academy.com
            </a>
            . Vous pouvez également introduire une réclamation auprès de la CNIL
            (cnil.fr).
          </p>

          <h2>7. Cookies</h2>
          <p>
            Le site utilise les cookies strictement nécessaires à son
            fonctionnement (session, authentification). [À COMPLÉTER : préciser
            l’usage éventuel de cookies de mesure d’audience et le recueil du
            consentement le cas échéant.]
          </p>

          <h2>8. Contact</h2>
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
