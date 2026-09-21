import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/site/eyebrow";
import { Button } from "@/components/site/button";
import { createClient } from "@/lib/supabase/server";
import {
  certificationStatus,
  EXAM_QUESTIONS,
  EXAM_PASS_RATIO,
  programmeLabel,
} from "@/lib/certification/core";
import { ExamClient } from "./ExamClient";

export const metadata: Metadata = {
  title: "Examen de certification — ClaudeAI Academy",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ExamenPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/certification/examen");

  const status = await certificationStatus(user.id);
  const passPercent = Math.round(EXAM_PASS_RATIO * 100);

  return (
    <section className="py-16 md:py-24">
      <Container size="narrow">
        <nav className="mb-5 text-[13px] text-muted" aria-label="Fil d’Ariane">
          <Link href="/account" className="transition-colors hover:text-coral">
            Mon espace
          </Link>
          <span className="mx-2 text-line">/</span>
          <span>Examen de certification</span>
        </nav>

        <Eyebrow>Certification ClaudeAI Academy</Eyebrow>
        <h1 className="mt-4 font-serif text-[clamp(2rem,4.5vw,3rem)] font-medium leading-[1.08] tracking-tight text-ink">
          L’examen final
        </h1>

        {status.tier && (
          <p className="mt-5 text-lg leading-relaxed text-muted">
            {programmeLabel(status.tier)} — {status.lessonsCompleted} leçon
            {status.lessonsCompleted > 1 ? "s" : ""} terminée
            {status.lessonsCompleted > 1 ? "s" : ""} sur {status.lessonsTotal}.
          </p>
        )}

        <div className="mt-10">
          {/* Déjà certifié : on ne repasse pas un examen déjà réussi. */}
          {status.certification ? (
            <div className="rounded-[22px] border border-line bg-white p-8 md:p-10">
              <h2 className="font-serif text-2xl font-semibold text-ink">
                Vous êtes déjà certifié.
              </h2>
              <p className="mt-4 leading-relaxed text-ink-soft">
                Votre certificat a été délivré avec un score de{" "}
                {status.certification.score}/{status.certification.total}. Il reste
                disponible et vérifiable à tout moment.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button
                  href={`/certification/${status.certification.code}/certificat.pdf`}
                  variant="primary"
                >
                  Télécharger mon certificat
                </Button>
                <Button href={`/certification/${status.certification.code}`} variant="ghost">
                  Page de vérification
                </Button>
              </div>
            </div>
          ) : !status.tier ? (
            <div className="rounded-[22px] border border-line bg-white p-8 md:p-10">
              <h2 className="font-serif text-2xl font-semibold text-ink">
                L’examen est réservé aux membres.
              </h2>
              <p className="mt-4 leading-relaxed text-ink-soft">
                Il porte sur le contenu des parcours : il faut donc y avoir accès
                pour le passer.
              </p>
              <Button href="/tarifs" variant="primary" className="mt-7">
                Voir les pass — à partir de 47 €
              </Button>
            </div>
          ) : !status.lessonsDone ? (
            <div className="rounded-[22px] border border-line bg-white p-8 md:p-10">
              <h2 className="font-serif text-2xl font-semibold text-ink">
                Encore {status.lessonsTotal - status.lessonsCompleted} leçon
                {status.lessonsTotal - status.lessonsCompleted > 1 ? "s" : ""} à
                terminer.
              </h2>
              <p className="mt-4 leading-relaxed text-ink-soft">
                Le certificat atteste que vous avez suivi <em>tout</em> le
                programme. C’est ce qui lui donne sa valeur — et c’est pour ça que
                l’examen ne s’ouvre qu’une fois la dernière leçon validée.
              </p>

              <div className="mt-7">
                <div className="flex items-center justify-between text-[13px] text-muted">
                  <span>Progression</span>
                  <span>
                    {status.lessonsCompleted} / {status.lessonsTotal}
                  </span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-cream">
                  <div
                    className="h-full rounded-full bg-coral transition-all"
                    style={{
                      width: `${status.lessonsTotal ? (status.lessonsCompleted / status.lessonsTotal) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <Button href="/courses" variant="primary" className="mt-8">
                Reprendre où j’en suis
              </Button>
            </div>
          ) : (
            <ExamClient questionCount={EXAM_QUESTIONS} passPercent={passPercent} />
          )}
        </div>

        <p className="mt-8 text-[13px] leading-relaxed text-muted">
          ClaudeAI Academy est un organisme de formation privé et indépendant. Le
          certificat délivré atteste de la réussite de son programme ; il ne
          constitue pas un titre reconnu par l’État.
        </p>
      </Container>
    </section>
  );
}
