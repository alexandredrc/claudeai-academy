import type { Metadata } from "next";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import { Button } from "@/components/site/button";

export const metadata: Metadata = {
  title: "C'est bon — ton Kit t'attend",
  description: "Ton Kit de 15 prompts Claude est en route. Voici comment en tirer le maximum.",
  robots: { index: false, follow: false },
};

export default function MerciPage() {
  return (
    <section className="relative overflow-hidden pt-20 pb-28 md:pt-28 md:pb-36">
      <div
        aria-hidden="true"
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[520px] h-[420px] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(242,213,199,0.9), transparent 70%)",
        }}
      />
      <Container size="narrow">
        <div className="relative text-center">
          <Eyebrow>Inscription confirmée</Eyebrow>
          <h1 className="mt-5 font-serif text-[clamp(2rem,4.5vw,3.25rem)] font-medium leading-[1.08] tracking-tight text-ink">
            C&apos;est bon. <span className="accent-serif">Ton Kit t&apos;attend.</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted max-w-[560px] mx-auto">
            On vient de t&apos;envoyer un email avec ton accès. Tu peux aussi
            l&apos;ouvrir tout de suite, ci-dessous. Pense à vérifier tes spams
            si tu ne vois rien d&apos;ici deux minutes.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button href="/kit/ressources" variant="primary" size="lg">
              Ouvrir le Kit maintenant
            </Button>
            <Button href="/tarifs" variant="ghost" size="lg">
              Découvrir les formations
            </Button>
          </div>

          <p className="mt-12 text-[14px] leading-relaxed text-muted max-w-[480px] mx-auto">
            Un conseil : ne survole pas les 15 prompts. Choisis-en{" "}
            <span className="text-ink-soft">un seul</span> aujourd&apos;hui, celui
            qui colle à une tâche que tu fais ce soir. C&apos;est comme ça qu&apos;il
            devient une vraie habitude.
          </p>
        </div>
      </Container>
    </section>
  );
}
