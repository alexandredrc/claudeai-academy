import Link from "next/link";
import type { CertificationStatus } from "@/lib/certification/core";

/**
 * Avancement vers la certification, affiché DANS l'espace membre.
 *
 * Raison d'être : au 21/09/2026, 24 leçons terminées en tout pour 6 membres sur
 * un catalogue de 49. Les gens paient et n'ouvrent pas. Un certificat posé sur
 * la page de vente ne sert à rien s'il n'est jamais rappelé à l'endroit exact
 * où l'on décroche — c'est-à-dire au milieu du parcours.
 *
 * L'objectif de ce bloc n'est donc pas d'annoncer une récompense, mais de
 * rendre la distance restante VISIBLE et petite : « encore 7 leçons » se
 * franchit, « terminer la formation » se remet à plus tard.
 */
export function CertificationProgress({
  status,
  variant = "full",
}: {
  status: CertificationStatus;
  variant?: "full" | "compact";
}) {
  // Sans achat, ou avec un catalogue vide, il n'y a rien à afficher.
  if (!status.tier || status.lessonsTotal === 0) return null;

  const { lessonsCompleted, lessonsTotal, lessonsDone, certification } = status;
  const restantes = Math.max(0, lessonsTotal - lessonsCompleted);
  const pourcent = Math.round((lessonsCompleted / lessonsTotal) * 100);

  // ── Déjà certifié ────────────────────────────────────────────────────────
  if (certification) {
    if (variant === "compact") {
      return (
        <div className="mt-10 rounded-[16px] border border-green/30 bg-green-soft px-5 py-4 text-[14px] text-ink">
          <strong>Vous êtes certifié.</strong>{" "}
          <Link
            href={`/certification/${certification.code}`}
            className="underline underline-offset-4"
          >
            Revoir votre certificat
          </Link>
        </div>
      );
    }
    return (
      <div className="mt-6 rounded-[22px] border border-line bg-white p-6 md:p-8">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-green">
          Certification obtenue
        </span>
        <h2 className="mt-3 font-serif text-2xl font-semibold text-ink">
          Votre certificat est délivré.
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
          Score à l’examen final : {certification.score}/{certification.total}.
          Le code <strong>{certification.code}</strong> permet à n’importe qui de
          le vérifier en ligne.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/certification/${certification.code}/certificat.pdf`}
            className="rounded-[14px] bg-coral px-6 py-3 text-sm font-semibold text-cream transition-all duration-200 hover:bg-coral-dark"
          >
            Télécharger le PDF
          </Link>
          <Link
            href={`/certification/${certification.code}`}
            className="rounded-[14px] border-[1.5px] border-ink px-6 py-3 text-sm font-semibold text-ink transition-all duration-200 hover:bg-ink hover:text-cream"
          >
            Page de vérification
          </Link>
        </div>
      </div>
    );
  }

  // ── Prêt à passer l'examen ───────────────────────────────────────────────
  if (lessonsDone) {
    if (variant === "compact") {
      return (
        <div className="mt-10 rounded-[16px] border-[1.5px] border-coral bg-coral-soft px-5 py-4">
          <p className="text-[15px] leading-relaxed text-ink">
            <strong>Vous avez terminé tout le programme.</strong> L’examen de
            certification est ouvert.{" "}
            <Link
              href="/certification/examen"
              className="font-semibold text-coral-dark underline underline-offset-4"
            >
              Le passer maintenant
            </Link>
          </p>
        </div>
      );
    }
    return (
      <div className="mt-6 rounded-[22px] border-[1.5px] border-coral bg-white p-6 md:p-8">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-coral">
          Examen ouvert
        </span>
        <h2 className="mt-3 font-serif text-2xl font-semibold text-ink">
          Vous avez terminé tout le programme.
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
          Il ne reste que l’examen final : 20 questions tirées dans l’ensemble de
          vos parcours, 80 % pour valider. Le certificat arrive par email dans la
          foulée.
        </p>
        <Link
          href="/certification/examen"
          className="mt-6 inline-block rounded-[14px] bg-coral px-6 py-3 text-sm font-semibold text-cream shadow-[0_4px_12px_rgba(217,119,87,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-coral-dark"
        >
          Passer l’examen de certification →
        </Link>
      </div>
    );
  }

  // ── En cours ─────────────────────────────────────────────────────────────
  const phrase =
    lessonsCompleted === 0
      ? "Votre certification commence à la première leçon."
      : `Encore ${restantes} leçon${restantes > 1 ? "s" : ""} avant de pouvoir passer l’examen.`;

  if (variant === "compact") {
    return (
      <div className="mt-10 rounded-[16px] border border-line bg-cream-soft px-5 py-4">
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-[14px] font-semibold text-ink">{phrase}</p>
          <span className="shrink-0 text-[13px] text-muted">
            {lessonsCompleted}/{lessonsTotal}
          </span>
        </div>
        <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-white">
          <div
            className="h-full rounded-full bg-coral transition-all duration-500"
            style={{ width: `${pourcent}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-[22px] border border-line bg-white p-6 md:p-8">
      <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-coral">
        Votre certification
      </span>
      <h2 className="mt-3 font-serif text-2xl font-semibold text-ink">{phrase}</h2>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
        Le certificat ClaudeAI Academy s’obtient en deux temps : terminer
        l’intégralité de votre parcours, puis réussir un examen final à 80 %. Il
        est nominatif, et vérifiable en ligne par toute personne à qui vous le
        montrez.
      </p>

      <div className="mt-6">
        <div className="flex items-center justify-between text-[13px] text-muted">
          <span>Progression</span>
          <span>
            {lessonsCompleted} / {lessonsTotal} leçons
          </span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-cream">
          <div
            className="h-full rounded-full bg-coral transition-all duration-500"
            style={{ width: `${pourcent}%` }}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/courses"
          className="rounded-[14px] bg-coral px-6 py-3 text-sm font-semibold text-cream shadow-[0_4px_12px_rgba(217,119,87,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-coral-dark"
        >
          {lessonsCompleted === 0 ? "Commencer la première leçon →" : "Reprendre où j’en suis →"}
        </Link>
        <Link
          href="/certification-claude-ai"
          className="rounded-[14px] border-[1.5px] border-line px-6 py-3 text-sm font-semibold text-ink-soft transition-colors hover:border-ink hover:text-ink"
        >
          Ce que vaut ce certificat
        </Link>
      </div>
    </div>
  );
}
