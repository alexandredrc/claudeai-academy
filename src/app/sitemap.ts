import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const BASE = "https://www.claudeai-academy.com";

type Freq = "weekly" | "monthly" | "yearly";

const staticRoutes: { path: string; priority: number; changeFrequency: Freq }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  // Pages piliers organiques : elles visent les requêtes de tête réellement
  // recherchées en France (« formation intelligence artificielle »,
  // « claude ou chatgpt »), là où le reste du site vise « formation Claude AI ».
  { path: "/formation-intelligence-artificielle", priority: 0.95, changeFrequency: "monthly" },
  { path: "/claude-vs-chatgpt", priority: 0.85, changeFrequency: "monthly" },
  { path: "/courses", priority: 0.9, changeFrequency: "weekly" },
  { path: "/tarifs", priority: 0.9, changeFrequency: "monthly" },
  { path: "/prompts", priority: 0.8, changeFrequency: "weekly" },
  // Le kit gratuit est la porte d'entrée organique la plus large : il doit
  // être découvrable, il ne l'était pas.
  { path: "/kit", priority: 0.7, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
  { path: "/a-propos", priority: 0.5, changeFrequency: "yearly" },
  { path: "/contact", priority: 0.4, changeFrequency: "yearly" },
  { path: "/mentions-legales", priority: 0.2, changeFrequency: "yearly" },
  { path: "/cgv", priority: 0.2, changeFrequency: "yearly" },
  { path: "/confidentialite", priority: 0.2, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const entries: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${BASE}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  // Client sans cookies (le sitemap est généré hors contexte de requête utilisateur) ;
  // la lecture du catalogue est publique via RLS, comme sur /courses.
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { data: courses } = await supabase
    .from("courses")
    .select("id, slug, updated_at")
    .order("display_order");

  for (const course of courses ?? []) {
    entries.push({
      url: `${BASE}/courses/${course.slug}`,
      // Date réelle de dernière révision : c'est le signal de fraîcheur que
      // lisent Google et les moteurs génératifs, pas une valeur décorative.
      lastModified: course.updated_at ? new Date(course.updated_at) : now,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  // Seules les leçons en aperçu gratuit sont indexables (les autres sont du
  // contenu verrouillé, sans intérêt pour les moteurs).
  if (courses?.length) {
    const courseById = new Map(courses.map((c) => [c.id, c.slug]));
    const { data: lessons } = await supabase
      .from("lessons")
      .select("slug, course_id, is_free_preview, updated_at")
      .eq("is_free_preview", true);

    for (const lesson of lessons ?? []) {
      const courseSlug = courseById.get(lesson.course_id);
      if (courseSlug) {
        entries.push({
          url: `${BASE}/courses/${courseSlug}/${lesson.slug}`,
          lastModified: lesson.updated_at ? new Date(lesson.updated_at) : now,
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    }
  }

  return entries;
}
