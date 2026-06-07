import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";

const items = [
  {
    quote:
      "Les modules sur le prompt engineering vont droit au but. J'ai appliqué les techniques de structuration XML dès la première semaine sur mes projets. Le gain de qualité est spectaculaire.",
    name: "Mathieu T.",
    role: "Beta-testeur, développeur freelance",
    gradient: "from-coral to-[#F4A261]",
  },
  {
    quote:
      "Enfin une formation qui met Claude au cœur du parcours, et pas en option. Les exercices pratiques sont denses, et le mentor IA aide vraiment à progresser entre les sessions.",
    name: "Camille R.",
    role: "Beta-testeuse, chargée de projet digital",
    gradient: "from-green to-[#76C893]",
  },
  {
    quote:
      "J'ai testé pas mal de cours en ligne sur l'IA. Ici on est dans le concret : architecture d'agents, RAG, tool use. Le contenu est pensé par des praticiens, ça se sent.",
    name: "Yasmine B.",
    role: "Beta-testeuse, data analyst",
    gradient: "from-[#8B5CF6] to-coral",
  },
];

export function Testimonials() {
  return (
    <section className="bg-cream-soft py-24 md:py-32">
      <Container>
        <div className="mb-14 max-w-[640px]">
          <Eyebrow>Premiers retours</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl md:text-5xl font-medium leading-[1.15] tracking-tight text-ink">
            Ce que disent <span className="accent-serif">les beta-testeurs</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((t) => (
            <blockquote
              key={t.name}
              className="bg-white border border-line rounded-[22px] p-8 flex flex-col"
            >
              <p className="font-serif text-[17px] italic leading-[1.55] text-ink flex-1">
                &laquo; {t.quote} &raquo;
              </p>
              <footer className="mt-7 flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className={`w-11 h-11 rounded-full bg-gradient-to-br ${t.gradient}`}
                />
                <div>
                  <strong className="block text-[14px] text-ink font-semibold">
                    {t.name}
                  </strong>
                  <span className="text-[12px] text-muted">{t.role}</span>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </Container>
    </section>
  );
}
