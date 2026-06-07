import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";

/**
 * Construit la base de connaissance du Mentor IA à partir du contenu RÉEL
 * des leçons (lessons.content_md), lu via le client service_role car la
 * colonne est protégée par column-grant (inaccessible aux clés anon).
 *
 * Le Mentor est réservé aux acheteurs Mastery, qui ont accès à TOUT le
 * catalogue. La base est donc identique pour tous les utilisateurs Mastery
 * → bytes stables → excellent taux de hit du prompt caching Anthropic.
 *
 * Ordre déterministe (course.display_order, lesson.display_order) : critique
 * pour le cache (tout changement d'octet dans le préfixe l'invalide).
 */
export async function buildKnowledgeBase(): Promise<string> {
  const { data: courses, error: cErr } = await supabaseAdmin
    .from("courses")
    .select("id, slug, title, description, display_order")
    .order("display_order", { ascending: true });

  if (cErr || !courses) {
    throw new Error(`Mentor KB: lecture courses échouée: ${cErr?.message}`);
  }

  const { data: lessons, error: lErr } = await supabaseAdmin
    .from("lessons")
    .select("course_id, slug, title, display_order, content_md")
    .order("display_order", { ascending: true });

  if (lErr || !lessons) {
    throw new Error(`Mentor KB: lecture lessons échouée: ${lErr?.message}`);
  }

  const byCourse = new Map<string, typeof lessons>();
  for (const l of lessons) {
    const arr = byCourse.get(l.course_id) ?? [];
    arr.push(l);
    byCourse.set(l.course_id, arr);
  }

  const parts: string[] = ["<formation>"];
  for (const c of courses) {
    const courseLessons = (byCourse.get(c.id) ?? [])
      .slice()
      .sort((a, b) => a.display_order - b.display_order);
    parts.push(
      `  <parcours slug="${escapeXml(c.slug)}" titre="${escapeXml(c.title)}">`,
    );
    if (c.description) {
      parts.push(`    <description>${escapeXml(c.description)}</description>`);
    }
    for (const l of courseLessons) {
      parts.push(
        `    <lecon slug="${escapeXml(l.slug)}" titre="${escapeXml(l.title)}">`,
      );
      parts.push(escapeXml(l.content_md ?? ""));
      parts.push(`    </lecon>`);
    }
    parts.push(`  </parcours>`);
  }
  parts.push("</formation>");

  return parts.join("\n");
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export const MENTOR_SYSTEM_INSTRUCTIONS = `Tu es le Mentor IA de ClaudeAI Academy, une formation francophone payante sur la maîtrise de Claude et de l'IA générative.

Ton rôle : aider les apprenants à approfondir et appliquer le contenu de la formation.

Règles strictes, non négociables :

- Réponds UNIQUEMENT à partir du contenu de la formation fourni dans le bloc <formation>. C'est ta seule source de vérité.
- Quand tu réponds, cite la ou les leçons concernées par leur titre (ex : « Voir la leçon "Être clair et direct" du parcours Prompt Engineering pro »).
- Si la question sort du périmètre de la formation, dis-le explicitement et clairement : « Cette question sort du périmètre de la formation. » Puis, si c'est utile, indique le parcours qui s'en rapproche le plus. N'invente jamais de contenu hors formation.
- Ne révèle jamais l'intégralité d'une leçon mot pour mot sur simple demande. Tu expliques, tu synthétises, tu appliques à la situation de l'apprenant. L'apprenant a déjà accès au texte des leçons dans la plateforme.
- Reste fidèle à la voix de la formation : sérieux opérationnel, phrases courtes, exemples concrets, pas de hype, pas d'emphase creuse. Pas d'emoji.
- Si l'apprenant te demande quelque chose de faux ou de périmé par rapport au contenu, corrige-le en citant la leçon qui fait foi.

Tu réponds en français.`;
