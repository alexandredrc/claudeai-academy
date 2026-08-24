import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { userHasTier, type CourseTier } from "@/lib/courses/access";
import { quizForLesson } from "@/lib/quizzes/library";
import { extractHeadings } from "@/lib/lessons/blocks";
import { RichLesson } from "@/components/lesson/rich-lesson";
import { LessonToc, ReadingProgress } from "@/components/lesson/interactive";
import { LessonQuiz } from "./Quiz";
import { markLessonCompleteAction } from "./actions";
import { startCheckoutAction } from "@/app/checkout/actions";
import { SITE_URL, ORG_ID, breadcrumbJsonLd, jsonLdScript } from "@/lib/seo/jsonld";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string; lesson: string }>;

type CourseRow = {
  id: string;
  slug: string;
  title: string;
  tier_required: CourseTier;
  display_order: number;
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

type LessonContent = LessonMeta & { content_md: string };

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug, lesson: lessonSlug } = await params;
  const supabase = await createClient();

  const { data: course } = await supabase
    .from("courses")
    .select("id, title")
    .eq("slug", slug)
    .single<Pick<CourseRow, "id" | "title">>();
  if (!course) return {};

  const { data: lesson } = await supabase
    .from("lessons")
    .select("title, description, is_free_preview")
    .eq("course_id", course.id)
    .eq("slug", lessonSlug)
    .single<Pick<LessonMeta, "title" | "description" | "is_free_preview">>();
  if (!lesson) return {};

  return {
    title: `${lesson.title} — ${course.title} | ClaudeAI Academy`,
    description:
      lesson.description ??
      `Leçon du parcours ${course.title} de ClaudeAI Academy, la formation francophone pour maîtriser Claude AI.`,
    alternates: { canonical: `/courses/${slug}/${lessonSlug}` },
    // Les leçons verrouillées n'exposent qu'un paywall : on ne les indexe pas.
    robots: lesson.is_free_preview ? undefined : { index: false },
  };
}

