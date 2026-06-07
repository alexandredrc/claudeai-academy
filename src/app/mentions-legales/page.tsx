import type { Metadata } from "next";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import { LegalNotice } from "@/components/site/legal-notice";

export const metadata: Metadata = {
  title: "Mentions légales — ClaudeAI Academy",
  description: "Mentions légales du site ClaudeAI Academy, édité par ADRC Group.",
};

export default function MentionsLegalesPage() {
  return (
    <section className="pt-16 pb-24 md:pt-20 md:pb-32">
      <Container size="narrow">
        <Eyebrow>Informations légales</Eyebrow>
        <h1 className="mt-4 font-serif text-[clamp(2rem,4.5vw,3rem)] font-medium leading-[1.1] tracking-tight text-ink">
          Mentions légales
        </h1>

        <LegalNotice />

        <div className="prose-lesson mt-10">
          <h2>Éditeur du site</h2>
          <p>
            Le site <strong>claudeai-academy.com</strong> est édité par{" "}
            <strong>ADRC Group</strong>, représentée par Alexandre Dos Reis
            Caetano.
            <br />
            RCS Nanterre&nbsp;: <strong>892&nbsp;303&nbsp;082</strong>.
            <br />
            Siège social&nbsp;: [À COMPLÉTER : adresse du siège].
            <br />
            SIRET&nbsp;: [À COMPLÉTER]. — Capital social&nbsp;: [À COMPLÉTER].
            <br />
            N° TVA intracommunautaire&nbsp;: [À COMPLÉTER].
            <br />
            Contact&nbsp;:{" "}
            <a href="mailto:contact@claudeai-academy.com">
              contact@claudeai-academy.com
            </a>
            .
          </p>

          <h2>Directeur de la publication</h2>
          <p>Alexandre Dos Reis Caetano.</p>

          <h2>Hébergement du site</h2>
          <p>
            Le site est hébergé par <strong>Vercel Inc.</strong>, 440 N Barranca
            Ave #4133, Covina, CA 91723, États-Unis —{" "}
            <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">
              vercel.com
            </a>
            .
          </p>
          <p>
            Le nom de domaine est enregistré auprès de{" "}
            <strong>OVH SAS</strong>, 2 rue Kellermann, 59100 Roubaix, France —{" "}
            <a href="https://www.ovhcloud.com" target="_blank" rel="noopener noreferrer">
              ovhcloud.com
            </a>
            .
          </p>

          <h2>Propriété intellectuelle</h2>
          <p>
            L’ensemble des contenus du site (textes, leçons, prompts, templates,
            visuels, code) est protégé par le droit de la propriété
            intellectuelle et reste la propriété exclusive de l’éditeur, sauf
            mention contraire. Toute reproduction, diffusion ou revente sans
            autorisation écrite est interdite.
          </p>

          <h2>Données personnelles</h2>
          <p>
            Le traitement de vos données est décrit dans notre{" "}
            <a href="/confidentialite">politique de confidentialité</a>. Les
            conditions d’achat figurent dans nos{" "}
            <a href="/cgv">conditions générales de vente</a>.
          </p>

          <h2>Contact</h2>
          <p>
            Pour toute question&nbsp;:{" "}
            <a href="mailto:contact@claudeai-academy.com">
              contact@claudeai-academy.com
            </a>
            .
          </p>
        </div>
      </Container>
    </section>
  );
}
