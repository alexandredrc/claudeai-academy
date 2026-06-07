import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import Link from "next/link";

export function Founder() {
  return (
    <section className="bg-white py-24 md:py-28">
      <Container size="narrow">
        <div className="text-center">
          <Eyebrow align="center">À l&apos;origine du projet</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl md:text-5xl font-medium leading-[1.15] tracking-tight text-ink">
            Pourquoi cette académie <span className="accent-serif">existe</span>
          </h2>
        </div>

        <div className="mt-10 max-w-[680px] mx-auto space-y-5 text-[17px] leading-[1.75] text-ink-soft text-center">
          <p>
            ClaudeAI Academy est portée par{" "}
            <strong className="text-ink font-semibold">Alexandre Dos Reis Caetano</strong>,
            fondateur d&apos;ADRC Group. Le constat de départ est simple : la majorité
            des contenus sur Claude sont soit superficiels, soit en anglais, soit
            produits par des gens qui ne l&apos;utilisent pas vraiment au quotidien.
          </p>
          <p>
            L&apos;objectif est de combler ce vide avec une référence francophone
            rigoureuse, opérationnelle, qui reste en phase avec les évolutions
            rapides de l&apos;écosystème.
          </p>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/a-propos"
            className="inline-flex items-center gap-1.5 text-coral font-semibold hover:text-coral-dark transition-colors"
          >
            Lire l&apos;histoire complète
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
