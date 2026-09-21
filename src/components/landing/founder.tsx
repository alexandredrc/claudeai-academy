import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import { InstagramIcon, INSTAGRAM_URL, INSTAGRAM_HANDLE } from "@/components/site/instagram";

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
                , <strong className="text-ink font-semibold">
                  Restaurant Manager en Suisse
                </strong>
                . Je ne viens pas de la tech : j&apos;utilise Claude tous les
                jours dans un métier de terrain, là où une heure gagnée se voit
                tout de suite.
              </p>
              <p>
                Cette pratique quotidienne m&apos;a mené à développer plusieurs
                applications — dont une destinée aux hôtels et restaurants, un
                outil de pilotage pour aider les directeurs et les patrons
                d&apos;établissement à mieux gérer leur affaire. Cette académie
                est sortie du même mouvement : le site que vous lisez, le Mentor
                IA qui répond à vos questions, les 49 leçons.
              </p>
              <p>
                Le constat de départ est simple : la majorité des contenus sur
                Claude sont soit superficiels, soit en anglais, soit produits par
                des gens qui ne l&apos;utilisent pas vraiment. ClaudeAI Academy
                comble ce vide — une référence francophone rigoureuse,
                opérationnelle, tenue à jour des dernières évolutions (Opus 5,
                Claude Code, skills, MCP).
              </p>
            </div>

            <p className="mt-6 font-serif text-xl italic text-ink">
              — Alexandre, fondateur
            </p>

            {/*
              On remplace « Lire l'histoire complète » par le compte personnel.
              Une page « à propos » se rédige ; un compte Instagram tenu au
              quotidien ne se fabrique pas. Sur un marché où beaucoup vendent
              derrière un pseudo, c'est la preuve la moins coûteuse et la plus
              convaincante qu'il y a quelqu'un de réel derrière.
            */}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 flex items-start gap-4 rounded-[18px] border border-line bg-cream-soft p-5 transition-colors hover:border-coral"
            >
              <InstagramIcon className="mt-0.5 h-6 w-6 shrink-0 text-coral" />
              <span className="block">
                <span className="block font-semibold text-ink">
                  {INSTAGRAM_HANDLE}
                </span>
                <span className="mt-1 block text-[15px] leading-relaxed text-muted">
                  Mon compte Instagram personnel. Vous y voyez mon quotidien, mon
                  travail et mon visage — de quoi vérifier par vous-même qu&apos;il
                  y a bien quelqu&apos;un de réel derrière cette académie. Écrivez-moi
                  en message privé, je réponds.
                </span>
              </span>
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