export default async function LessonPage({ params }: { params: Params }) {
  const { slug, lesson: lessonSlug } = await params;

  const supabase = await createClient();

  // 1) Lit le cours via user session (RLS OK : meta publique)
  const { data: course } = await supabase
    .from("courses")
    .select("id, slug, title, tier_required, display_order")
    .eq("slug", slug)
    .single<CourseRow>();
  if (!course) notFound();

  // 2) Lit la leçon meta via user session
  const { data: lessonMeta } = await supabase
    .from("lessons")
    .select(
      "id, slug, title, description, display_order, duration_min, is_free_preview",
    )
    .eq("course_id", course.id)
    .eq("slug", lessonSlug)
    .single<LessonMeta>();
  if (!lessonMeta) notFound();

  // 3) Vérifie l'accès au contenu
  const unlocked =
    lessonMeta.is_free_preview ||
    (await userHasTier(supabase, course.tier_required));

  // 4) Si autorisé, lit content_md via service_role (anon ne peut pas)
  let content: LessonContent | null = null;
  if (unlocked) {
    const { data, error } = await supabaseAdmin
      .from("lessons")
      .select(
        "id, slug, title, description, display_order, duration_min, is_free_preview, content_md",
      )
      .eq("id", lessonMeta.id)
      .single<LessonContent>();
    if (!error && data) {
      content = data;
    }
  }

  // 5) User context
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 6) État de progression
  let isCompleted = false;
  if (user) {
    const { data: progress } = await supabase
      .from("lesson_progress")
      .select("id")
      .eq("user_id", user.id)
      .eq("lesson_id", lessonMeta.id)
      .maybeSingle();
    isCompleted = !!progress;
  }

  // 6b) QCM d'auto-évaluation (en code, indépendant de la DB) + accès Mentor
  const quiz = content ? quizForLesson(lessonMeta.slug) : null;
  const hasMastery = user ? await userHasTier(supabase, "mastery") : false;
  const mentorHref = `/mentor?exercice=${encodeURIComponent(lessonMeta.title)}`;

  // 7) Navigation prev/next
  const { data: siblings } = await supabase
    .from("lessons")
    .select("id, slug, display_order, title")
    .eq("course_id", course.id)
    .order("display_order");
  const idx =
    siblings?.findIndex((s) => s.slug === lessonMeta.slug) ?? -1;
  const prev = idx > 0 ? siblings![idx - 1] : null;
  const next =
    siblings && idx >= 0 && idx < siblings.length - 1
      ? siblings[idx + 1]
      : null;

  // 8) Avancement dans le parcours : combien de leçons déjà terminées.
  const totalLessons = siblings?.length ?? 0;
  let completedInCourse = 0;
  if (user && siblings && siblings.length > 0) {
    const { count } = await supabase
      .from("lesson_progress")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .in(
        "lesson_id",
        siblings.map((s) => s.id),
      );
    completedInCourse = count ?? 0;
  }

  // 9) Sommaire, construit sur les titres de niveau 2 du contenu.
  const headings = content ? extractHeadings(content.content_md) : [];

  // 10) Balisage structuré. Seules les leçons en aperçu gratuit sont
  // indexables : leur baliser en `LearningResource` est ce qui les rend
  // citables par les moteurs génératifs sur des questions du type
  // « comment structurer un prompt ? ». Les leçons verrouillées n'affichent
  // qu'un paywall — les baliser reviendrait à décrire un contenu absent.
  const lessonJsonLd = lessonMeta.is_free_preview
    ? {
        "@context": "https://schema.org",
        "@type": ["LearningResource", "Article"],
        "@id": `${SITE_URL}/courses/${course.slug}/${lessonMeta.slug}#lesson`,
        headline: lessonMeta.title,
        name: lessonMeta.title,
        description: lessonMeta.description ?? undefined,
        url: `${SITE_URL}/courses/${course.slug}/${lessonMeta.slug}`,
        inLanguage: "fr-FR",
        learningResourceType: "Leçon",
        educationalLevel:
          course.tier_required === "mastery" ? "Intermédiaire" : "Débutant",
        timeRequired: lessonMeta.duration_min
          ? `PT${lessonMeta.duration_min}M`
          : undefined,
        isPartOf: { "@id": `${SITE_URL}/courses/${course.slug}#course` },
        publisher: { "@id": ORG_ID },
        author: {
          "@type": "Person",
          name: "Alexandre Dos Reis Caetano",
          url: `${SITE_URL}/a-propos`,
        },
        isAccessibleForFree: true,
      }
    : null;

  return (
    <section className="bg-cream">
      {lessonJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLdScript(lessonJsonLd)}
        />
      ) : null}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbJsonLd([
            { name: "Accueil", path: "/" },
            { name: "Parcours", path: "/courses" },
            { name: course.title, path: `/courses/${course.slug}` },
            {
              name: lessonMeta.title,
              path: `/courses/${course.slug}/${lessonMeta.slug}`,
            },
          ]),
        )}
      />
      {unlocked && content && <ReadingProgress targetId="lesson-body" />}
      <div className="mx-auto max-w-[760px] px-6 py-12 md:py-20">
        <Link
          href={`/courses/${course.slug}`}
          className="inline-block text-[13px] font-semibold text-coral hover:text-coral-dark"
        >
          ← {course.title}
        </Link>

        <header className="mt-6 border-b border-line pb-8">
          <div className="flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-coral">
            <span>
              Parcours {String(course.display_order).padStart(2, "0")}
              {" · "}
              Leçon {String(lessonMeta.display_order).padStart(2, "0")}
            </span>
            {lessonMeta.is_free_preview && (
              <span className="rounded-full bg-coral-soft px-2 py-0.5 text-[11px] text-coral-dark">
                Aperçu gratuit
              </span>
            )}
          </div>
          <h1 className="mt-4 font-serif text-4xl font-medium leading-[1.1] tracking-tight text-ink md:text-5xl">
            {lessonMeta.title}
          </h1>
          {lessonMeta.description && (
            <p className="mt-4 text-lg leading-relaxed text-muted">
              {lessonMeta.description}
            </p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-muted">
            <span>
              {lessonMeta.duration_min
                ? `${lessonMeta.duration_min} min de lecture`
                : "—"}
            </span>
            {quiz && (
              <span className="inline-flex items-center gap-1.5">
                <span aria-hidden>✎</span>
                {quiz.length} questions de quiz
              </span>
            )}
          </div>

          {totalLessons > 0 && (
            <CourseProgress
              current={idx >= 0 ? idx + 1 : lessonMeta.display_order}
              total={totalLessons}
              completed={completedInCourse}
              showCompleted={!!user}
            />
          )}
        </header>

        {unlocked && content ? (
          <>
            <LessonToc headings={headings} />

            <div id="lesson-body" className="mt-12">
              <RichLesson
                markdown={content.content_md}
                lessonSlug={lessonMeta.slug}
              />
            </div>

            {quiz && <LessonQuiz questions={quiz} />}

            {hasMastery && (
              <div className="mt-8 flex flex-col items-start gap-4 rounded-[22px] border border-coral-soft bg-coral-soft/20 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-serif text-lg font-medium text-ink">
                    Fais corriger ton exercice par le Mentor IA
                  </p>
                  <p className="mt-1 text-[14px] leading-relaxed text-ink-soft">
                    Colle ta réponse à l&apos;exercice : le Mentor l&apos;évalue
                    contre les critères de la leçon et te dit quoi améliorer.
                  </p>
                </div>
                <Link
                  href={mentorHref}
                  className="shrink-0 rounded-[14px] bg-coral px-5 py-2.5 text-sm font-semibold text-cream shadow-[0_4px_12px_rgba(217,119,87,0.25)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-coral-dark hover:shadow-[0_8px_20px_rgba(217,119,87,0.35)]"
                >
                  Ouvrir le Mentor →
                </Link>
              </div>
            )}

            {user && (
              <CompleteSection
                lessonId={lessonMeta.id}
                isCompleted={isCompleted}
                nextHref={
                  next ? `/courses/${course.slug}/${next.slug}` : null
                }
              />
            )}

            {!user && (
              <div className="mt-12 rounded-[22px] border border-line bg-cream-soft p-6 text-[14px] text-ink-soft">
                <Link
                  href="/login"
                  className="font-semibold text-coral hover:text-coral-dark"
                >
                  Connecte-toi
                </Link>{" "}
                pour suivre ta progression et reprendre où tu en étais.
              </div>
            )}
          </>
        ) : (
          <LessonPaywall
            tierRequired={course.tier_required}
            loggedIn={!!user}
          />
        )}

        <nav className="mt-16 flex items-center justify-between gap-4 border-t border-line pt-8 text-[14px]">
          {prev ? (
            <Link
              href={`/courses/${course.slug}/${prev.slug}`}
              className="group flex-1 text-left text-ink-soft hover:text-ink"
            >
              <span className="block text-[11px] uppercase tracking-[0.1em] text-muted">
                ← Précédent
              </span>
              <span className="block font-serif font-semibold">
                {prev.title}
              </span>
            </Link>
          ) : (
            <span className="flex-1" />
          )}
          {next ? (
            <Link
              href={`/courses/${course.slug}/${next.slug}`}
              className="group flex-1 text-right text-ink-soft hover:text-ink"
            >
              <span className="block text-[11px] uppercase tracking-[0.1em] text-muted">
                Suivant →
              </span>
              <span className="block font-serif font-semibold">
                {next.title}
              </span>
            </Link>
          ) : (
            <span className="flex-1" />
          )}
        </nav>
      </div>
    </section>
  );
}

