import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";

const symptoms = [
  {
    n: "01",
    title: "Vous tâtonnez à chaque tâche",
    body:
      "Pas de méthode reproductible, pas de bibliothèque de prompts qui marchent. Chaque mission redémarre de zéro.",
  },
  {
    n: "02",
    title: "Vous restez en surface",
    body:
      "System prompt, tool use, RAG, chain-of-thought. Vous savez que ça existe, mais pas comment vraiment l'utiliser.",
  },
  {
    n: "03",
    title: "Vos résultats sont aléatoires",
    body:
      "Parfois excellents, parfois décevants. Sans cadre, vous ne savez pas pourquoi ça marche, ou pas.",
  },
  {
    n: "04",
    title: "Vous ne sécurisez pas",
    body:
      "Prompt injection, fuite de données, garde-fous. Une zone aveugle qui devient critique en prod.",
  },
];

export function Problem() {
  return (
    <section className="bg-cream-soft py-24 md:py-32">
      <Container size="narrow">
        <div className="text-center mb-16">
          <Eyebrow align="center">Le constat</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl md:text-5xl font-medium leading-[1.15] tracking-tight text-ink">
            Vous utilisez Claude depuis des mois.
            <br />
            <span className="accent-serif">Vous n&apos;en tirez que 20 % du potentiel.</span>
          </h2>
          <p className="mt-7 text-lg leading-relaxed text-muted max-w-[640px] mx-auto">
            Les tutos YouTube tournent en rond, la doc est dense, et personne
            dans votre entourage n&apos;a vraiment industrialisé son usage.
            Résultat : vous avancez par tâtonnements, vous ratez les meilleures
            pratiques, et vous sentez que vos prompts pourraient être 10× meilleurs.
          </p>
        </div>

        {/* Liste éditoriale, pas une grille de 4 cartes identiques */}
        <ol className="mt-12 space-y-0">
          {symptoms.map((s, i) => (
            <li
              key={s.n}
              className={`grid grid-cols-[auto_1fr] gap-x-8 md:gap-x-12 py-7 md:py-9 ${
                i !== 0 ? "border-t border-line" : ""
              }`}
            >
              <span
                aria-hidden="true"
                className="font-serif text-3xl md:text-4xl text-coral/70 font-medium leading-none pt-1"
              >
                {s.n}
              </span>
              <div>
                <h3 className="font-serif text-xl md:text-2xl font-semibold text-ink leading-snug">
                  {s.title}
                </h3>
                <p className="mt-2.5 text-[15px] md:text-base leading-relaxed text-ink-soft max-w-[560px]">
                  {s.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
