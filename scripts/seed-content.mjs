// =========================================
// ClaudeAI Academy — Seed contenu
// Usage : node --env-file=.env.local scripts/seed-content.mjs
// Idempotent : ré-exécutable, upsert sur slug.
//
// Parcours 01 : contenu RÉEL, sourcé Tier 1 (doc officielle Anthropic
//   « Prompting best practices », vérifiée 2026-05-15). À jour Opus 4.8 :
//   adaptive thinking, effort parameter, prefill retiré, littéralisme 4.8.
// Parcours 01-08 : contenu réel. Parcours « Bien démarrer » ajouté le 2026-07-04
//   (sources : support.claude.com + claude.com/pricing, vérifiées 2026-07-04).
// =========================================

import { createClient } from "@supabase/supabase-js";
import { bienDemarrerAvecClaude } from "./content/bien-demarrer.mjs";
import { tradingClaudeCode } from "./content/trading-claude-code.mjs";
import { githubPromptsSecurite } from "./content/github-prompts-securite.mjs";
import { claudeCodeIaAgentic } from "./content/claude-code.mjs";
import { strategieConduiteIa } from "./content/strategie-ia.mjs";
import { contenuEtMarketing } from "./content/marketing-contenu.mjs";
import { claudeDataSql } from "./content/data-sql.mjs";
import { promptEngineeringPro } from "./content/prompt-engineering.mjs";

// Client créé paresseusement : le module est aussi importé par gen-sql.mjs
// (génération SQL hors-ligne) où les variables d'env Supabase sont absentes.
let supabase;
function getSupabase() {
  supabase ??= createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
  return supabase;
}


export const COURSES = [
  bienDemarrerAvecClaude,
  promptEngineeringPro,
  claudeCodeIaAgentic,
  claudeDataSql,
  contenuEtMarketing,
  strategieConduiteIa,
  tradingClaudeCode,
  githubPromptsSecurite,
];

async function seed() {
  const supabase = getSupabase();
  let coursesUpserted = 0;
  let lessonsUpserted = 0;

  for (const c of COURSES) {
    const { lessons, ...courseInput } = c;
    const totalLessons = lessons.length;

    const { data: course, error: courseErr } = await supabase
      .from("courses")
      .upsert(
        { ...courseInput, total_lessons: totalLessons },
        { onConflict: "slug" },
      )
      .select()
      .single();

    if (courseErr || !course) {
      console.error(`✗ Course "${courseInput.slug}":`, courseErr?.message);
      process.exit(1);
    }
    coursesUpserted++;
    console.log(`✓ Course ${course.display_order}: ${course.title}`);

    for (const [i, lesson] of lessons.entries()) {
      const { error: lessonErr } = await supabase
        .from("lessons")
        .upsert(
          {
            course_id: course.id,
            slug: lesson.slug,
            title: lesson.title,
            description: lesson.description,
            content_md: lesson.content_md,
            display_order: i + 1,
            duration_min: lesson.duration_min,
            is_free_preview: lesson.is_free_preview,
          },
          { onConflict: "course_id,slug" },
        );

      if (lessonErr) {
        console.error(`  ✗ Lesson "${lesson.slug}":`, lessonErr.message);
        process.exit(1);
      }
      lessonsUpserted++;
      console.log(
        `  ✓ Lesson ${i + 1}: ${lesson.title}${lesson.is_free_preview ? " [free preview]" : ""}`,
      );
    }

    // Seed déclaratif : supprime les leçons de ce cours absentes du seed
    // (sinon les anciens slugs restent orphelins en DB).
    const keepSlugs = lessons.map((l) => l.slug);
    const { data: removed, error: delErr } = await supabase
      .from("lessons")
      .delete()
      .eq("course_id", course.id)
      .not("slug", "in", `(${keepSlugs.join(",")})`)
      .select("slug");
    if (delErr) {
      console.error(`  ✗ cleanup "${course.slug}":`, delErr.message);
      process.exit(1);
    }
    for (const r of removed ?? []) {
      console.log(`  – Lesson supprimée (obsolète) : ${r.slug}`);
    }
  }

  console.log(
    `\n→ ${coursesUpserted} cours + ${lessonsUpserted} leçons seedés.`,
  );
}

// N'exécute le seed que lancé directement (pas via un import, ex. gen-sql.mjs).
import { pathToFileURL } from "node:url";
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  seed().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