/** Où j'en suis dans le parcours : position dans le sommaire + leçons validées. */
function CourseProgress({
  current,
  total,
  completed,
  showCompleted,
}: {
  current: number;
  total: number;
  completed: number;
  showCompleted: boolean;
}) {
  const positionPct = Math.round((current / total) * 100);
  const donePct = Math.round((completed / total) * 100);

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between text-[12px] text-muted">
        <span>
          Leçon <strong className="font-semibold text-ink">{current}</strong> sur{" "}
          {total}
        </span>
        {showCompleted && (
          <span>
            {completed === total
              ? "Parcours terminé 🎉"
              : `${donePct} % du parcours terminé`}
          </span>
        )}
      </div>
      <div
        className="relative mt-2 h-1.5 overflow-hidden rounded-full bg-cream-dark"
        role="progressbar"
        aria-label="Avancement dans le parcours"
        aria-valuenow={showCompleted ? donePct : positionPct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {/* Fond pâle : la position dans le sommaire. Plein : ce qui est validé. */}
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-coral-soft"
          style={{ width: `${positionPct}%` }}
        />
        {showCompleted && completed > 0 && (
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-coral"
            style={{ width: `${donePct}%` }}
          />
        )}
      </div>
    </div>
  );
}

function CompleteSection({
  lessonId,
  isCompleted,
  nextHref,
}: {
  lessonId: string;
  isCompleted: boolean;
  nextHref: string | null;
}) {
  if (isCompleted) {
    return (
      <div className="mt-12 flex flex-col items-start gap-4 rounded-[22px] border border-green/30 bg-green-soft p-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold text-green">
          ✓ Tu as terminé cette leçon.
        </p>
        {nextHref && (
          <Link
            href={nextHref}
            className="rounded-[14px] bg-coral px-5 py-2.5 text-sm font-semibold text-cream shadow-[0_4px_12px_rgba(217,119,87,0.25)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-coral-dark hover:shadow-[0_8px_20px_rgba(217,119,87,0.35)]"
          >
            Leçon suivante →
          </Link>
        )}
      </div>
    );
  }
  return (
    <form action={markLessonCompleteAction} className="mt-12">
      <input type="hidden" name="lesson_id" value={lessonId} />
      {nextHref && <input type="hidden" name="next_href" value={nextHref} />}
      <button
        type="submit"
        className="rounded-[14px] bg-coral px-6 py-3 text-sm font-semibold text-cream shadow-[0_4px_12px_rgba(217,119,87,0.25)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-coral-dark hover:shadow-[0_8px_20px_rgba(217,119,87,0.35)]"
      >
        Marquer comme terminée
      </button>
    </form>
  );
}

