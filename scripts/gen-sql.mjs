// =========================================
// ClaudeAI Academy — Générateur SQL de seed
// Usage : node scripts/gen-sql.mjs > seed.sql
// Produit des upserts idempotents (mêmes règles que seed-content.mjs)
// à exécuter via le MCP Supabase (execute_sql) quand l'exécution
// directe du seed n'est pas possible. Dollar-quoting $md$ pour ne
// jamais s'échapper sur le contenu Markdown.
// =========================================

import { COURSES } from "./seed-content.mjs";

// Garde-fou : si un contenu contenait la séquence du délimiteur, le SQL casserait.
const DELIM = "$md$";
function q(text) {
  if (text == null) return "NULL";
  if (String(text).includes(DELIM)) {
    throw new Error(`Le contenu contient le délimiteur ${DELIM} — changer de tag.`);
  }
  return `${DELIM}${text}${DELIM}`;
}

let out = [];
for (const c of COURSES) {
  const { lessons, ...course } = c;
  out.push(`-- ===== Cours ${course.display_order} : ${course.slug} =====`);
  out.push(
    `insert into courses (slug, title, description, tier_required, display_order, estimated_duration_min, total_lessons)
values (${q(course.slug)}, ${q(course.title)}, ${q(course.description)}, ${q(course.tier_required)}, ${course.display_order}, ${course.estimated_duration_min}, ${lessons.length})
on conflict (slug) do update set title = excluded.title, description = excluded.description, tier_required = excluded.tier_required, display_order = excluded.display_order, estimated_duration_min = excluded.estimated_duration_min, total_lessons = excluded.total_lessons;`,
  );
  lessons.forEach((l, i) => {
    out.push(
      `insert into lessons (course_id, slug, title, description, content_md, display_order, duration_min, is_free_preview)
select id, ${q(l.slug)}, ${q(l.title)}, ${q(l.description)}, ${q(l.content_md)}, ${i + 1}, ${l.duration_min}, ${l.is_free_preview}
from courses where slug = ${q(course.slug)}
on conflict (course_id, slug) do update set title = excluded.title, description = excluded.description, content_md = excluded.content_md, display_order = excluded.display_order, duration_min = excluded.duration_min, is_free_preview = excluded.is_free_preview;`,
    );
  });
  const keep = lessons.map((l) => q(l.slug)).join(", ");
  out.push(
    `delete from lessons where course_id = (select id from courses where slug = ${q(course.slug)}) and slug not in (${keep});`,
  );
}
process.stdout.write(out.join("\n\n") + "\n");
