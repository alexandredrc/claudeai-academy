import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import Link from "next/link";

// L'académie vient d'ouvrir : pas (encore) de témoignages réels. Plutôt que
// d'inventer des avis — anti-pattern qui détruit la confiance — on s'appuie sur
// des preuves vérifiables. Les vrais témoignages des premiers membres
// remplaceront ce bloc dès qu'ils seront disponibles.
const proofs = [
  {
    icon: "📂",
    title: "Le programme est public avant l'achat",
    body: "Les 7 parcours et 40 leçons sont détaillés sur le site. Vous voyez exactement ce que vous achetez — titres, durées, compétences — avant de sortir la carte.",
  },
  {
    icon: "🛠️",
    title: "Conçue par un praticien, pas un théoricien",
    body: "Le site, le Mentor IA et les 40 leçons ont été construits en utilisant Claude au quotidien. On enseigne une méthode qu'on applique vraiment, à jour des derniers modèles.",
  },
  {
    icon: "🛡️",
    title: "14 jours pour juger sur pièces",
    body: "Vous testez le contenu réel. S'il n'est pas à la hauteur, un simple email suffit pour être remboursé intégralement. Le risque est entièrement de notre côté.",
  },
];

export function Testimonials() {
  return (
    <section className="bg-cream-soft py-24 md:py-32">
      <Container>
        <div className="mb-14 max-w-[680px]">
          <Eyebrow>La transparence d&apos;abord</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl md:text-5xl font-medium leading-[1.15] tracking-tight text-ink">
            Pas de faux avis.{" "}
            <span className="accent-serif">Des preuves vérifiables.</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            L&apos;académie vient d&apos;ouvrir. Plutôt que d&apos;inventer des
            témoignages — comme trop de formations en ligne — voici ce que vous
            pouvez vérifier vous-même avant de vous engager.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {proofs.map((p) => (
            <div
              key={p.title}
              className="bg-white border border-line rounded-[22px] p-8 flex flex-col"
            >
              <div aria-hidden="true" className="text-3xl">
                {p.icon}
              </div>
              <h3 className="mt-4 font-serif text-xl font-semibold text-ink leading-snug">
                {p.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-soft flex-1">
                {p.body}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-[15px] leading-relaxed text-muted max-w-[680px]">
          Vous faites partie des{" "}
          <strong className="text-ink">premiers membres</strong> : votre retour
          comptera vraiment, et c&apos;est ici qu&apos;il sera mis en avant.{" "}
          <Link
            href="/tarifs"
            className="text-coral font-semibold hover:text-coral-dark transition-colors"
          >
            Voir les formules →
          </Link>
        </p>
      </Container>
    </section>
  );
}
