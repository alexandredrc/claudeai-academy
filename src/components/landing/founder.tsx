import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import Link from "next/link";

export function Founder() {
  return (
    <section className="bg-white py-24 md:py-28">
      <Container size="narrow">
        <div className="text-center mb-12">
          <Eyebrow align="center">À l&apos;origine du projet</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl md:text-5xl font-medium leading-[1.15] tracking-tight text-ink">
            Construite par quelqu&apos;un qui{" "}
            <span className="accent-serif">l&apos;utilise vraiment</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 md:gap-12 items-start max-w-[760px] mx-auto">
          {/*
            Photo du fondateur. En attendant le fichier réel, on affiche un
            monogramme propre. Pour mettre la vraie photo : déposer l'image dans
            /public (ex. /alexandre.jpg) et remplacer ce bloc par
            <Image src="/alexandre.jpg" alt="Alexandre Dos Reis Caetano" width={200} height={200} className="rounded-[22px] object-cover w-full aspect-square" />
          */}
          <div
            aria-hidden="true"
            className="mx-auto md:mx-0 w-[160px] h-[160px] md:w-full md:h-auto md:aspect-square rounded-[22px] bg-gradient-to-br from-coral to-[#E8A87C] flex items-center justify-center shadow-[0_12px_32px_rgba(217,119,87,0.25)]"
          >
            <span className="font-serif text-5xl font-semibold text-cream">
              A
            </span>
          </div>

          <div>
            <div className="space-y-5 text-[17px] leading-[1.75] text-ink-soft">
              <p>
                Je suis{" "}
                <strong className="text-ink font-semibold">
                  Alexandre Dos Reis Caetano
                </strong>
                , fondateur d&apos;ADRC Group. J&apos;utilise Claude tous les
                jours sur de vrais projets — au point d&apos;avoir construit
                cette académie avec : le site que vous lisez, le Mentor IA qui
                répond à vos questions, les 40 leçons. Tout est sorti de cette
                pratique quotidienne.
              </p>
              <p>
                Le constat de départ est simple : la majorité des contenus sur
                Claude sont soit superficiels, soit en anglais, soit produits par
                des gens qui ne l&apos;utilisent pas vraiment. ClaudeAI Academy
                comble ce vide — une référence francophone rigoureuse,
                opérationnelle, tenue à jour des dernières évolutions (Opus 4.8,
                Claude Code, skills, MCP).
              </p>
            </div>

            <p className="mt-6 font-serif text-xl italic text-ink">
              — Alexandre, fondateur
            </p>

            <div className="mt-6">
              <Link
                href="/a-propos"
                className="inline-flex items-center gap-1.5 text-coral font-semibold hover:text-coral-dark transition-colors"
              >
                Lire l&apos;histoire complète
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