function LessonPaywall({
  tierRequired,
  loggedIn,
}: {
  tierRequired: CourseTier;
  loggedIn: boolean;
}) {
  const tierKey: "starter" | "mastery" =
    tierRequired === "mastery" ? "mastery" : "starter";
  const planLabel = tierRequired === "mastery" ? "Pass Mastery — 497 €" : "Pass Starter — 47 €";

  return (
    <div className="mt-12 rounded-[22px] border border-coral-soft bg-coral-soft/30 p-8 text-center">
      <span className="inline-block text-[12px] font-semibold uppercase tracking-[0.12em] text-coral">
        Leçon verrouillée
      </span>
      <h2 className="mt-3 font-serif text-2xl font-semibold text-ink">
        Le {planLabel.split(" — ")[0]} débloque ce contenu
      </h2>
      <p className="mx-auto mt-3 max-w-[480px] text-[15px] leading-relaxed text-ink-soft">
        Garantie 14 jours satisfait ou remboursé. Paiement sécurisé via Stripe.
      </p>
      <form action={startCheckoutAction} className="mt-6">
        <input type="hidden" name="plan" value={tierKey} />
        <button
          type="submit"
          className="rounded-[14px] bg-coral px-6 py-3 text-sm font-semibold text-cream shadow-[0_4px_12px_rgba(217,119,87,0.25)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-coral-dark hover:shadow-[0_8px_20px_rgba(217,119,87,0.35)]"
        >
          {loggedIn ? `Acheter le ${planLabel}` : `Créer un compte et acheter`}
        </button>
      </form>
    </div>
  );
}
