import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import { TemoignageForm } from "@/components/temoignage/temoignage-form";
import { pageMetadata } from "@/lib/seo/page-metadata";

// Page outil, liée depuis les emails de collecte : hors index.
export const metadata: Metadata = pageMetadata({
  path: "/temoignage",
  title: "Donner ton retour | ClaudeAI Academy",
  description:
    "Trois questions pour dire ce que Claude a changé dans ta semaine, chiffres à l'appui. Rien n'est publié sans ton accord écrit.",
  robots: { index: false, follow: false },
});

export default async function TemoignagePage({
  searchParams,
}: {
  searchParams: Promise<{ src?: string }>;
}) {
  const { src } = await searchParams;
  return (
    <section className="pt-16 pb-24 md:pt-20 md:pb-32">
      <Container size="narrow">
        <nav className="text-[13px] text-muted mb-5" aria-label="Fil d’Ariane">
          <Link href="/" className="hover:text-coral transition-colors">
            Accueil
          </Link>
          <span aria-hidden="true" className="mx-2 opacity-50">
            /
          </span>
          <span className="text-ink-soft">Ton retour</span>
        </nav>

        <Eyebrow>3 minutes</Eyebrow>
        <h1 className="mt-4 font-serif text-[clamp(2rem,4.5vw,3rem)] font-medium leading-[1.1] tracking-tight text-ink">
          Qu&apos;est-ce que Claude a changé{" "}
          <span className="accent-serif">dans ta semaine ?</span>
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted max-w-[620px]">
          Une tâche, le temps qu&apos;elle prenait avant, le temps qu&apos;elle
          prend maintenant. C&apos;est tout. Les retours publiés servent à
          d&apos;autres indépendants pour décider en connaissance de cause.
        </p>

        <div className="mt-10">
          <TemoignageForm source={src?.slice(0, 60)} />
        </div>
      </Container>
    </section>
  );
}
