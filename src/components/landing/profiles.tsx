import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";

const profiles = [
  {
    label: "Développeurs",
    body:
      "Vous voulez intégrer l'IA dans votre stack et passer de l'utilisation occasionnelle à la maîtrise complète de Claude Code et des APIs.",
  },
  {
    label: "Data analysts",
    body:
      "Vous codez du SQL toute la journée et vous voulez gagner un facteur 5 à 10 en faisant de l'IA votre nouveau bras droit analytique.",
  },
  {
    label: "Marketers et créateurs",
    body:
      "Vous produisez du contenu et voulez industrialiser sans tomber dans le piège du générique. Vous voulez la méthode pro.",
  },
  {
    label: "Managers et consultants",
    body:
      "Vous pilotez ou conseillez sur la transformation IA. Vous avez besoin d'un cadre solide pour identifier les bons cas et éviter les pièges.",
  },
];

export function Profiles() {
  return (
    <section className="bg-cream-soft py-24 md:py-32">
      <Container size="narrow">
        <div className="text-center mb-14">
          <Eyebrow align="center">Pour qui c&apos;est</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl md:text-5xl font-medium leading-[1.15] tracking-tight text-ink">
            Vous reconnaîtrez-vous <span className="accent-serif">dans ces profils</span> ?
          </h2>
        </div>

        {/* Liste éditoriale, pas une grille de 4 cartes */}
        <dl className="divide-y divide-line border-y border-line">
          {profiles.map((p) => (
            <div
              key={p.label}
              className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-3 md:gap-12 py-7 md:py-8"
            >
              <dt className="font-serif text-xl md:text-[1.35rem] font-semibold text-ink leading-snug">
                {p.label}
              </dt>
              <dd className="text-[15px] md:text-base leading-relaxed text-ink-soft">
                {p.body}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
