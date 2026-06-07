import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { userHasTier, type CourseTier } from "@/lib/courses/access";
import { markLessonCompleteAction } from "./actions";
import { startCheckoutAction } from "@/app/checkout/actions";

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

  // 7) Navigation prev/next
  const { data: siblings } = await supabase
    .from("lessons")
    .select("slug, display_order, title")
    .eq("course_id", course.id)
    .order("display_order");
  const idx =
    siblings?.findIndex((s) => s.slug === lessonMeta.slug) ?? -1;
  const prev = idx > 0 ? siblings![idx - 1] : null;
  const next =
    siblings && idx >= 0 && idx < siblings.length - 1
      ? siblings[idx + 1]
      : null;

  return (
    <section className="bg-cream">
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
          <div className="mt-4 text-[13px] text-muted">
            {lessonMeta.duration_min
              ? `${lessonMeta.duration_min} minutes de lecture`
              : "—"}
          </div>
        </header>

        {unlocked && content ? (
          <>
            <article className="prose-lesson mt-12">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content.content_md}
              </ReactMarkdown>
            </article>

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
