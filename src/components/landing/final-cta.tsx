import Link from "next/link";
import { Container } from "@/components/site/container";
import { CheckoutButton } from "@/components/site/checkout-button";
import { getCatalogStats } from "@/lib/courses/stats";
import { MESURES_SEMAINE, duree, mesure, type Mesure } from "@/lib/offre/mesures";

const SEMAINES_PAR_MOIS = 4;
const LECON_LIBRE_HREF =
  "/courses/bien-demarrer-avec-claude/claude-dans-excel-powerpoint-word-et-chrome";

// Le dernier écran parle du résultat (16/10/2026) : avant, « Prêt à devenir
// opérationnel sur Claude ? », une promesse d'outil et non de temps rendu.
// Le chiffre vient des temps mesurés (lib/offre/mesures.ts), même calcul que
// la section « Mesuré, pas promis ».
export async function FinalCTA() {
  const stats = await getCatalogStats();
  const semaine = MESURES_SEMAINE.map(mesure).filter((m): m is Mesure => Boolean(m));
  const gainMin =
    semaine.reduce((s, m) => s + (m.sans - m.avec), 0) * SEMAINES_PAR_MOIS;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-ink to-[#2D2A26] text-cream py-20 md:py-24">
      <div
        aria-hidden="true"
        className="absolute -top-24 -right-24 w-[400px] h-[400px] rounded-full opacity-25 blur-3xl"
        style={{
          background: "radial-gradient(circle, var(--color-coral), transparent 70%)",
        }}
      />
      <Container>
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="max-w-[600px]">
            <h2 className="font-serif text-3xl md:text-[2.5rem] font-medium leading-[1.2] tracking-tight">
              Une relance, un compte rendu, une réponse client par semaine :{" "}
              <span className="accent-serif">{duree(gainMin)} rendues chaque mois.</span>
            </h2>
            <p className="mt-3 text-cream/70 text-[17px] leading-relaxed">
              Ce sont mes temps mesurés, pas une promesse. Les trois premières
              leçons prennent une heure. {stats.lessonCount} leçons, accès à
              vie, garantie 14 jours satisfait ou remboursé.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-3">
              <CheckoutButton tier="mastery" variant="primary" size="lg">
                Rejoindre Mastery, 497 €
              </CheckoutButton>
              <CheckoutButton tier="starter" variant="ghost-light" size="lg">
                Commencer avec Starter, 47 €
              </CheckoutButton>
            </div>
            <Link
              href={LECON_LIBRE_HREF}
              className="text-[15px] text-cream/70 underline underline-offset-4 decoration-cream/30 hover:text-coral-soft transition-colors"
            >
              Ou lire une leçon gratuite d&apos;abord
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
