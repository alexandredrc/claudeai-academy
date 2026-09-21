import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import { Button } from "@/components/site/button";
import { certificateByCode, programmeLabel } from "@/lib/certification/core";

/**
 * Page de vérification d'un certificat.
 *
 * C'est elle qui donne sa valeur au document : sans page de contrôle, un PDF
 * n'est qu'une image. Un recruteur tape le code, et voit ce que la base dit.
 *
 * `noindex` volontaire : ces pages portent le nom d'une personne. Les
 * référencer reviendrait à publier la liste de nos clients, et à laisser
 * n'importe qui les énumérer depuis Google. Le trafic organique sur
 * « certification » est capté par /certification-claude-ai, qui n'expose
 * personne.
 */
export const metadata: Metadata = {
  title: "Vérification d'un certificat — ClaudeAI Academy",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function frenchDate(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Paris",
  }).format(new Date(iso));
}

export default async function CertificatPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const cert = await certificateByCode(code);
  if (!cert) notFound();

  const pct = Math.round((cert.score / cert.total) * 100);

  return (
    <section className="py-16 md:py-24">
      <Container size="narrow">
        <nav className="mb-5 text-[13px] text-muted" aria-label="Fil d’Ariane">
          <Link href="/" className="transition-colors hover:text-coral">
            Accueil
          </Link>
          <span className="mx-2 text-line">/</span>
          <Link href="/certification-claude-ai" className="transition-colors hover:text-coral">
            Certification
          </Link>
          <span className="mx-2 text-line">/</span>
          <span>Vérification</span>
        </nav>

        {cert.revoked ? (
          <div className="rounded-[22px] border-2 border-coral bg-coral-soft p-9 md:p-12">
            <Eyebrow>Certificat révoqué</Eyebrow>
            <h1 className="mt-4 font-serif text-3xl font-medium text-ink md:text-4xl">
              Ce certificat n’est plus valide.
            </h1>
            <p className="mt-5 leading-relaxed text-ink-soft">
              Le code <strong>{cert.code}</strong> correspond bien à un certificat
              délivré par ClaudeAI Academy, mais celui-ci a été révoqué. Pour toute
              question, écrivez à contact@claudeai-academy.com.
            </p>
          </div>
        ) : (
          <div className="rounded-[22px] border border-line bg-white p-9 md:p-12">
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-soft text-[13px] font-bold text-green"
              >
                ✓
              </span>
              <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-green">
                Certificat authentique
              </span>
            </div>

            <h1 className="mt-6 font-serif text-[clamp(2rem,4.5vw,2.9rem)] font-medium leading-[1.1] text-ink">
              {cert.holderName}
            </h1>
            <p className="mt-3 text-lg text-muted">
              a suivi l’intégralité du programme et réussi l’examen final.
            </p>

            <dl className="mt-9 grid grid-cols-1 gap-x-10 gap-y-6 border-t border-line pt-8 sm:grid-cols-2">
              <div>
                <dt className="text-[12px] font-semibold uppercase tracking-[0.1em] text-muted">
                  Programme
                </dt>
                <dd className="mt-1.5 text-[15px] text-ink">{programmeLabel(cert.tier)}</dd>
              </div>
              <div>
                <dt className="text-[12px] font-semibold uppercase tracking-[0.1em] text-muted">
                  Délivré le
                </dt>
                <dd className="mt-1.5 text-[15px] text-ink">{frenchDate(cert.issuedAt)}</dd>
              </div>
              <div>
                <dt className="text-[12px] font-semibold uppercase tracking-[0.1em] text-muted">
                  Examen final
                </dt>
                <dd className="mt-1.5 text-[15px] text-ink">
                  {cert.score} / {cert.total} — {pct} %
                </dd>
              </div>
              <div>
                <dt className="text-[12px] font-semibold uppercase tracking-[0.1em] text-muted">
                  Leçons validées
                </dt>
                <dd className="mt-1.5 text-[15px] text-ink">{cert.lessonsCompleted}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-[12px] font-semibold uppercase tracking-[0.1em] text-muted">
                  Code de vérification
                </dt>
                <dd className="mt-1.5 font-mono text-[15px] tracking-wide text-ink">
                  {cert.code}
                </dd>
              </div>
            </dl>

            <div className="mt-9 flex flex-wrap gap-3">
              <Button href={`/certification/${cert.code}/certificat.pdf`} variant="primary">
                Télécharger le PDF
              </Button>
              <Button href="/certification-claude-ai" variant="ghost">
                Ce que vaut ce certificat
              </Button>
            </div>
          </div>
        )}

        <p className="mt-8 text-[13px] leading-relaxed text-muted">
          ClaudeAI Academy est un organisme de formation privé et indépendant. Ce
          certificat atteste de la réussite de son programme ; il ne constitue pas
          un titre reconnu par l’État et n’est enregistré à aucun répertoire
          national. ClaudeAI Academy n’est ni affiliée à Anthropic, éditeur de
          Claude, ni approuvée par elle.
        </p>
      </Container>
    </section>
  );
}
