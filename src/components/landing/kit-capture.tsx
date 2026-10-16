import Link from "next/link";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import { LeadCaptureForm } from "@/components/landing/lead-capture-form";

/**
 * Le kit gratuit dans le corps de l'accueil (16/10/2026). Il n'était
 * proposé que par un lien du menu et du pied de page : le visiteur qui
 * n'est pas prêt à payer quittait la page sans rien laisser.
 *
 * Bloc dans la page, pas une fenêtre surgissante : Google déclasse sur
 * mobile les interstitiels qui masquent le contenu, et le refus d'un
 * pop-up à l'arrivée a déjà été tranché le 21/09/2026.
 *
 * Source distincte (« accueil-kit ») pour mesurer ce bloc à part de /kit.
 */
export function KitCapture() {
  return (
    <section className="bg-white py-20 md:py-24">
      <Container size="narrow">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_440px] gap-10 md:gap-14 items-center">
          <div>
            <Eyebrow>Pas encore décidé ?</Eyebrow>
            <h2 className="mt-4 font-serif text-3xl md:text-4xl font-medium leading-[1.15] tracking-tight text-ink">
              Commencez par le kit gratuit :{" "}
              <span className="accent-serif">15 prompts prêts à copier.</span>
            </h2>
            <p className="mt-5 text-[16px] leading-relaxed text-muted">
              Classés par situation : restauration et commerce, indépendants,
              management, marketing. Vous les recevez par email, sans carte
              bancaire.{" "}
              <Link
                href="/kit"
                className="text-ink underline underline-offset-4 decoration-line hover:text-coral transition-colors"
              >
                Voir le contenu du kit
              </Link>
            </p>
          </div>
          <LeadCaptureForm source="accueil-kit" />
        </div>
      </Container>
    </section>
  );
}
