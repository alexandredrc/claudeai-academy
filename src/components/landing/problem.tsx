import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";

// Réécrit le 15/10/2026 pour le public choisi (indépendants et TPE non
// techniques). L'ancienne version parlait de RAG, de tool use et de « prod »,
// et avançait « 20 % du potentiel » et « 10× » sans source. Chaque symptôme
// correspond à une leçon qui le traite : Personnaliser Claude, Être clair et
// direct, la bibliothèque de prompts, Paramétrer Claude (données personnelles,
// mode incognito) et Gouvernance et conformité (RGPD).
const symptoms = [
  {
    n: "01",
    title: "Des réponses qui ne parlent pas de vous",
    body:
      "Claude ne connaît ni votre métier, ni vos clients, ni votre façon d'écrire. Tant que vous ne le lui dites pas, il répond comme à n'importe qui.",
  },
  {
    n: "02",
    title: "Plus de temps à corriger qu'à écrire",
    body:
      "Une demande vague donne un texte vague. Vous le réécrivez entièrement, et vous en concluez que l'IA ne fait pas gagner de temps.",
  },
  {
    n: "03",
    title: "La page blanche à chaque fois",
    body:
      "Vous ne savez pas comment formuler la demande, alors vous ne demandez pas. Chaque tâche repart de zéro.",
  },
  {
    n: "04",
    title: "Le doute sur ce que vous pouvez lui confier",
    body:
      "Coordonnées de clients, chiffres, contrats : vous ne savez pas ce qui est sans risque. Dans le doute, vous ne l'utilisez pas.",
  },
];

export function Problem() {
  return (
    <section className="bg-cream-soft py-24 md:py-32">
      <Container size="narrow">
        <div className="text-center mb-16">
          <Eyebrow align="center">Le constat</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl md:text-5xl font-medium leading-[1.15] tracking-tight text-ink">
            Vous avez déjà essayé.
            <br />
            <span className="accent-serif">Et vous êtes revenu à la main.</span>
          </h2>
          <p className="mt-7 text-lg leading-relaxed text-muted max-w-[640px] mx-auto">
            La réponse était générique, il fallait tout reprendre, et au final
            c&apos;était plus rapide de le faire soi-même. Ce n&apos;est ni
            l&apos;outil ni vous : personne ne vous a montré quoi lui donner pour
            qu&apos;il réponde juste.
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
