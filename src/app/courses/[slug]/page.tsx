import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { userHasTier, type CourseTier } from "@/lib/courses/access";
import { startCheckoutAction } from "@/app/checkout/actions";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: course } = await supabase
    .from("courses")
    .select("title, description, total_lessons")
    .eq("slug", slug)
    .single<Pick<Course, "title" | "description" | "total_lessons">>();

  if (!course) return {};

  const description =
    course.description ??
    `Parcours ${course.title} : ${course.total_lessons} leçons pour maîtriser Claude AI en pratique.`;

  return {
    title: `${course.title}, formation Claude AI — ClaudeAI Academy`,
    description,
    alternates: { canonical: `/courses/${slug}` },
    openGraph: {
      title: `${course.title} — ClaudeAI Academy`,
      description,
    },
  };
}

function courseJsonLd(course: Course) {
  const price = course.tier_required === "mastery" ? "497" : "47";
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description ?? undefined,
    url: `https://www.claudeai-academy.com/courses/${course.slug}`,
    inLanguage: "fr-FR",
    provider: {
      "@type": "Organization",
      name: "ClaudeAI Academy",
      url: "https://www.claudeai-academy.com",
    },
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: "EUR",
      category: "Paid",
      url: "https://www.claudeai-academy.com/tarifs",
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Online",
      courseWorkload: course.estimated_duration_min
        ? `PT${course.estimated_duration_min}M`
        : undefined,
    },
  };
}

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

type LessonMeta = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  display_order: number;
  duration_min: number | null;
  is_free_preview: boolean;
};

type Params = Promise<{ slug: string }>;

