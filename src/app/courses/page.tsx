import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { userHasTier, type CourseTier } from "@/lib/courses/access";

export const dynamic = "force-dynamic";

type Course = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  tier_required: CourseTier;
  display_order: number;
  total_lessons: number;
  estimated_duration_min: number | null;
};

export default async function CoursesPage() {
  const supabase = await createClient();
  const { data: courses } = await supabase
    .from("courses")
    .select(
      "id, slug, title, description, tier_required, display_order, total_lessons, estimated_duration_min",
    )
    .order("display_order");

  const list = (courses ?? []) as Course[];

  // Check tier access pour chacun (parallèle).
  const access = await Promise.all(
    list.map((c) => userHasTier(supabase, c.tier_required)),
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <section className="bg-cream-soft">
      <div className="mx-auto max-w-[1100px] px-6 py-16 md:py-24">
        <span className="mb-5 inline-block text-[13px] font-semibold uppercase tracking-[0.12em] text-coral">
          Catalogue
        </span>
        <h1 className="font-serif text-4xl font-medium leading-[1.1] tracking-tight text-ink md:text-5xl">
          Les{" "}
          <span className="font-serif font-medium italic text-coral">
            5 parcours
          </span>{" "}
          de ClaudeAI Academy.
        </h1>
        <p className="mt-6 max-w-[640px] text-lg leading-relaxed text-muted">
          {user
            ? "Reprends où tu en étais ou découvre un nouveau parcours."
            : "Aperçu de ce que tu débloques en achetant un pass. La première leçon de chaque parcours est en accès libre."}
        </p>

        <div className="mt-14 space-y-5">
          {list.map((course, i) => (
            <CourseRow
              key={course.id}
              course={course}
              unlocked={access[i]}
              loggedIn={!!user}
            />
          ))}
        </div>

        {!user && (
          <div className="mt-16 rounded-[22px] border border-coral-soft bg-coral-soft/30 p-6 text-center md:p-8">
            <h2 className="font-serif text-2xl font-semibold text-ink">
              Prêt à débloquer l&apos;intégralité ?
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
              Pass Mastery à 497 € pour les 5 parcours, mentor IA, mises à jour
              à vie. Garantie 14 jours.
            </p>
            <Link
              href="/#tarifs"
              className="mt-6 inline-block rounded-[14px] bg-coral px-6 py-3 text-sm font-semibold text-cream shadow-[0_4px_12px_rgba(217,119,87,0.25)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-coral-dark hover:shadow-[0_8px_20px_rgba(217,119,87,0.35)]"
            >
              Voir les tarifs
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

function CourseRow({
  course,
  unlocked,
  loggedIn,
}: {
  course: Course;
  unlocked: boolean;
  loggedIn: boolean;
}) {
  const duration = course.estimated_duration_min
    ? `${Math.round(course.estimated_duration_min / 60 * 10) / 10} h`
    : null;

  const orderLabel = String(course.display_order).padStart(2, "0");

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group block rounded-[22px] border border-line bg-white p-6 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-coral-soft hover:shadow-[0_8px_24px_rgba(31,31,30,0.06)] md:p-8"
    >
      <div className="grid gap-6 md:grid-cols-[110px_1fr_auto] md:items-center">
        <div className="font-serif text-5xl font-medium leading-none text-coral md:text-6xl">
          {orderLabel}
        </div>
        <div>
          <h2 className="font-serif text-xl font-semibold text-ink md:text-2xl">
            {course.title}
          </h2>
          {course.description && (
            <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
              {course.description}
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-muted">
            <span>{course.total_lessons} leçons</span>
            {duration && <span>{duration} de contenu</span>}
          </div>
        </div>
        <div className="flex flex-col items-start gap-3 md:items-end">
          <AccessBadge tier={course.tier_required} unlocked={unlocked} />
          <span className="text-[13px] font-semibold text-coral transition-transform group-hover:translate-x-1">
            {loggedIn && unlocked ? "Reprendre →" : "Voir le détail →"}
          </span>
        </div>
      </div>
    </Link>
  );
}

function AccessBadge({
  tier,
  unlocked,
}: {
  tier: CourseTier;
  unlocked: boolean;
}) {
  if (unlocked) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-soft px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-green">
        <span className="h-1.5 w-1.5 rounded-full bg-green" />
        Débloqué
      </span>
    );
  }
  const label =
    tier === "mastery"
      ? "Pass Mastery"
      : tier === "starter"
        ? "Pass Starter"
        : "Gratuit";
  return (
    <span className="inline-flex items-center rounded-full bg-cream-dark px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-soft">
      {label} requis
    </span>
  );
}