export default async function CoursePage({ params }: { params: Params }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: course } = await supabase
    .from("courses")
    .select(
      "id, slug, title, description, tier_required, display_order, total_lessons, estimated_duration_min",
    )
    .eq("slug", slug)
    .single<Course>();

  if (!course) notFound();

  const { data: lessons } = await supabase
    .from("lessons")
    .select(
      "id, slug, title, description, display_order, duration_min, is_free_preview",
    )
    .eq("course_id", course.id)
    .order("display_order");

  const lessonList = (lessons ?? []) as LessonMeta[];
  const unlocked = await userHasTier(supabase, course.tier_required);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Si connecté, on récupère les leçons déjà terminées pour afficher l'état.
  let completedIds = new Set<string>();
  if (user) {
    const { data: progress } = await supabase
      .from("lesson_progress")
      .select("lesson_id")
      .eq("user_id", user.id)
      .in("lesson_id", lessonList.map((l) => l.id));
    completedIds = new Set((progress ?? []).map((p) => p.lesson_id));
  }

  const duration = course.estimated_duration_min
    ? `${Math.round(course.estimated_duration_min / 60 * 10) / 10} h`
    : null;
  const orderLabel = String(course.display_order).padStart(2, "0");
  const tierLabel =
    course.tier_required === "mastery"
      ? "Pass Mastery"
      : course.tier_required === "starter"
        ? "Pass Starter"
        : "Gratuit";

  return (
    <section className="bg-cream-soft">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd(course)) }}
      />
      <div className="mx-auto max-w-[860px] px-6 py-16 md:py-24">
        <Link
          href="/courses"
          className="inline-block text-[13px] font-semibold text-coral hover:text-coral-dark"
        >
          ← Tous les parcours
        </Link>

        <div className="mt-8 grid gap-6 md:grid-cols-[120px_1fr] md:gap-10">
          <div className="font-serif text-6xl font-medium leading-none text-coral md:text-7xl">
            {orderLabel}
          </div>
          <div>
            <h1 className="font-serif text-3xl font-medium leading-[1.1] tracking-tight text-ink md:text-5xl">
              {course.title}
            </h1>
            {course.description && (
              <p className="mt-4 text-lg leading-relaxed text-muted">
                {course.description}
              </p>
            )}
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-muted">
              <span>{course.total_lessons} leçons</span>
              {duration && <span>{duration} de contenu</span>}
              {unlocked ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-soft px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-green">
                  <span className="h-1.5 w-1.5 rounded-full bg-green" />
                  Débloqué
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-cream-dark px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-soft">
                  {tierLabel} requis
                </span>
              )}
            </div>
          </div>
        </div>

        {!unlocked && (
          <PaywallBlock
            tierRequired={course.tier_required}
            loggedIn={!!user}
          />
        )}

        <h2 className="mt-16 font-serif text-2xl font-semibold text-ink">
          Les leçons
        </h2>
        <ol className="mt-6 divide-y divide-line rounded-[22px] border border-line bg-white">
          {lessonList.map((lesson) => {
            const lessonAccess = unlocked || lesson.is_free_preview;
            const completed = completedIds.has(lesson.id);
            return (
              <li key={lesson.id}>
                <LessonRow
                  courseSlug={course.slug}
                  lesson={lesson}
                  unlocked={lessonAccess}
                  completed={completed}
                />
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function LessonRow({
  courseSlug,
  lesson,
  unlocked,
  completed,
}: {
  courseSlug: string;
  lesson: LessonMeta;
  unlocked: boolean;
  completed: boolean;
}) {
  const idx = String(lesson.display_order).padStart(2, "0");
  const inner = (
    <div className="flex items-start gap-5 p-5 md:p-6">
      <div className="font-serif text-2xl font-medium text-coral md:text-3xl">
        {idx}
      </div>
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-serif text-lg font-semibold text-ink">
            {lesson.title}
          </h3>
          {lesson.is_free_preview && (
            <span className="rounded-full bg-coral-soft px-2 py-0.5 text-[11px] font-semibold text-coral-dark">
              Aperçu gratuit
            </span>
          )}
          {completed && (
            <span className="rounded-full bg-green-soft px-2 py-0.5 text-[11px] font-semibold text-green">
              ✓ Terminé
            </span>
          )}
        </div>
        {lesson.description && (
          <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">
            {lesson.description}
          </p>
        )}
        <div className="mt-2 text-[12px] text-muted">
          {lesson.duration_min ? `${lesson.duration_min} min` : "—"}
        </div>
      </div>
      <div className="text-[13px] font-semibold text-coral">
        {unlocked ? "Lire →" : "🔒"}
      </div>
    </div>
  );

  if (unlocked) {
    return (
      <Link
        href={`/courses/${courseSlug}/${lesson.slug}`}
        className="block transition-colors hover:bg-cream-soft"
      >
        {inner}
      </Link>
    );
  }
  return <div className="opacity-60">{inner}</div>;
}

function PaywallBlock({
  tierRequired,
  loggedIn,
}: {
  tierRequired: CourseTier;
  loggedIn: boolean;
}) {
  const planLabel =
    tierRequired === "mastery"
      ? "Pass Mastery — 497 €"
      : tierRequired === "starter"
        ? "Pass Starter — 47 €"
        : "Pass";

  const tierKey: "starter" | "mastery" =
    tierRequired === "mastery" ? "mastery" : "starter";

  return (
    <div className="mt-10 rounded-[22px] border border-coral-soft bg-coral-soft/30 p-6 md:p-8">
      <span className="inline-block text-[12px] font-semibold uppercase tracking-[0.12em] text-coral">
        Accès restreint
      </span>
      <h2 className="mt-2 font-serif text-2xl font-semibold text-ink">
        Débloque ce parcours avec le {planLabel.split(" — ")[0]}
      </h2>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
        Tu peux lire la première leçon en aperçu gratuit ci-dessous. Pour
        accéder à l&apos;intégralité, prends le <strong className="font-semibold text-ink">{planLabel}</strong>.
        Garantie 14 jours.
      </p>
      <form action={startCheckoutAction} className="mt-5">
        <input type="hidden" name="plan" value={tierKey} />
        <button
          type="submit"
          className="rounded-[14px] bg-coral px-6 py-3 text-sm font-semibold text-cream shadow-[0_4px_12px_rgba(217,119,87,0.25)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-coral-dark hover:shadow-[0_8px_20px_rgba(217,119,87,0.35)]"
        >
          {loggedIn ? "Procéder au paiement" : "Créer un compte et acheter"}
        </button>
      </form>
    </div>
  );
}
